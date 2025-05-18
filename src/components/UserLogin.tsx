import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserLoginMutation } from '../datastore/userSlice';


export default function UserLogin(): React.JSX.Element {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userLogin, { isLoading, isError, error }] = useUserLoginMutation();


    async function onLoginSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            const userData = await userLogin({ email, password }).unwrap();
            console.log("LOGIN SUCCESS:", userData);
        }
        catch (err) {
            console.log("LOGIN FAILURE:", err);
        }

        // Reset login form fields
        setEmail("");
        setPassword("");
    }

    return (
        <>
            <section>
                {isLoading && <div>Please wait...</div>}
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
                    <NavLink to="/user/register">Create user account</NavLink>
                </div>
            </section>
        </>
    );
}


