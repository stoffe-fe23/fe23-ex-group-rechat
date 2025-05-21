// import { NavLink } from "react-router-dom";
import { ChannelUser, ChatMessage } from "../typedefs/chatChannelTypes";
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/ChannelUserItem.module.css";

type ChannelUserItemProps = {
    userData: ChannelUser
}

function timestampToDateString(time: number, locale: string = 'sv-SE') {
    const dateObj = new Date(time * 1000);
    return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(locale)}`;
}


export default function ChannelUserItem({ userData }: ChannelUserItemProps): React.JSX.Element {

    // If the user has done anything within the last hour they are considered Active
    const userIsActive: boolean = ((userData.activity as number) * 1000) > (Date.now() - (1000 * 60 * 60));

    return (
        <div className={styles['channel-user']}>
            <img className={styles['channel-user-picture']} src={userData.picture && userData.picture.length ? userData.picture : userIconDef} alt="User picture" />
            <div className={styles['channel-user-name']}>{userData.nickname}</div>
            <div className={styles['channel-user-activity']}>
                {timestampToDateString(userData.activity as number)}
                <span className={userIsActive ? styles['channel-user-active'] : styles['channel-user-inactive']}>&nbsp;</span>
            </div>
        </div>
    );
}