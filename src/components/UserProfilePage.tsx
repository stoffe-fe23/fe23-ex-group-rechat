import React, { useEffect, useState } from 'react';
// import { NavLink } from 'react-router-dom';
// import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/UserProfilePage.module.css";
import { useUserEditMutation, useUserLoadQuery } from '../datastore/userSlice';


export default function UserProfilePage(): React.JSX.Element {

    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const [userEdit, { isLoading: userEditIsLoading, isError: userEditIsError, error: userEditError }] = useUserEditMutation();

    // Form field states
    const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [email, setEmail] = useState(userData?.email ?? "");
    const [nickname, setNickname] = useState(userData?.nickname ?? "");
    const [picture, setPicture] = useState(userData?.picture ?? "");

    // Load current values into relevant form fields. 
    useEffect(() => {
        setEmail(userData?.email ?? "");
        setNickname(userData?.nickname ?? "");
        setPicture(userData?.picture ?? "");

    }, [userData, setNickname, setPicture, setEmail]);

    // Form submit handler, save profile data. 
    async function onProfileEditSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (password.length && passwordAgain.length && (password != passwordAgain)) {
            alert("New password does not match, try again.");
        }

        const editUserData = await userEdit({ nickname, email, picture, password, currentPassword }).unwrap();
        console.log("onProfileEditSubmit()", { nickname, email, picture, password, currentPassword }, editUserData);
    }

    return (
        <>
            <section className={styles["user-profile"]}>
                <h2>
                    User profile
                </h2>
                {userIsLoading || userEditIsLoading && <div>Please wait...</div>}
                {!userData || !userData.authenticated && <div>You must be logged on to view your user profile.</div>}
                {userData && userData.authenticated &&
                    <form onSubmit={onProfileEditSubmit} className={styles["user-profile-form"]}>
                        <div className={styles['columns']}>
                            <fieldset>
                                <h3>User Avatar</h3>
                                <div className={styles['field-item']}>
                                    <img src={picture && picture.length ? picture : userIconDef} alt="Current user profile picture" className={styles["profile-pic-preview"]} />
                                    <label htmlFor='picture'>Picture</label>
                                    <input type="text" name="picture" id="picture" value={picture} onChange={(evt) => setPicture(evt.target.value)} />
                                    <div className={styles['description']}>URL to a picture shown with your name in chat channels. The picture should be square and no larger than 80 by 80 pixels, and in jpeg, png, gif or webp format.</div>
                                </div>

                                <div className={styles['field-item']}>
                                    <label htmlFor='nickname'>Screen name</label>
                                    <input type="text" name="nickname" id="nickname" value={nickname} onChange={(evt) => setNickname(evt.target.value)} />
                                    <div className={styles['description']}>The name you will be known as to other users.</div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className={styles['field-item']}>
                                    <h3>Change email address</h3>
                                    <label htmlFor='email'>E-mail address</label>
                                    <input type="email" name="email" id="email" value={email} onChange={(evt) => setEmail(evt.target.value)} />
                                    <div className={styles['description']}>Note: Changing your email will send a new verification message to the specified e-mail address. Your account will be locked until you click the link in that message.</div>
                                </div>

                                <div className={styles['field-item']}>
                                    <h3>Change password</h3>
                                    <label htmlFor='password'>Your new password</label>
                                    <input type="password" name="password" id="password" value={password} onChange={(evt) => setPassword(evt.target.value)} />
                                    <label htmlFor='passwordAgain'>Repeat your new password</label>
                                    <input type="password" name="passwordAgain" id="passwordAgain" value={passwordAgain} onChange={(evt) => setPasswordAgain(evt.target.value)} />
                                </div>

                                <div className={styles['field-item']}>

                                    <label htmlFor='currentPassword'>Your current password</label>
                                    <input type="password" name="currentPassword" id="currentPassword" value={currentPassword} onChange={(evt) => setCurrentPassword(evt.target.value)} />
                                    <div className={styles['description']}>Note: You must enter your current password to be able to change your e-mail address or password.</div>
                                </div>

                            </fieldset>
                        </div>
                        <div className={styles['form-buttons']}>
                            <button>Save profile</button>
                        </div>
                    </form>
                }
            </section >
        </>
    );
}


