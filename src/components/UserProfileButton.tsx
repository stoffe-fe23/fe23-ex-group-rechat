import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/UserProfileButton.module.css";
import { useUserLoadQuery, useUserLogoutMutation } from '../datastore/userSlice';


export default function UserProfileButton(): React.JSX.Element {

    const navigate = useNavigate();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const [userLogout, { isLoading: userLogoffIsLoading, error: userLogoffError }] = useUserLogoutMutation();

    function onLogoffSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();
        userLogout({});
        navigate("/");
    }

    return (
        <>
            <div className={styles["user-profile-button"]}>
                {userLogoffIsLoading && <div>Please wait...</div>}
                {userData && userData.authenticated && <div className={styles["user-profile-card"]}>
                    <NavLink className={styles["picture-link"]} to="/user/profile"><img src={userData.picture && userData.picture.length > 0 ? userData.picture : userIconDef} className={styles["picture"]} /></NavLink>
                    <NavLink className={styles["nickname-link"]} to="/user/profile"><div className={styles["nickname"]}>{userData.nickname ?? "Anonymous"}</div></NavLink>
                    <form onSubmit={onLogoffSubmit} className={styles["logoff-form"]}>
                        <button>Log off</button>
                    </form>
                </div>}
                {!userData || !userData.authenticated && <div className={styles["user-profile-card"]}>
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


