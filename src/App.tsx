import { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './datastore/hooks';
import UserLogin from './components/UserLogin';
import UserProfileButton from './components/UserProfileButton';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from './api/firebase-init';
import UserRegister from './components/UserRegister';
import UserProfilePage from './components/UserProfilePage';
import FrontPage from './components/FrontPage';
import PageNotFound from './components/PageNotFound';
import ChannelJoinPage from './components/ChannelJoinPage';
import ChannelPage from './components/ChannelPage';
import ChannelCreatePage from './components/ChannelCreatePage';
import PageTabs from './components/PageTabs';
import { authApi, useUserLoadQuery } from './datastore/userSlice';

function App() {
    const dispatch = useAppDispatch();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();


    // User authentication observer to preserve user session if reloading page, closing the tab then returning etc
    useEffect(() => {
        console.log("APP USEEFFECT RUNNING...");
        onAuthStateChanged(firebaseAuth, (user) => {
            console.log("onAuthStateChanged() load user data", user);
            dispatch(authApi.util.prefetch('userLoad', undefined, { force: true }));
        });
    }, [userData, dispatch]);

    // Main App component with SPA page router.
    return (
        <>
            <main id="page" aria-live="assertive">
                <header>
                    <UserProfileButton />
                </header>
                <div id="main-content">
                    <Routes>
                        <Route path="/" element={<><PageTabs activeTab='front' /><FrontPage /></>} />
                        <Route path="/user/login" element={<><PageTabs activeTab='login' /><UserLogin isNewUser={false} /></>} />
                        <Route path="/user/login/new" element={<><PageTabs activeTab='login' /><UserLogin isNewUser={true} /></>} />
                        <Route path="/user/register" element={<><PageTabs activeTab='register' /><UserRegister /></>} />
                        <Route path="/user/profile" element={<><PageTabs activeTab='profile' /><UserProfilePage /></>} />
                        <Route path="/channels" element={<><PageTabs activeTab='channels' /><ChannelJoinPage /></>} />
                        <Route path="/channel/:channelId" element={<><PageTabs activeTab='channel' /><ChannelPage /></>} />
                        <Route path="/channel/create" element={<><PageTabs activeTab='channel-create' /><ChannelCreatePage /></>} />
                        <Route path="*" element={<><PageTabs activeTab='notfound' /><PageNotFound /></>} />
                    </Routes>
                </div>
                <footer>2025 Group ReChat</footer>
            </main>
        </>
    )
}

export default App
