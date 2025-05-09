import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../datastore/hooks';
import { selectUserData, userProfileEdit } from '../datastore/sliceChatUser';

import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';
import { ChatUserUpdateData } from '../typedefs/chatUserTypes';


export default function UserProfilePage(): React.JSX.Element {
    const dispatch = useAppDispatch();
    const userData = useAppSelector(selectUserData);

    // Form field states
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [email, setEmail] = useState(userData.userAuth?.email ?? "");
    const [nickname, setNickname] = useState(userData.userProfile?.nickname ?? "");
    const [picture, setPicture] = useState(userData.userProfile?.picture ?? "");

    // Load current values into relevant form fields. 
    useEffect(() => {
        setEmail(userData.userAuth?.email ?? "");
        setNickname(userData.userProfile?.nickname ?? "");
        setPicture(userData.userProfile?.picture ?? "");

    }, [userData, setNickname, setPicture, setEmail]);


    // Form submit handler, save profile data. 
    function onProfileEditSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (password.length && passwordAgain.length && (password != passwordAgain)) {
            alert("New password does not match, try again.");
        }

        const profileData: ChatUserUpdateData = {
            email: email,
            password: password,
            currentPassword: currentPassword,
            picture: picture,
            nickname: nickname,
        };

        console.log("onProfileEditSubmit()", profileData);
        dispatch(userProfileEdit(profileData));
    }

    return (
        <>
            <section>
                <h2>
                    User profile
                </h2>
                <form onSubmit={onProfileEditSubmit}>
                    <fieldset>
                        <label htmlFor='currentPassword'>Your password</label>
                        <input type="password" name="currentPassword" id="currentPassword" value={currentPassword} onChange={(evt) => setCurrentPassword(evt.target.value)} />
                        <div>Note: You must enter your current password to be able to change your profile information.</div>
                    </fieldset>
                    <fieldset>
                        <h3>User avatar</h3>
                        <label htmlFor='nickname'>Screen name</label>
                        <input type="text" name="nickname" id="nickname" value={nickname} onChange={(evt) => setNickname(evt.target.value)} />
                        <div>The name you will be known as to other users.</div>

                        <img src={picture && picture.length ? picture : userIconDef} alt="Current user profile picture" />
                        <label htmlFor='picture'>Profile picture</label>
                        <input type="text" name="picture" id="picture" value={picture} onChange={(evt) => setPicture(evt.target.value)} />
                        <div>URL to a picture shown with your name in chat channels. The picture should be square and no larger than 80 by 80 pixels, and in jpeg, png, gif or webp format.</div>
                    </fieldset>
                    <fieldset>
                        <h3>Change email address</h3>
                        <label htmlFor='email'>E-mail address</label>
                        <input type="email" name="email" id="email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
                        <div>Note: Changing your email will send a new verification message to the specified e-mail address. Your account will be locked until you click the link in that message.</div>
                    </fieldset>
                    <fieldset>
                        <h3>Change password</h3>
                        <label htmlFor='password'>Your new password</label>
                        <input type="password" name="password" id="password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
                        <label htmlFor='passwordAgain'>Repeat your new password</label>
                        <input type="password" name="passwordAgain" id="passwordAgain" value={passwordAgain} onChange={(evt) => setPasswordAgain(evt.target.value)} />
                    </fieldset>
                    <div>
                        <button>Save profile</button>
                    </div>
                </form>
            </section>
        </>
    );
}


