/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Page component for the user password reset form.  
*/
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserPasswordResetMutation } from '../datastore/userSlice';
import { useNavigate } from 'react-router';

import styles from "../stylesheets/UserForgotPassword.module.css";
import iconDefUser from "/usericon-default.png";
import iconUser from "/icons/icon-user.png";


// Translate relevant Firebase error messages to something slightly more human friendly to display. 
function getFirebaseErrorMessage(code: string): string {
    let errorMessage = "";
    switch (code) {
        case "auth/user-not-found":
        case "auth/user-disabled":
        case "auth/invalid-credential": errorMessage = "Invalid email address!"; break;
        default: errorMessage = `An error occurred! (${code})`; break;
    }
    return errorMessage;
}

export default function UserForgotPassword(): React.JSX.Element {

    const navigate = useNavigate();

    // Form field value
    const [email, setEmail] = useState("");

    const [userPasswordReset, { isLoading, isError, error }] = useUserPasswordResetMutation();

    // Form submit handler - attempt to log on
    async function onResetFormSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            await userPasswordReset(email).unwrap();

            // Password reset email sent, go back to login form.
            setEmail("");
            navigate("/user/login");
        }
        catch (err: any) {
            // Password reset failed
            console.error("Password recovery error", err);
            setEmail("");
        }
    }

    return (
        <>
            <section className={styles['password-page']}>
                <div className={styles['password-leftcol']}>
                    <form onSubmit={onResetFormSubmit} className={styles['password-form']}>
                        <div>
                            <img src={iconDefUser} alt="User login icon" />
                            <h2>Forgot password?</h2>
                        </div>
                        <div className={styles['password-reset-info']}>If you have forgotten your password enter your account email address below. A message with a password reset link will be sent to that address.</div>
                        <div className={styles['form-field']}>
                            <label htmlFor="password-email">Email address</label>
                            <input id="password-email" name="email" type="email" placeholder="Your email address" onChange={(evt) => setEmail(evt.target.value)} value={email} maxLength={100} minLength={6} required />
                        </div>
                        <div>
                            <button disabled={isLoading}>
                                {isLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                                <img src={iconUser} alt="Reset password" />Reset password
                            </button>
                        </div>
                        {isError && <div className={styles['error-message']}>{getFirebaseErrorMessage(error as string)}</div>}
                        <div className={styles['password-register-link']}>
                            <NavLink to="/user/login">Log in</NavLink>
                        </div>
                    </form>
                </div>
                <div className={styles['password-rightcol']}>
                    <div className={styles['password-logo']}>Group <span>Re</span>Chat</div>
                </div>
            </section>
        </>
    );
}


