import React, { useState } from 'react';
// import { NavLink } from 'react-router-dom';
import userIconNone from '/usericon-none.png';
import styles from "../stylesheets/UserRegister.module.css";
import { useUserRegisterMutation } from '../datastore/userSlice';
import { useNavigate } from 'react-router';


export default function UserRegister(): React.JSX.Element {

    const navigate = useNavigate();
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
            navigate("/user/login/new");
        }
        catch (error) {
            console.error("REGISTER NEW USER ERROR!", error, userRegisterError);
            // TODO: Handle any errors resulting from registration process? 
        }
    }

    return (
        <>
            <section className={styles['register-page']}>
                <div className={styles['register-leftcol']}>
                    foo!
                </div>
                <div className={styles['register-rightcol']}>
                    {userRegisterIsLoading && <div>Please wait...</div>}

                    <form onSubmit={onRegisterSubmit} className={styles['register-form']}>
                        <div>
                            <img src={userIconNone} alt="New user icon" />
                            <h2>
                                Create user account
                            </h2>
                        </div>
                        <div>
                            <label htmlFor='nickname'>Screen name</label>
                            <input type="text" id="nickname" name="nickname" value={nickname} onChange={(evt) => setNickname(evt.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor='email'>E-mail address</label>
                            <input type="email" id="email" name="email" value={email} onChange={(evt) => setEmail(evt.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor='password'>Password</label>
                            <input type="password" id="password" name="password" value={password} onChange={(evt) => setPassword(evt.target.value)}></input>
                        </div>
                        <div>
                            <label htmlFor='password-repeat'>Repeat password</label>
                            <div
                                className={`${styles['password-match-indicator']} ${password == passwordAgain ? styles['passwords-match'] : styles['passwords-no-match']}`}
                                id="password-match-indicator"
                                title={password == passwordAgain ? "Passwords match" : "The passwords you have entered do not match!"}
                            ></div>
                            <input type="password" id="password-repeat" name="password-repeat" value={passwordAgain} onChange={(evt) => setPasswordAgain(evt.target.value)}></input>
                        </div>
                        <div><button>Create</button></div>
                    </form>
                </div>
            </section>
        </>
    );
}


