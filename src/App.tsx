import { useState, useEffect } from 'react';
import './App.css';

import { Routes, Route, NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './datastore/hooks';
// import { selectUserData, userLoad, userUnload } from './datastore/sliceChatUser';
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
import { useUserLoadQuery } from './datastore/userSlice';


function App() {
    const dispatch = useAppDispatch();
    // const userData = useAppSelector(selectUserData);
    let userData = useUserLoadQuery();

    // Initialize user authentication observer
    // on login, logoff and page load.
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            console.log("onAuthStateChanged()", user);
            // userData = useUserLoadQuery();
        });

    }, [userData, dispatch]);
    /*
    useEffect(() => {
        onAuthStateChanged(firebaseAuth, (user) => {
            if (user) {
                // User logged in - load user info
                dispatch(userLoad());

                console.log("userLoad() dispatch");
            } else {
                // User logged off - unload user info
                dispatch(userUnload());
                console.log("userUnload() dispatch");
            }
        });

    }, [dispatch]);
    */

    return (
        <>
            <main id="page" aria-live="assertive">
                <header>
                    <UserProfileButton />
                </header>
                <div id="main-content">
                    <Routes>
                        <Route path="/" element={<><PageTabs activeTab='front' /><FrontPage /></>} />
                        <Route path="/user/login" element={<><PageTabs activeTab='login' /><UserLogin /></>} />
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
