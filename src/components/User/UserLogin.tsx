/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Page component for the login form page.  
*/
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserLoginMutation } from '../../datastore/userSlice';
import { useNavigate } from 'react-router';
import { LoginData } from '../../typedefs/chatUserTypes';

import styles from "../../stylesheets/UserLogin.module.css";
import iconDefUser from "/usericon-default.png";
import iconUser from "/icons/icon-user.png";


type UserLoginProps = {
    isNewUser: boolean
}

// Translate relevant Firebase error messages to something slightly more human friendly to display. 
function getFirebaseErrorMessage(code: string): string {
    let errorMessage = "";
    switch (code) {
        case "auth/user-not-found":
        case "auth/user-disabled":
        case "auth/invalid-credential": errorMessage = "Invalid email or password!"; break;
        case "auth/email-change-needs-verification":
        case "auth/unverified-email": errorMessage = "Your email must be verified before logging in."; break;
        case "permission-denied": errorMessage = "Please activate your account before logging on. Check your email."; break;
        default: errorMessage = `An error occurred! (${code})`; break;
    }
    return errorMessage;
}

export default function UserLogin({ isNewUser }: UserLoginProps): React.JSX.Element {

    const navigate = useNavigate();

    // Form field values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [userLogin, { isLoading, isError, error }] = useUserLoginMutation();

    // Form submit handler - attempt to log on
    async function onLoginSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            await userLogin({ email, password } as LoginData).unwrap();

            // Login successful, clear form fields and move to channel join page. 
            setEmail("");
            setPassword("");
            navigate("/channels");
        }
        catch (err: any) {
            // Login failed, clear the password field
            console.error("Login error", err);
            setPassword("");
        }
    }

    return (
        <>
            <section className={styles['login-page']}>
                <div className={styles['login-leftcol']}>
                    <form onSubmit={onLoginSubmit} className={styles['login-form']}>
                        <div>
                            <img src={iconDefUser} alt="User login icon" />
                            <h2>Log in</h2>
                        </div>
                        <div className={styles['form-field']}>
                            <label htmlFor="login-email">Email address</label>
                            <input id="login-email" name="email" type="email" placeholder="Your email address" onChange={(evt) => setEmail(evt.target.value)} value={email} maxLength={100} minLength={6} required />
                        </div>
                        <div className={styles['form-field']}>
                            <label htmlFor="login-password">Password</label>
                            <input id="login-password" name="password" type="password" placeholder="Password" onChange={(evt) => setPassword(evt.target.value)} value={password} maxLength={50} minLength={6} required />
                        </div>
                        <div>
                            <button disabled={isLoading}>
                                {isLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                                <img src={iconUser} alt="Log on" />Login
                            </button>
                        </div>
                        {isError && <div className={styles['error-message']}>{getFirebaseErrorMessage(error as string)}</div>}
                        <div className={styles['login-register-link']}>
                            <NavLink to="/user/register">Create user account</NavLink>
                        </div>
                        <div className={styles['login-reset-link']}>
                            <NavLink to="/user/passwordreset">Forgot your password?</NavLink>
                        </div>
                    </form>
                </div>
                <div className={styles['login-rightcol']}>
                    {!isNewUser && <div className={styles['login-logo']}>Group <span>Re</span>Chat</div>}
                    {isNewUser && <div className={styles['new-login-info']}>
                        <div><strong>Note! </strong>Please check your email inbox for an email verification message and click on the link provided to activate your account before logging in.</div>
                    </div>}
                </div>
            </section>
        </>
    );
}


