/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Page component for the User Profile page, allowing the current user to update their
    profile information or change their email address or password.   
*/
import React, { useEffect, useState } from 'react';
import userIconDef from '/usericon-default.png';
import iconCheck from "/icons/icon-check.png";
import styles from "../stylesheets/UserProfilePage.module.css";
import { useUserEditMutation, useUserLoadQuery } from '../datastore/userSlice';
import PasswordChecker from './PasswordChecker';

// Translate relevant Firebase error messages to something a bit more human friendly.
function getFirebaseErrorMessage(code: string): string {
    let errorMessage = "";
    switch (code) {
        case "auth/unverified-email": errorMessage = "You must reactivate your account first before continuing. Check your email."; break;
        case "auth/invalid-email": errorMessage = "The specified email address is invalid."; break;
        case "auth/invalid-credential": errorMessage = "Invalid email or password!"; break;
        case "auth/account-exists-with-different-credential":
        case "auth/email-already-in-use": errorMessage = "The specified email address is already in use by another account."; break;
        case "auth/missing-password": errorMessage = "You must enter your current password when changing your email address or password."; break;
        case "permission-denied": errorMessage = "Please activate your account before logging on. Check your email."; break;
        default: errorMessage = `An error occurred! (${code})`; break;
    }
    return errorMessage;
}

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

    const [isPictureBroken, setIsPictureBroken] = useState<boolean>(false);
    const [statusMessage, setStatusMessage] = useState<string>("");

    // Load current values into relevant form fields. 
    useEffect(() => {
        setEmail(userData?.email ?? "");
        setNickname(userData?.nickname ?? "");
        setPicture(userData?.picture ?? "");

    }, [userData, setNickname, setPicture, setEmail]);

    // Form submit handler, save profile data. 
    async function onProfileEditSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            if (password.length && passwordAgain.length && (password != passwordAgain)) {
                alert("The new password does not match, try again.");
            }

            await userEdit({ nickname, email, picture, password, currentPassword }).unwrap();

            // Inform user changes have been saved, hide message after 5 sec. 
            setStatusMessage("Profile changes saved!");
            setTimeout(() => setStatusMessage(""), 5000);
        }
        catch (error: any) {
            console.error("Profile update error:", error);
            setEmail(userData?.email ?? "");
            setStatusMessage("");
        }
    }

    // Change to default icon if no valid image URL has been entered. 
    function onPictureError(): void {
        setIsPictureBroken(true);
    }

    function onPictureUrlChange(value: string): void {
        setIsPictureBroken(false);
        setPicture(value);
    }

    return (
        <>
            <section className={styles["user-profile"]}>
                <h2>
                    User profile
                </h2>
                {!userData || !userData.authenticated && <div>You must be logged on to view your user profile.</div>}
                {userData && userData.authenticated &&
                    <form onSubmit={onProfileEditSubmit} className={styles["user-profile-form"]}>
                        <div className={styles['columns']}>
                            <fieldset>
                                <h3>User Avatar</h3>
                                <div className={styles['field-item']}>
                                    <img src={!isPictureBroken && picture && picture.length ? picture : userIconDef} alt="Current user profile picture" className={styles["profile-pic-preview"]} onError={onPictureError} />
                                    <label htmlFor='picture'>Picture</label>
                                    <input type="text" name="picture" id="picture" value={picture} onChange={(evt) => onPictureUrlChange(evt.target.value)} maxLength={255} />
                                    <div className={styles['description']}>URL to a picture shown with your name in chat channels. The picture should be square and no larger than 80 by 80 pixels, and in jpeg, png, gif or webp format.</div>
                                </div>

                                <div className={styles['field-item']}>
                                    <label htmlFor='nickname'>Screen name</label>
                                    <input type="text" name="nickname" id="nickname" value={nickname} onChange={(evt) => setNickname(evt.target.value)} minLength={2} maxLength={20} required />
                                    <div className={styles['description']}>The name you will be known as to other users.</div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div className={styles['field-item']}>
                                    <h3>Change email address</h3>
                                    <label htmlFor='email'>E-mail address</label>
                                    <input type="email" name="email" id="email" value={email} onChange={(evt) => setEmail(evt.target.value)} required />
                                    <div className={styles['description']}>Note: Changing your email will send a new verification message to the specified e-mail address. <strong>The address will not be changed until you have verified the new address!</strong></div>
                                </div>

                                <div className={styles['field-item']}>
                                    <h3>Change password</h3>
                                    <label htmlFor='password'>Your new password
                                        <PasswordChecker password={password} passwordAgain={passwordAgain} minLength={6} />
                                    </label>
                                    <input type="password" name="password" id="password" value={password} onChange={(evt) => setPassword(evt.target.value)} minLength={6} maxLength={100} />
                                    <label htmlFor='passwordAgain'>Repeat your new password</label>
                                    <input type="password" name="passwordAgain" id="passwordAgain" value={passwordAgain} onChange={(evt) => setPasswordAgain(evt.target.value)} />
                                </div>

                                <div className={styles['field-item']}>
                                    <label htmlFor='currentPassword'>Your current password</label>
                                    <input type="password" name="currentPassword" id="currentPassword" value={currentPassword} onChange={(evt) => setCurrentPassword(evt.target.value)} minLength={6} />
                                    <div className={styles['description']}>Note: You must enter your current password to be able to change your e-mail address or password.</div>
                                </div>

                            </fieldset>
                        </div>
                        {userEditIsError && <div className={styles['error-message']}>{getFirebaseErrorMessage(userEditError as string)} </div>}
                        {userIsError && <div className={styles['error-message']}>{getFirebaseErrorMessage(userError as string)}</div>}
                        {(statusMessage.length > 0) && <div className={styles['status-message']}>{statusMessage}</div>}
                        <div className={styles['form-buttons']}>
                            <button disabled={userEditIsLoading}>
                                {userIsLoading || userEditIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                                <img src={iconCheck} alt="Save user profile" />Save profile
                            </button>
                        </div>
                    </form>
                }
            </section >
        </>
    );
}


