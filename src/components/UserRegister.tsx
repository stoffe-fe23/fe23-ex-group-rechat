import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import userIconNone from '/usericon-default.png';
import styles from "../stylesheets/UserRegister.module.css";
import { useUserRegisterMutation } from '../datastore/userSlice';
import { useNavigate } from 'react-router';
import iconUser from "/icons/icon-user-add.png";
import PasswordChecker from './PasswordChecker';

function getFirebaseErrorMessage(code: string): string {
    let errorMessage = "";
    switch (code) {
        case "auth/email-already-in-use": errorMessage = "The specified email address is already in use."; break;
        case "auth/weak-password": errorMessage = "The password must be at least 6 characters long."; break;
        case "auth/missing-password": errorMessage = "You must enter a password for your account."; break;
        default: errorMessage = `Error: ${code}`; break;
    }
    return errorMessage;
}


export default function UserRegister(): React.JSX.Element {

    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const [userRegister, { isLoading: userRegisterIsLoading, isError: userRegisterIsError, error: userRegisterError }] = useUserRegisterMutation();

    async function onRegisterSubmit(evt: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();

        if (password.length && passwordAgain.length && (password != passwordAgain)) {
            alert("The password do not match, try again.");
            return;
        }

        try {
            const newUserData = await userRegister({ nickname, email, password }).unwrap();
            console.log("REGISTER NEW USER:", newUserData);
            navigate("/user/login/new");
        }
        catch (error) {
            console.error("REGISTER NEW USER ERROR:", error);
            setPassword("");
            setPasswordAgain("");
        }
    }

    return (
        <>
            <section className={styles['register-page']}>
                <div className={styles['register-leftcol']}>
                    <div className={styles['register-logo']}>Group <span>Re</span>Chat</div>
                </div>
                <div className={styles['register-rightcol']}>
                    <form onSubmit={onRegisterSubmit} className={styles['register-form']}>
                        <div>
                            <img src={userIconNone} alt="New user icon" />
                            <h2>
                                Create user account
                            </h2>
                        </div>
                        <div>
                            <label htmlFor='nickname'>Screen name</label>
                            <input type="text" id="nickname" name="nickname" value={nickname} onChange={(evt) => setNickname(evt.target.value)} minLength={2} maxLength={20} required></input>
                        </div>
                        <div>
                            <label htmlFor='email'>E-mail address</label>
                            <input type="email" id="email" name="email" value={email} onChange={(evt) => setEmail(evt.target.value)} required></input>
                        </div>
                        <div>
                            <label htmlFor='password'>Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={(evt) => setPassword(evt.target.value)} minLength={6} maxLength={100} required></input>
                        </div>
                        <div>
                            <label htmlFor='password-repeat'>Repeat password</label>
                            <PasswordChecker password={password} passwordAgain={passwordAgain} minLength={6} />
                            <input type="password" id="password-repeat" name="password-repeat" value={passwordAgain} onChange={(evt) => setPasswordAgain(evt.target.value)} minLength={6} maxLength={100}></input>
                        </div>
                        {userRegisterIsError && <div className={styles['error-message']}>{getFirebaseErrorMessage(userRegisterError as string)}</div>}
                        <div>
                            <button disabled={userRegisterIsLoading}>
                                {userRegisterIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                                <img src={iconUser} alt="Create user account" />Join
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
}


