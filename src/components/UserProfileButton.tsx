import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/UserProfileButton.module.css";
import { useUserLoadQuery, useUserLogoutMutation } from '../datastore/userSlice';


export default function UserProfileButton(): React.JSX.Element {

    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const [userLogout, { isLoading: userLogoffIsLoading, error: userLogoffError }] = useUserLogoutMutation();


    function onLogoffSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();
        userLogout({});
    }

    return (
        <>
            <div className={styles["user-profile-button"]}>
                {userLogoffIsLoading && <div>Please wait...</div>}
                {userData && userData.authenticated && <>
                    <NavLink to="/user/profile">
                        <img src={userData.picture && userData.picture.length > 0 ? userData.picture : userIconDef} className={styles["picture"]} />
                        <div>
                            <div className={styles["nickname"]}>{userData.nickname ?? "Anonymous"}</div>
                            <div className={styles["email"]}>{userData.email ?? ""}</div>
                        </div>
                    </NavLink>
                    <form onSubmit={onLogoffSubmit} className={styles["logoff-form"]}>
                        <button>Log off</button>
                    </form>
                </>}
                {!userData || !userData.authenticated && <>
                    <img src={userIconNone} />
                    <div>Not logged in</div>
                    <div>
                        <NavLink to="/user/login">Log in</NavLink>
                    </div>
                </>}
            </div>
        </>
    );
}


