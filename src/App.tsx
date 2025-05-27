import { useEffect } from 'react';
import './App.css';
import { Routes, Route, useBeforeUnload } from 'react-router-dom';
import { useAppDispatch } from './datastore/hooks';
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
import { authApi, useUserLoadQuery } from './datastore/userSlice';
import PageTabs from './components/PageTabs';

function App() {
    const dispatch = useAppDispatch();
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();


    useBeforeUnload((evt) => {
        // TODO: Mark current user as inactive, if logged on
        // If this is even possible, seems like you can't expect any async functionality, like DB/API calls, 
        // here to finish running before the page closes.
    });

    // User authentication observer to preserve user session if reloading page or closing and returning without logging off. 
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
                    <div className="header-tabs"><PageTabs /></div>
                    <UserProfileButton />
                </header>
                <div id="main-content">
                    <Routes>
                        <Route path="/" element={<FrontPage />} />
                        <Route path="/user/login" element={<UserLogin isNewUser={false} />} />
                        <Route path="/user/login/new" element={<UserLogin isNewUser={true} />} />
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
