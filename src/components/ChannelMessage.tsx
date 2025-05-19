// import { NavLink } from "react-router-dom";
import { ChatMessage } from "../typedefs/chatChannelTypes";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']


type ChannelMessageProps = {
    messageData: ChatMessage
}

export default function ChannelMessage({ messageData }: ChannelMessageProps): React.JSX.Element {


    return (
        <div className='channel-item'>
            <div>{messageData.author}</div>
            <div>{messageData.postdate as number}</div>
            <div>{messageData.content}</div>
        </div>
    );
}