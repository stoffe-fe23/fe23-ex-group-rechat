import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { LoginData } from '../typedefs/chatUserTypes';
import { useAppDispatch } from '../datastore/hooks';
import { userLogin } from '../datastore/sliceChatUser';



export default function UserLogin(): React.JSX.Element {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();


    function onLoginSubmit(event: React.SyntheticEvent<HTMLFormElement>): void {
        event.preventDefault();

        const loginData: LoginData = {
            username: email,
            password: password
        };

        dispatch(userLogin(loginData));

        // Reset login form fields
        setEmail("");
        setPassword("");
    }

    return (
        <>
            <section>
                <form onSubmit={onLoginSubmit}>
                    <div>
                        <label htmlFor="login-email">Email address</label>
                        <input id="login-email" name="email" type="email" placeholder="Your email address" onChange={(evt) => setEmail(evt.target.value)} value={email} required />
                    </div>
                    <div>
                        <label htmlFor="login-password">Password</label>
                        <input id="login-password" name="password" type="password" placeholder="Password" onChange={(evt) => setPassword(evt.target.value)} value={password} required />
                    </div>
                    <div>
                        <button>Login</button>
                    </div>
                </form>

                <div>
                    <NavLink to="/signup">Create user account</NavLink>
                </div>
            </section>
        </>
    );
}


