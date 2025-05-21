import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserLoginMutation } from '../datastore/userSlice';
import { useNavigate } from 'react-router';


type UserLoginProps = {
    isNewUser: boolean
}

export default function UserLogin({ isNewUser }: UserLoginProps): React.JSX.Element {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userLogin, { isLoading, isError, error }] = useUserLoginMutation();


    async function onLoginSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            const userData = await userLogin({ email, password }).unwrap();
            console.log("LOGIN SUCCESS:", userData);
            setEmail("");
            setPassword("");
            navigate("/channels");
        }
        catch (err) {
            console.log("LOGIN FAILURE:", err);
            setPassword("");
            // TODO: Error handling... 
        }

    }

    return (
        <>
            <section>
                {isLoading && <div>Please wait...</div>}
                {isNewUser && <div>Thank you for joining! Check your email and click on the link provided to activate your account before logging in.</div>}
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


