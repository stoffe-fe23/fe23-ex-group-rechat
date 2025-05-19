import { NavLink } from "react-router-dom";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']


type ChannelProps = {
    channelId: string,
    channelName: string,
    channelDescription: string,
    channelIsPermanent: boolean
}

export default function ChannelListItem({ channelId, channelName, channelDescription, channelIsPermanent }: ChannelProps): React.JSX.Element {


    return (
        <div className='channel-item'>
            <div><NavLink to={`/channel/${channelId}`}>{channelName}</NavLink></div>
            <div>{channelDescription}</div>
            <div>{channelIsPermanent ? "Permanent" : ""}</div>
        </div>
    );
}