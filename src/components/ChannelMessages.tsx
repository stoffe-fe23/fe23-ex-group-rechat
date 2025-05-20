import { NavLink } from "react-router-dom";
import { useLoadMessagesQuery, useLoadUsersQuery } from "../datastore/chatSlice";
import ChannelMessage from "./ChannelMessage";
import { ChannelUser } from "../typedefs/chatChannelTypes";
import style from "../stylesheets/ChannelMessages.module.css";



type ChannelMessagesProps = {
    channelId: string,
}

export default function ChannelMessages({ channelId }: ChannelMessagesProps): React.JSX.Element {

    const { data: messagesList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadMessagesQuery(channelId);

    // TODO: Should probably fetch full user list here, or their posts will turn Anonymous if they leave the channel.
    const { data: usersList, isLoading: userListIsLoading, isError: userListIsError, error: userListError } = useLoadUsersQuery(channelId);

    return (
        <div className={style['channel-messages-list']}>
            {!messagesList || !messagesList.length && <div>There are no messages in this channel. Say something.</div>}
            {messagesList?.map((msg, idx) => <ChannelMessage
                key={msg.messageid ?? idx}
                messageData={msg}
                authorData={(usersList ? usersList?.find((usr) => usr.authid == msg.author) : { authid: "", nickname: "Anonymous", picture: "", channelid: msg.channelid, activity: 0 }) as ChannelUser}
            />)}
        </div>
    );
}
