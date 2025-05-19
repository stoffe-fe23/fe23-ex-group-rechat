import { NavLink } from "react-router-dom";
import { useLoadMessagesQuery } from "../datastore/chatSlice";
import ChannelMessage from "./ChannelMessage";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']


type ChannelMessagesProps = {
    channelId: string,
}

export default function ChannelMessages({ channelId }: ChannelMessagesProps): React.JSX.Element {

    const { data: messagesList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadMessagesQuery(channelId);

    return (
        <div className='channel-messages'>
            {!messagesList || !messagesList.length && <div>There are no messages in this channel. Say something.</div>}
            {messagesList?.map((msg, idx) => <ChannelMessage key={msg.messageid ?? idx} messageData={msg} />)}
        </div>
    );
}
