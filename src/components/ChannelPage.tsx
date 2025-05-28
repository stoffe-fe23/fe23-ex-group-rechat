import { NavLink, useParams } from "react-router-dom";
import ChannelMessages from "./ChannelMessages";
import ChannelPostMessage from "./ChannelPostMessage";
import { useUserLoadQuery } from "../datastore/userSlice";
import { useGetChannelQuery, useJoinChannelMutation } from "../datastore/chatSlice";
import { useEffect } from "react";
import ChannelUsers from "./ChannelUsers";
import styles from "../stylesheets/ChannelPage.module.css";
import ChannelLeaveButton from "./ChannelLeaveButton";
import { ChatUserData } from "../typedefs/chatUserTypes";

// Helper to check if the user is currently logged on with an account
function isLoggedIn(user: ChatUserData | undefined): boolean {
    return (user != undefined) && (user.uid != undefined) && (user.uid != null) && (user.uid.length > 0);
}

export default function ChannelPage(): React.JSX.Element {

    const { channelId } = useParams<string>();

    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const { data: channelData, isLoading: channelIsLoading, isError: channelIsError, error: channelError } = useGetChannelQuery(channelId ?? "");
    const [joinChannel, { isLoading: joinIsLoading, isError: joinIsError, error: joinError }] = useJoinChannelMutation();


    // Make current user join the channel if they are not already in it. 
    useEffect(() => {
        if (channelId && channelId.length && userData && (channelId != userData.channelid)) {
            console.log("************** JOIN CHANNEL...");
            joinChannel(channelId);
        }
    }, [userData, joinChannel]);

    return (
        <>
            {!isLoggedIn(userData) && <section className={styles['channel-page']}>
                <div className={styles['login-message']}>You must be logged on to join a channel. <NavLink to="/user/login">Go to the login page.</NavLink></div>
            </section>}
            {isLoggedIn(userData) && <section className={styles['channel-page']}>
                {userIsError || channelIsError || joinIsError && <div className={styles['error-message']}>{userError as string} {channelError as string} {joinError as string}</div>}
                <div className={styles['channel-page-header']}>
                    {userIsLoading || joinIsLoading || channelIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    <h2 className={styles['channel-page-title']}>{channelData?.name ?? "Untitled channel"}</h2>
                    <div className={styles['channel-page-desc']}>{channelData?.description ?? ""}</div>
                </div>
                <div className={styles['channel-page-content']}>
                    <div className={styles['channel-page-users']}>
                        <ChannelLeaveButton />
                        <ChannelUsers channelId={channelId ?? ""} />
                    </div>
                    <div className={styles['channel-page-messages']}>
                        <ChannelPostMessage channelId={channelId ?? ""} />
                        <ChannelMessages channelId={channelId ?? ""} />
                    </div>
                </div>
            </section>}
        </>
    );
}