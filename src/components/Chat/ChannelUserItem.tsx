/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Component with a card for a user in the user list of a channel.  
*/
// import { NavLink } from "react-router-dom";
import { ChannelUser } from "../../typedefs/chatChannelTypes";
import { useEffect, useState } from "react";

import styles from "../../stylesheets/ChannelUserItem.module.css";
import userIconDef from '/usericon-default.png';

type ChannelUserItemProps = {
    userData: ChannelUser,
    isAdmin: boolean
}

// If the user has done anything within 15 minutes from now they are considered Active
const ACTIVITY_THRESHOLD = (1000 * 60 * 15);

// Helper converting Activity timestamp number (in seconds) to a text representation using Swedish locale (YYYY-mm-dd HH:ii:ss)
function timestampToDateString(time: number, locale: string = 'sv-SE') {
    if (time == 0) {
        return "No activity yet";
    }
    const dateObj = new Date(time * 1000);
    return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(locale)}`;
}

// Check if the last time the user did anything falls within the threshold of seconds. 
function getIsUserActive(userData: ChannelUser, threshold: number): boolean {
    return ((userData.activity as number) * 1000) > (Date.now() - threshold);
}


export default function ChannelUserItem({ userData, isAdmin }: ChannelUserItemProps): React.JSX.Element {

    // For updating the indicator if the user is considered to be active
    const [userIsActive, setUserIsActive] = useState<boolean>(getIsUserActive(userData, ACTIVITY_THRESHOLD));

    // If the user picture cannot load, track to allow using default icon instead
    const [isPictureBroken, setIsPictureBroken] = useState<boolean>(false);

    function onPictureError(): void {
        setIsPictureBroken(true);
    }

    useEffect(() => {
        // Re-check user Active status every 5 seconds
        setUserIsActive(getIsUserActive(userData, ACTIVITY_THRESHOLD));
        const activityTimer = setInterval(() => setUserIsActive(getIsUserActive(userData, ACTIVITY_THRESHOLD)), 5000);
        return () => {
            clearInterval(activityTimer)
        };
    }, [userData]);

    return (
        <div className={styles['channel-user']}>
            <img className={styles['channel-user-picture']} src={!isPictureBroken && userData.picture && userData.picture.length ? userData.picture : userIconDef} alt="User picture" onError={onPictureError} />
            <div className={`${styles['channel-user-name']} ${isAdmin ? styles['channel-user-admin'] : ""}`}>{userData.nickname}</div>
            <div className={styles['channel-user-activity']}>
                {timestampToDateString(userData.activity as number)}
                <span className={userIsActive ? styles['channel-user-active'] : styles['channel-user-inactive']}>&nbsp;</span>
            </div>
        </div>
    );
}