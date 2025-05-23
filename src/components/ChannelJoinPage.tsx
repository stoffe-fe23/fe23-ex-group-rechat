import { NavLink } from "react-router-dom";
import { useListChannelsQuery } from "../datastore/chatSlice";
import ChannelListItem from "./ChannelListItem";
import styles from "../stylesheets/ChannelJoinPage.module.css";
import { useUserLoadQuery } from "../datastore/userSlice";
import PageTabs from "./PageTabs";

// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

export default function ChannelJoinPage(): React.JSX.Element {

    const { data: channelList, isLoading: listIsLoading, isError: listIsError, error: listError } = useListChannelsQuery();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    return (
        <>
            <section className={styles['channel-join']}>
                <h2>Join a channel</h2>
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
                {userData?.authenticated && <NavLink className={styles['channel-create']} to="/channel/create">Create new channel</NavLink>}
            </section>
        </>
    );
}