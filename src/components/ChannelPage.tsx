import { Link, NavLink, useParams } from "react-router-dom";
import ChannelMessages from "./ChannelMessages";
import ChannelPostMessage from "./ChannelPostMessage";
import { useUserLoadQuery } from "../datastore/userSlice";
import { useGetChannelQuery, useJoinChannelMutation } from "../datastore/chatSlice";
import { useEffect } from "react";
import ChannelUsers from "./CHannelUsers";
import styles from "../stylesheets/ChannelPage.module.css";


export default function ChannelPage(): React.JSX.Element {

    const { channelId } = useParams<string>();

    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const { data: channelData, isLoading: channelIsLoading, isError: channelIsError, error: channelError } = useGetChannelQuery(channelId ?? "");
    const [joinChannel, { isLoading: joinIsLoading, isError: joinIsError, error: joinError }] = useJoinChannelMutation();

    // TODO: Leave channel when closing browser?
    // TODO: Get channel name / desc

    useEffect(() => {
        if (channelId && channelId.length && userData && (channelId != userData.channelid)) {
            console.log("************** JOIN CHANNEL...");
            joinChannel(channelId);
        }
        else {
            console.log("############## ALREADY IN CHANNEL...",);
        }
    }, [userData, joinChannel]);

    return (
        <div className={styles['channel-page']}>
            <div className={styles['channel-page-header']}>
                <h2 className={styles['channel-page-title']}>{channelData?.name ?? "Untitled channel"}</h2>
                <div className={styles['channel-page-desc']}>{channelData?.description ?? ""}</div>
            </div>
            <div className={styles['channel-page-users']}><ChannelUsers channelId={channelId ?? ""} /></div>
            <div className={styles['channel-page-messages']}>
                {(userIsLoading || joinIsLoading || channelIsLoading) && <div>Please wait...</div>}
                <ChannelPostMessage channelId={channelId ?? ""} />
                <ChannelMessages channelId={channelId ?? ""} />
            </div>
        </div>
    );
}