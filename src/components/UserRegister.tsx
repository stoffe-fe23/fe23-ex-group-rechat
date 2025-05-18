import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import userIconNone from '/usericon-none.png';
import styles from "../stylesheets/UserRegister.module.css";
import { useUserRegisterMutation } from '../datastore/userSlice';


export default function UserRegister(): React.JSX.Element {

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const [userRegister, { isLoading: userRegisterIsLoading, error: userRegisterError }] = useUserRegisterMutation();

    async function onRegisterSubmit(evt: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();

        if (password.length && passwordAgain.length && (password != passwordAgain)) {
            alert("The password do not match, try again.");
            return;
        }

        // TODO: Validate that the user has input a valid-ish email and name/pass of sufficient length! 

        try {
            const newUserData = await userRegister({ nickname, email, password }).unwrap();
            console.log("REGISTER NEW USER:", newUserData);
            // TODO: Redirect to login page with message? 
        }
        catch (error) {
            console.error("REGISTER NEW USER ERROR!", error, userRegisterError);
            // TODO: Handle any errors resulting from registration process? 
        }
    }

    return (
        <>
            <section>
                <h2>
                    Create user account
                </h2>
                {userRegisterIsLoading && <div>Please wait...</div>}
                <form onSubmit={onRegisterSubmit}>
                    <img src={userIconNone} alt="New user icon" />
                    <div>
                        <label htmlFor='nickname'>Screen name</label>
                        <input type="text" id="nickname" name="nickname" value={nickname} onChange={(evt) => setNickname(evt.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor='email'>E-mail address</label>
                        <input type="email" id="email" name="email" value={email} onChange={(evt) => setEmail(evt.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor='password'>Desired password</label>
                        <input type="password" id="password" name="password" value={password} onChange={(evt) => setPassword(evt.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor='password-repeat'>Repeat desired password</label>
                        <input type="password" id="password-repeat" name="password-repeat" value={passwordAgain} onChange={(evt) => setPasswordAgain(evt.target.value)}></input>
                        <div
                            className={`${styles['password-match-indicator']} ${password == passwordAgain ? styles['passwords-match'] : styles['passwords-no-match']}`}
                            id="password-match-indicator"
                            title={password == passwordAgain ? "Passwords match" : "The passwords you have entered do not match!"}
                        ></div>
                    </div>
                    <div><button>Create</button></div>
                </form>
            </section>
        </>
    );
}


