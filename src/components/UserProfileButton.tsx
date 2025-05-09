import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../datastore/hooks';
import { selectUserData, selectUserName, selectUserPicture, userLogoff } from '../datastore/sliceChatUser';

import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';


export default function UserProfileButton(): React.JSX.Element {

    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);

    function onLogoffSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();
        dispatch(userLogoff());
    }

    return (
        <>
            <div className="user-profile-button">
                {userData.authenticated && <>
                    <NavLink to="/user/profile">
                        <img src={userData.userProfile?.picture && userData.userProfile.picture.length > 0 ? userData.userProfile?.picture : userIconDef} />
                        <div>{userData.userProfile?.nickname ?? "No name set"} | {userData.userAuth?.email ?? "-"}</div>
                    </NavLink>
                    <div>
                        <form onSubmit={onLogoffSubmit}>
                            <button>Log off</button>
                        </form>
                    </div>
                </>}
                {!userData.authenticated && <>
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


