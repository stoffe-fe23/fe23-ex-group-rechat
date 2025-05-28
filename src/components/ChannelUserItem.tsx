// import { NavLink } from "react-router-dom";
import { ChannelUser } from "../typedefs/chatChannelTypes";
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/ChannelUserItem.module.css";
import { useEffect, useState } from "react";

// If the user has done anything within 15 minutes from now they are considered Active
const ACTIVITY_THRESHOLD = (1000 * 60 * 15);

type ChannelUserItemProps = {
    userData: ChannelUser
}

// Helper converting timestamp number (in seconds) to a text representation using Swedish locale (YYYY-mm-dd HH:ii:ss)
function timestampToDateString(time: number, locale: string = 'sv-SE') {
    const dateObj = new Date(time * 1000);
    return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(locale)}`;
}

// Calculate if the last time the user did anything falls within threshold seconds. 
function getIsUserActive(userData: ChannelUser, threshold: number): boolean {
    return ((userData.activity as number) * 1000) > (Date.now() - threshold);
}


export default function ChannelUserItem({ userData }: ChannelUserItemProps): React.JSX.Element {

    const [userIsActive, setUserIsActive] = useState<boolean>(getIsUserActive(userData, ACTIVITY_THRESHOLD));
    const [isPictureBroken, setIsPictureBroken] = useState<boolean>(false);

    function onPictureError(): void {
        setIsPictureBroken(true);
    }

    useEffect(() => {
        // Recalculate user Active status every 5 seconds
        const activityTimer = setInterval(() => setUserIsActive(getIsUserActive(userData, ACTIVITY_THRESHOLD)), 5000);
        return () => {
            clearInterval(activityTimer)
        };
    }, [userData]);

    return (
        <div className={styles['channel-user']}>
            <img className={styles['channel-user-picture']} src={!isPictureBroken && userData.picture && userData.picture.length ? userData.picture : userIconDef} alt="User picture" onError={onPictureError} />
            <div className={styles['channel-user-name']}>{userData.nickname}</div>
            <div className={styles['channel-user-activity']}>
                {timestampToDateString(userData.activity as number)}
                <span className={userIsActive ? styles['channel-user-active'] : styles['channel-user-inactive']}>&nbsp;</span>
            </div>
        </div>
    );
}