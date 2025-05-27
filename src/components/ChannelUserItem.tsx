// import { NavLink } from "react-router-dom";
import { ChannelUser } from "../typedefs/chatChannelTypes";
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/ChannelUserItem.module.css";
import { useEffect, useState } from "react";

// If the user has done anything within the 15 minutes they are considered Active
const ACTIVITY_THRESHOLD = (1000 * 60 * 15);

type ChannelUserItemProps = {
    userData: ChannelUser
}

function timestampToDateString(time: number, locale: string = 'sv-SE') {
    const dateObj = new Date(time * 1000);
    return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(locale)}`;
}

function getIsUserActive(userData: ChannelUser, threshold: number): boolean {
    return ((userData.activity as number) * 1000) > (Date.now() - threshold);
}


export default function ChannelUserItem({ userData }: ChannelUserItemProps): React.JSX.Element {

    // If the user has done something within the time threshold they are considered Active
    const [userIsActive, setUserIsActive] = useState<boolean>(getIsUserActive(userData, ACTIVITY_THRESHOLD));

    useEffect(() => {
        // Update user Active status every 10 seconds
        const activityTimer = setInterval(() => setUserIsActive(getIsUserActive(userData, ACTIVITY_THRESHOLD)), 5000);
        console.log("User Activity Timer setup...", activityTimer);
        return () => {
            console.log("User Activity Timer cleanup...", userData.nickname, activityTimer);
            clearInterval(activityTimer)
        };
    }, [userData]);

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