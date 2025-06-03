/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Main App component. Basic page structure, React Router for pages.
    Load logged on user from Firebase Auth.  
*/
import { useEffect } from 'react';
import { Routes, Route, useBeforeUnload } from 'react-router-dom';
import { useAppDispatch } from './datastore/hooks';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './api/firebase-init';
import { authApi, useUserLoadQuery } from './datastore/userSlice';

import UserLogin from './components/User/UserLogin';
import UserProfileButton from './components/User/UserProfileButton';
import UserRegister from './components/User/UserRegister';
import UserProfilePage from './components/User/UserProfilePage';
import UserForgotPassword from './components/User/UserForgotPassword';
import FrontPage from './components/FrontPage';
import PageNotFound from './components/PageNotFound';
import ChannelJoinPage from './components/Chat/ChannelJoinPage';
import ChannelPage from './components/Chat/ChannelPage';
import ChannelCreatePage from './components/Chat/ChannelCreatePage';
import PageTabs from './components/PageTabs';

import './App.css';


function App() {
    const dispatch = useAppDispatch();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    // Page is closed
    useBeforeUnload((/* evt */) => {
        // TODO: Mark current user as inactive, if logged on
        // If this is even somehow possible? Seems like you can't expect any async functionality, like DB/API calls, 
        // to finish successfully before the browser closes the page, interrupting the operation.
        console.log("UNLOAD!");
    });

    // User authentication observer to preserve user session if reloading page or closing and returning without logging off. 
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (/* user */) => {
            dispatch(authApi.util.prefetch('userLoad', undefined, { force: true }));
        });
    }, [userData, dispatch]);

    return (
        <>
            <main id="page" aria-live="assertive">
                {userIsError && <div className="error-message">{userError as string}</div>}
                <header>
                    <div className="header-tabs"><PageTabs /></div>
                    <UserProfileButton />
                </header>
                <div id="main-content">
                    {userIsLoading && <div id="busy" className='busy' title="Please wait..."></div>}
                    <Routes>
                        <Route path="/" element={<FrontPage />} />
                        <Route path="/user/login" element={<UserLogin isNewUser={false} />} />
                        <Route path="/user/login/new" element={<UserLogin isNewUser={true} />} />
                        <Route path="/user/passwordreset" element={<UserForgotPassword />} />
                        <Route path="/user/register" element={<UserRegister />} />
                        <Route path="/user/profile" element={<UserProfilePage />} />
                        <Route path="/channels" element={<ChannelJoinPage />} />
                        <Route path="/channel/:channelId" element={<ChannelPage />} />
                        <Route path="/channel/create" element={<ChannelCreatePage />} />
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </div>
                <footer>2025 Group ReChat</footer>
            </main>
        </>
    )
}

export default App;
