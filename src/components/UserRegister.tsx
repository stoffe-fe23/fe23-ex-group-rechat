import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../datastore/hooks';
import { userRegister } from '../datastore/sliceChatUser';

import userIconNone from '/usericon-none.png';
import userIconDef from '/usericon-default.png';
import { RegisterUserData } from '../typedefs/chatUserTypes';


export default function UserRegister(): React.JSX.Element {

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");

    const dispatch = useAppDispatch();
    // const userData = useAppSelector(selectUserData);

    function onRegisterSubmit(evt: React.SyntheticEvent<HTMLFormElement>): void {
        evt.preventDefault();

        if (password.length && passwordAgain.length && (password != passwordAgain)) {
            alert("The password do not match, try again.");
            return;
        }

        const newUserData: RegisterUserData = {
            nickname: nickname,
            email: email,
            password: password
        }

        dispatch(userRegister(newUserData));
    }

    // TODO: Change indicator if the two password match or not!
    function onPasswordChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        evt.preventDefault();

        setPassword(evt.target.value);
    }

    // TODO: Change indicator if the two password match or not!
    function onPasswordAgainChange(evt: React.ChangeEvent<HTMLInputElement>): void {
        evt.preventDefault();

        setPasswordAgain(evt.target.value);
    }

    return (
        <>
            <section>
                <h2>
                    Create user account
                </h2>
                <form onSubmit={onRegisterSubmit}>
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
                        <input type="password" id="password" name="password" value={password} onChange={onPasswordChange}></input>
                    </div>
                    <div>
                        <label htmlFor='password-repeat'>Repeat desired password</label>
                        <input type="password" id="password-repeat" name="password-repeat" value={passwordAgain} onChange={onPasswordAgainChange}></input>
                    </div>
                    <div><button>Create</button></div>
                </form>
            </section>
        </>
    );
}


