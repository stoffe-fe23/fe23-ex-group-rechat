import { NavLink } from "react-router-dom";
import { useGetUserProfileListQuery, useLoadMessagesQuery } from "../datastore/chatSlice";
import ChannelMessage from "./ChannelMessage";
import { ChannelUserProfile } from "../typedefs/chatChannelTypes";
import style from "../stylesheets/ChannelMessages.module.css";



type ChannelMessagesProps = {
    channelId: string,
}

export default function ChannelMessages({ channelId }: ChannelMessagesProps): React.JSX.Element {

    const { data: messagesList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadMessagesQuery(channelId);
    const { data: usersList, isLoading: userListIsLoading, isError: userListIsError, error: userListError } = useGetUserProfileListQuery();

    return (
        <div className={style['channel-messages-list']}>
            {!messagesList || !messagesList.length && <div>There are no messages in this channel. Say something.</div>}
            {messagesList?.map((msg, idx) => <ChannelMessage
                key={msg.messageid ?? idx}
                messageData={msg}
                authorData={(usersList ? usersList?.find((usr) => usr.authid == msg.author) : { authid: "", nickname: "Anonymous", picture: "" }) as ChannelUserProfile}
            />)}
        </div>
    );
}
