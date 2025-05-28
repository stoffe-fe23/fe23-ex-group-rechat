import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/UserProfileButton.module.css";
import { useUserLoadQuery, useUserLogoutMutation } from '../datastore/userSlice';
import { useUnsubListenersMutation } from '../datastore/chatSlice';


export default function UserProfileButton(): React.JSX.Element {

    const navigate = useNavigate();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const [userLogout, { isLoading: userLogoffIsLoading, isError: userIsLogoffError, error: userLogoffError }] = useUserLogoutMutation();
    const [unsubListeners, { isLoading: resetIsLoading, isError: resetIsError, error: resetError }] = useUnsubListenersMutation();

    const [isPictureBroken, setIsPictureBroken] = useState<boolean>(false);

    function onLogoffSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();
        unsubListeners();
        userLogout();
        navigate("/");
    }

    function onPictureError(): void {
        setIsPictureBroken(true);
    }

    return (
        <>
            <div className={styles["user-profile-button"]}>
                {(userIsError || userIsLogoffError || resetIsError) && <div className={styles['error-message']}>{userError as string}{userLogoffError as string}{resetError as string}</div>}
                {userData && userData.authenticated && <div className={styles["user-profile-card"]}>
                    {(userLogoffIsLoading || resetIsLoading || userIsLoading) && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    <NavLink className={styles["picture-link"]} to="/user/profile"><img src={!isPictureBroken && userData.picture && userData.picture.length > 0 ? userData.picture : userIconDef} className={styles["picture"]} onError={onPictureError} /></NavLink>
                    <NavLink className={styles["nickname-link"]} to="/user/profile"><div className={styles["nickname"]}>{userData.nickname ?? "Anonymous"}</div></NavLink>
                    <form onSubmit={onLogoffSubmit} className={styles["logoff-form"]}>
                        <button>Log off</button>
                    </form>
                </div>}
                {!userData || !userData.authenticated && <div className={styles["user-profile-card"]}>
                    {(userLogoffIsLoading || resetIsLoading || userIsLoading) && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    <NavLink className={styles["picture-link"]} to="/user/login"><img src={userIconNone} className={styles["picture"]} /></NavLink>
                    <NavLink className={styles["nickname-link"]} to="/user/login"><div className={styles["nickname"]}>Not logged in</div></NavLink>

                    <div className={styles["logoff-form"]}>
                        <NavLink className={styles["login-link"]} to="/user/login">Log in</NavLink>
                    </div>
                </div>}
            </div>
        </>
    );
}


