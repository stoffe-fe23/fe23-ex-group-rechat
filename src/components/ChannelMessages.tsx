import { useGetUserProfileListQuery, useLoadMessagesQuery } from "../datastore/chatSlice";
import ChannelMessage from "./ChannelMessage";
import { ChannelUserProfile } from "../typedefs/chatChannelTypes";

import styles from "../stylesheets/ChannelMessages.module.css";



type ChannelMessagesProps = {
    channelId: string,
}

export default function ChannelMessages({ channelId }: ChannelMessagesProps): React.JSX.Element {

    // Load messages in this channel
    const { data: messagesList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadMessagesQuery(channelId);

    // Load lookup table for user nicknames and pictures
    const { data: usersList, isLoading: userListIsLoading, isError: userListIsError, error: userListError } = useGetUserProfileListQuery();

    return (
        <div className={styles['channel-messages-list']}>
            {(listIsLoading || userListIsLoading) && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
            {!messagesList || !messagesList.length && <div>There are no messages in this channel yet. Say something?</div>}
            {messagesList?.map((msg, idx) => <ChannelMessage
                key={msg.messageid ?? idx}
                messageData={msg}
                authorData={(usersList ? usersList?.find((usr) => usr.authid == msg.author) : { authid: "", nickname: "Anonymous", picture: "" }) as ChannelUserProfile}
            />)}
            {(listIsError || userListIsError) && <div className={styles['error-message']}>An error occurred! ({listError != undefined ? listError as string : ""}{userListError != undefined ? userListError as string : ""})</div>}
        </div>
    );
}
