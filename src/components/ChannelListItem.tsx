import { NavLink } from "react-router-dom";
import styles from "../stylesheets/ChannelListItem.module.css";


type ChannelProps = {
    channelId: string,
    channelName: string,
    channelDescription: string,
    channelIsPermanent: boolean
}

export default function ChannelListItem({ channelId, channelName, channelDescription, channelIsPermanent }: ChannelProps): React.JSX.Element {


    return (
        <div className={styles['channel-list-item']}>
            <h3 className={styles['channel-list-name']}><NavLink to={`/channel/${channelId}`}>{channelName}</NavLink></h3>
            <div className={styles['channel-list-desc']}>{channelDescription}</div>
            <div className={styles['channel-list-perm']}>{channelIsPermanent ? "Permanent" : ""}</div>
        </div>
    );
}