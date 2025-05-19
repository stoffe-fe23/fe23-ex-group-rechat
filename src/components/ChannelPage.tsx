import { Link, NavLink, useParams } from "react-router-dom";
import ChannelMessages from "./ChannelMessages";
import ChannelPostMessage from "./ChannelPostMessage";
import { useUserLoadQuery } from "../datastore/userSlice";
import { useGetChannelQuery, useJoinChannelMutation } from "../datastore/chatSlice";
import { useEffect } from "react";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

export default function ChannelPage(): React.JSX.Element {

    const { channelId } = useParams<string>();

    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const { data: channelData, isLoading: channelIsLoading, isError: channelIsError, error: channelError } = useGetChannelQuery(channelId ?? "");
    const [joinChannel, { isLoading: joinIsLoading, isError: joinIsError, error: joinError }] = useJoinChannelMutation();

    // TODO: Leave channel when closing browser?
    // TODO: Get channel name / desc

    useEffect(() => {
        if (channelId && channelId.length && userData && (channelId != userData.channelid)) {
            console.log("************** JOIN THE BLOODY CHANNEL....");
            joinChannel(channelId);
        }
        else {
            console.log("############## FFS!!!!", channelId, "user", userData, (channelId != userData?.channelid));
        }
    }, [userData, joinChannel]);

    return (
        <div className='channel-page'>
            <div>
                <h2>{channelData?.name ?? "Untitled channel"}</h2>
                <div>{channelData?.description ?? ""}</div>
            </div>
            <div>TODO: Participant list...</div>
            <div>
                {(userIsLoading || joinIsLoading || channelIsLoading) && <div>Please wait...</div>}
                <ChannelMessages channelId={channelId ?? ""} />
                <ChannelPostMessage channelId={channelId ?? ""} />
            </div>
        </div>
    );
}