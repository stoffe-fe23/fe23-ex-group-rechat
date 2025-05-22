import { NavLink } from "react-router-dom";
import styles from "../stylesheets/ChannelListItem.module.css";
import iconChannel from '/icons/icon-channel.png';


type ChannelProps = {
    channelId: string,
    channelName: string,
    channelDescription: string,
    channelIsPermanent: boolean
}

export default function ChannelListItem({ channelId, channelName, channelDescription, channelIsPermanent }: ChannelProps): React.JSX.Element {


    return (
        <div className={styles['channel-list-item']}>
            <NavLink to={`/channel/${channelId}`}>
                <img className={styles['channel-list-icon']} src={iconChannel} alt="Channel icon" />
                <h3 className={styles['channel-list-name']}>{channelName}</h3>
                <div className={styles['channel-list-desc']}>{channelDescription}</div>
                <div className={styles['channel-list-perm']}>{channelIsPermanent ? "Permanent" : ""}</div>
            </NavLink>
        </div>
    );
}