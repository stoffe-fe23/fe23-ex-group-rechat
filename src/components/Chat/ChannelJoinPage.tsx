/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Page component showing a list of existing channels to join, and a button linking to creating a new channel.  
*/
import { NavLink } from "react-router-dom";
import { useListChannelsQuery } from "../../datastore/chatSlice";
import ChannelListItem from "./ChannelListItem";
import { useUserLoadQuery } from "../../datastore/userSlice";

import styles from "../../stylesheets/ChannelJoinPage.module.css";


export default function ChannelJoinPage(): React.JSX.Element {

    const { data: channelList, isLoading: listIsLoading, isError: listIsError, error: listError } = useListChannelsQuery();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    return (
        <>
            <section className={styles['channel-join']}>
                {(listIsError || userIsError) && <div className="error-message">An error occurred! ({listError != undefined ? listError as string : ""}{userError != undefined ? userError as string : ""})</div>}
                <div className={styles['leftcol']}>
                    <div className={styles['logo']}>Group <span>Re</span>Chat</div>
                    <h2>Join a channel</h2>
                    {userData?.authenticated && <NavLink className={styles['channel-create']} to="/channel/create">Create new channel</NavLink>}
                </div>
                <div className={styles['rightcol']}>
                    {(listIsLoading || userIsLoading) && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    {!userData?.authenticated && <div>You must be logged in to join a channel.</div>}
                    {userData?.authenticated && <div className={styles['channel-join-list']}>
                        {!channelList || !channelList.length && <div>There are currently no active chat channels.</div>}
                        {channelList?.map((chan, idx) => <ChannelListItem
                            key={chan.channelid ?? idx}
                            channelId={chan.channelid ?? ""}
                            channelName={chan.name}
                            channelDescription={chan.description}
                            channelIsPermanent={chan.permanent}
                        />)}
                    </div>}
                </div>
            </section>
        </>
    );
}