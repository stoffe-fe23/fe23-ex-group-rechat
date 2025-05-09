/*
    Inlämningsuppgift 3 (Webshop), JavaScript 3 - Kristoffer Bengtsson (FE23)

    Redux slice for managing the category and product states, also includes searching and product suggestions.
*/

import { asyncThunkCreator, buildCreateSlice, PayloadAction } from '@reduxjs/toolkit';
import { firebaseAuth, firebaseDB } from '../api/firebase-init';
import {
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    updatePassword,
    updateEmail,
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendEmailVerification,
    //    onAuthStateChanged,
    //    updateProfile,
    //    deleteUser,
    //    sendPasswordResetEmail,
    //    sendEmailVerification,
    //    EmailAuthProvider,
    //    reauthenticateWithCredential
} from "firebase/auth";
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

import { LoginData, ChatUserState, ChatUserAuth, ChatUserProfile, RegisterUserData, ChatUserUpdateData, ChatUserStoreThunk } from '../typedefs/chatUserTypes';


// Default state slice. 
const initialState: ChatUserState = {
    userAuth: null,
    userProfile: null,
    authenticated: false
}


// Enable using async thunk reducers directly inside the slice.
export const createAppSlice = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } });

// Fetch extra user profile data from the database users collection
async function getUserProfileData(uid: string | null): Promise<ChatUserProfile | null> {
    console.log("getUserProfileData()");
    if (uid) {
        const docUserProfile = await getDoc(doc(firebaseDB, "users", uid));
        if (docUserProfile.exists()) {
            const docUserProfileData = docUserProfile.data();
            const userProfileData: ChatUserProfile = {
                authid: docUserProfileData.authid,
                picture: docUserProfileData.picture,
                nickname: docUserProfileData.nickname,
                channelid: docUserProfileData.channelid,
                activity: docUserProfileData.activity.seconds
            }
            return userProfileData;
        }
    }
    return null;
}

// Create a new user account and profile
async function registerNewUser(nickname: string, email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    if (userCredential && (userCredential.user != null) && (userCredential.user.uid)) {
        // Account created, add new profile to the database.
        const userProfileData: ChatUserProfile = {
            authid: userCredential.user.uid,
            picture: "",
            nickname: nickname.length ? nickname : "Anonymous",
            channelid: "",
            activity: new Date()
        }

        await setDoc(doc(firebaseDB, "users", userCredential.user.uid), userProfileData);
    }
}


// https://redux-toolkit.js.org/api/createSlice#the-reducers-creator-callback-notation
const sliceChatUser = createAppSlice({
    name: "user",
    initialState,
    reducers: (create) => ({
        /* Load current user data into state if authenticated */
        userLoad: create.asyncThunk(
            async (): Promise<ChatUserProfile | null> => {
                if (firebaseAuth.currentUser) {
                    return await getUserProfileData(firebaseAuth.currentUser.uid)
                }
                return null;
            },
            {
                // TODO: Error handling, display relevant message to the user
                rejected: (state, action) => {
                    console.log("Error loading logging in:", action);
                    // action.error.code == auth/invalid-credential
                    // action.error.message == Firebase: Error (auth/invalid-credential)
                    // action.error.name == "FirebaseError"
                    // action.meta.type == user/userLogin/rejected
                    state.userAuth = null;
                    state.userProfile = null;
                    state.authenticated = false;
                },
                // Profile data successfully retrieved, add to state. 
                fulfilled: (state, action) => {
                    console.log("User Profile Load completed:", action.payload);

                    if (firebaseAuth.currentUser) {
                        const userAuthData: ChatUserAuth = {
                            uid: firebaseAuth.currentUser.uid,
                            displayName: firebaseAuth.currentUser.displayName ?? "",
                            email: firebaseAuth.currentUser.email ?? "",
                            emailVerified: firebaseAuth.currentUser.emailVerified ?? "",
                            photoURL: firebaseAuth.currentUser.photoURL ?? "",
                            creationTime: firebaseAuth.currentUser.metadata.creationTime ?? "0",
                            lastSignInTime: firebaseAuth.currentUser.metadata.lastSignInTime ?? "0"
                        }

                        state.userAuth = userAuthData;
                        state.userProfile = action.payload;
                        state.authenticated = userAuthData.emailVerified;
                    }
                    else {
                        state.userAuth = null;
                        state.userProfile = null;
                        state.authenticated = false;
                    }
                },
            }
        ),

        /* Reset current user data in state */
        userUnload: create.reducer((state) => {
            console.log("userUnload()");
            state.userAuth = null;
            state.userProfile = null;
            state.authenticated = false;
        }),

        /* Log off current user */
        userLogoff: create.reducer((state) => {
            signOut(firebaseAuth);
        }),

        /** Attempt to log in user with the specified username and password  */
        userLogin: create.asyncThunk(
            async (loginData: LoginData): Promise<ChatUserState> => {
                console.log("LOGIN:", loginData);
                const userCredential = await signInWithEmailAndPassword(firebaseAuth, loginData.username, loginData.password);

                // Pick out the relevant bits since the full firebase userCredential object cannot be stored in a redux state
                const userAuthData: ChatUserAuth = {
                    uid: userCredential.user.uid,
                    displayName: userCredential.user.displayName ?? "",
                    email: userCredential.user.email ?? "",
                    emailVerified: userCredential.user.emailVerified ?? "",
                    photoURL: userCredential.user.photoURL ?? "",
                    creationTime: userCredential.user.metadata.creationTime ?? "0",
                    lastSignInTime: userCredential.user.metadata.lastSignInTime ?? "0"
                }

                return {
                    userAuth: userAuthData,
                    userProfile: await getUserProfileData(userCredential.user.uid),
                    authenticated: userCredential.user != null && userCredential.user.emailVerified
                } as ChatUserState;

            },
            {
                // Something went wrong!
                // TODO: Error handling, display relevant message to the user
                rejected: (state, action) => {
                    console.log("Error loading logging in:", action);
                    // action.error.code == auth/invalid-credential
                    // action.error.message == Firebase: Error (auth/invalid-credential)
                    // action.error.name == "FirebaseError"
                    // action.meta.type == user/userLogin/rejected
                    state.userAuth = null;
                    state.userProfile = null;
                    state.authenticated = false;
                },
                // Data successfully retrieved, add to state. 
                fulfilled: (state, action) => {
                    console.log("Login completed:", action.payload);

                    state.userAuth = action.payload.userAuth;
                    state.userProfile = action.payload.userProfile;
                    state.authenticated = action.payload.authenticated;
                },
            }
        ),

        /* Register a new user account */
        userRegister: create.reducer((state, action: PayloadAction<RegisterUserData>) => {
            registerNewUser(action.payload.nickname, action.payload.email, action.payload.password);
        }),

        /* Update user profile */
        userProfileEdit: create.asyncThunk(
            async (newProfileData: ChatUserUpdateData, thunkApi): Promise<ChatUserState> => {
                console.log("USERPROFILEEDIT THUINK", thunkApi.getState());
                const states = thunkApi.getState() as ChatUserStoreThunk;
                const state = states.user as ChatUserState;
                const userState: ChatUserState = {
                    userAuth: state.userAuth,
                    userProfile: state.userProfile,
                    authenticated: state.authenticated
                }

                console.log("PROFILE UPDATE:", state.userAuth, "DATA: ", newProfileData);

                if (state.userAuth && userState.userAuth) {
                    console.log("PROFILE EDIT: Auth is set...");
                    // Change email address, require re-verification of email.
                    if (newProfileData.email && (newProfileData.email != state.userAuth?.email) && firebaseAuth.currentUser) {
                        console.log("PROFILE EDIT: Email is changed...");
                        try {
                            const authCredential = EmailAuthProvider.credential(firebaseAuth.currentUser.email ?? "", newProfileData.currentPassword);
                            await reauthenticateWithCredential(firebaseAuth.currentUser, authCredential);
                            await updateEmail(firebaseAuth.currentUser, newProfileData.email);
                            await sendEmailVerification(firebaseAuth.currentUser);

                            userState.authenticated = false;
                            userState.userAuth.email = newProfileData.email;
                            console.log("USER EMAIL UPDATED");
                        }
                        catch (error) {
                            console.error("EMAIL CHANGE FAILED", error);
                        }
                    }

                    // Change password
                    if (newProfileData.password && newProfileData.password.length && firebaseAuth.currentUser) {
                        console.log("PROFILE EDIT: Password is changed...");
                        try {
                            const authCredential = EmailAuthProvider.credential(firebaseAuth.currentUser.email ?? "", newProfileData.currentPassword);
                            await reauthenticateWithCredential(firebaseAuth.currentUser, authCredential);
                            await updatePassword(firebaseAuth.currentUser, newProfileData.password)
                            console.log("USER PASSWORD UPDATED");
                        }
                        catch (error) {
                            console.error("PASSWORD CHANGE FAILED", error);
                        }
                    }

                    // Change other profile data, i.e. nickname, user picture etc. 
                    const profileData: ChatUserProfile = {
                        authid: state.userAuth.uid,
                        picture: newProfileData.picture,
                        nickname: newProfileData.nickname,
                        channelid: state.userProfile ? state.userProfile.channelid : "",
                        activity: new Date()
                    }
                    console.log("PROFILE EDIT: New profile data", state.userAuth.uid, profileData);

                    await updateDoc(doc(firebaseDB, "users", state.userAuth.uid), profileData);
                    userState.userProfile = await getUserProfileData(state.userAuth.uid);

                    console.log("PROFILE EDIT: After database update...");
                }

                return userState;
            },
            {
                // Something went wrong!
                // TODO: Error handling, display relevant message to the user
                rejected: (state, action) => {
                    console.log("Error updating profile:", action);
                    // action.error.code == auth/invalid-credential
                    // action.error.message == Firebase: Error (auth/invalid-credential)
                    // action.error.name == "FirebaseError"
                    // action.meta.type == user/userLogin/rejected
                },
                // Data successfully retrieved, add to state. 
                fulfilled: (state, action) => {
                    state.userProfile = action.payload.userProfile;
                    if (state.userAuth && action.payload.userAuth) {
                        state.userAuth.email = action.payload.userAuth.email;
                    }
                    console.log("Profile update complete:", action.payload);
                },
            },
        ),
    }),
    selectors: {
        selectIsLoggedIn: (state: ChatUserState): boolean => (state.authenticated && state.userAuth != null),
        selectUserId: (state: ChatUserState) => state.userAuth?.uid,
        selectUserName: (state: ChatUserState) => state.userProfile?.nickname,
        selectUserPicture: (state: ChatUserState) => state.userProfile?.picture,
        selectUserData: (state: ChatUserState) => state
    }
});


export const { userLogoff, userLogin, userLoad, userUnload, userRegister, userProfileEdit } = sliceChatUser.actions;
export const { selectIsLoggedIn, selectUserId, selectUserName, selectUserPicture, selectUserData } = sliceChatUser.selectors;
export default sliceChatUser.reducer;