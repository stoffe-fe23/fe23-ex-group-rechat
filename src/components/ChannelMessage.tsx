// import { NavLink } from "react-router-dom";
import { ChannelUser, ChatMessage } from "../typedefs/chatChannelTypes";
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/ChannelMessage.module.css";
// styles['front-page']


type ChannelMessageProps = {
    messageData: ChatMessage,
    authorData: ChannelUser
}

function timestampToDateString(time: number, locale: string = 'sv-SE') {
    const dateObj = new Date(time * 1000);
    return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(locale)}`;
}


export default function ChannelMessage({ messageData, authorData }: ChannelMessageProps): React.JSX.Element {

    if ((authorData == undefined) || (authorData == null)) {
        authorData = { authid: "", nickname: "Anonymous", picture: "", channelid: messageData.channelid, activity: 0 };
    }

    return (
        <div className={styles['channel-message']}>
            <img className={styles['channel-message-picture']} src={authorData.picture && authorData.picture.length ? authorData.picture : userIconDef} alt="User picture" />
            <div className={styles['channel-message-name']}>{authorData.nickname}</div>
            <div className={styles['channel-message-date']}>{timestampToDateString(messageData.postdate as number)}</div>
            <div className={styles['channel-message-text']}>{messageData.content}</div>
        </div>
    );
}