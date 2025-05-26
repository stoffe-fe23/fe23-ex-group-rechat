/*
    Endpoints for managing the current user: Registration, login/logoff, user profile etc. 
    Uses the Firebase Authentication service for account management, and the Firestore
    database for keeping extra profile data for easier access to show other users. 
*/
import { firebaseAuth, firebaseDB } from '../api/firebase-init';
import { getDoc, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
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
import { firebaseApi } from '../api/firebase-api';
import { ChatUserProfile, ChatUserData, LoginData } from '../typedefs/chatUserTypes';


export const authApi = firebaseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* Load user authentication and profile data */
        userLoad: builder.query<ChatUserData, void>({
            async queryFn() {
                console.log("DEBUG: USERLOAD START");
                try {
                    const userState: ChatUserData = {
                        uid: "",
                        email: "",
                        emailVerified: false,
                        picture: "",
                        nickname: "",
                        activity: 0,
                        creationTime: "",
                        lastSignInTime: "",
                        channelid: "",
                        authenticated: false,
                        isactive: false
                    }
                    if (firebaseAuth.currentUser && firebaseAuth.currentUser.emailVerified) {
                        userState.uid = firebaseAuth.currentUser.uid;
                        userState.email = firebaseAuth.currentUser.email ?? "";
                        userState.emailVerified = firebaseAuth.currentUser.emailVerified;
                        userState.creationTime = firebaseAuth.currentUser.metadata.creationTime ?? "";
                        userState.lastSignInTime = firebaseAuth.currentUser.metadata.lastSignInTime ?? "";

                        userState.authenticated = firebaseAuth.currentUser && (firebaseAuth.currentUser.uid.length > 0) && firebaseAuth.currentUser.emailVerified;

                        const docUserProfile = await getDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid));
                        if (docUserProfile.exists()) {
                            const docUserProfileData = docUserProfile.data();
                            userState.picture = docUserProfileData.picture ?? "";
                            userState.nickname = docUserProfileData.nickname ?? "Anonymous";
                            userState.channelid = docUserProfileData.channelid;
                            userState.activity = docUserProfileData.activity != undefined && docUserProfileData.activity != null ? docUserProfileData.activity.seconds : 0;
                            userState.isactive = docUserProfileData.isactive ?? false;

                            if (!docUserProfileData.isactive) {
                                await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { isactive: true, activity: serverTimestamp() });
                                console.log("Setting user as ONLINE!");
                            }
                        }
                    }
                    console.log("userLoad()", userState);
                    return { data: userState };
                }
                catch (error: any) {
                    console.error("userLoad() ERROR", error.message);
                    return { error: error.message };
                }
            },
            providesTags: ['User'],
        }),

        /* Log on the user with the specified email and password */
        userLogin: builder.mutation<string, LoginData>({
            async queryFn({ email, password }) {
                try {
                    console.log("LOGIN:", email, password);
                    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

                    // If user was in a channel before logging off, get back into it.
                    if (firebaseAuth.currentUser) {
                        const docUserProfile = await getDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid));
                        if (docUserProfile.exists()) {
                            // const currUserData = docUserProfile.data() as ChatUserProfile;
                            await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { isactive: true, activity: serverTimestamp() });
                        }
                    }
                    else {
                        console.log("!!! currentUser not set in userLogin()");
                    }

                    console.log("userLogin()", userCredential.user);
                    return { data: "Login successful." };
                }
                catch (error: any) {
                    console.error("userLogin() ERROR", error.message);
                    return { error: error.message };
                }
            },
            invalidatesTags: ['User', 'Users'],
        }),

        /* Log off the current user */
        userLogout: builder.mutation<string, void>({
            async queryFn() {
                try {

                    // Save which channel the user is in, if any, then remove them from it. 
                    if (firebaseAuth.currentUser) {
                        const docUserProfile = await getDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid));
                        if (docUserProfile.exists()) {
                            // const currUserData = docUserProfile.data() as ChatUserProfile;
                            await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { isactive: false, activity: serverTimestamp() });
                        }
                    }

                    // Log off the user.
                    await signOut(firebaseAuth).catch((err) => console.error("FN SIGNOUT ERROR!", err));
                    await firebaseAuth.signOut().catch((err) => console.error("OBJ SIGNOUT ERROR!", err));;
                    console.log("userLogoff()", firebaseAuth.currentUser);
                    return { data: "Logout successful." };
                }
                catch (error: any) {
                    console.error("userLogout() ERROR", error.message);
                    return { error: error.message };
                }
            },
            invalidatesTags: ['User', 'Users'],
        }),

        /* Register a new user account and create profile */
        userRegister: builder.mutation({
            async queryFn({ nickname, email, password }) {
                try {
                    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
                    if (userCredential && (userCredential.user != null) && (userCredential.user.uid)) {
                        console.log("New Auth user created!");
                        // Auth account created, add new user profile to the database.
                        const userProfileData: ChatUserProfile = {
                            authid: userCredential.user.uid,
                            picture: "",
                            nickname: nickname.length ? nickname : "Anonymous",
                            channelid: "",
                            activity: serverTimestamp()
                        }

                        await setDoc(doc(firebaseDB, "users", userCredential.user.uid), userProfileData);
                        console.log("New user profile created!");

                        // Send a verification email with link to let user activate the new account
                        await sendEmailVerification(userCredential.user);
                        console.log("Verification email sent");
                    }

                    return { data: "User Registration successful." };
                }
                catch (error: any) {
                    console.error("userRegister() ERROR", error.message);
                    return { error: error.message };
                }
            },
            invalidatesTags: ['User'],
        }),

        /* Edit the profile of the current user */
        userEdit: builder.mutation({
            async queryFn({ nickname, email, picture, password, currentPassword }) {
                try {
                    if (firebaseAuth.currentUser) {
                        // Update email if it has been changed
                        if (email && (email.length > 4) && (email != firebaseAuth.currentUser.email)) {
                            const authCredential = EmailAuthProvider.credential(firebaseAuth.currentUser.email ?? "", currentPassword);
                            await reauthenticateWithCredential(firebaseAuth.currentUser, authCredential);
                            await updateEmail(firebaseAuth.currentUser, email);
                            await sendEmailVerification(firebaseAuth.currentUser);
                            console.log("USER EMAIL UPDATED");
                        }

                        // Update password if it has been changed
                        if (password && (password.length > 5)) {
                            const authCredential = EmailAuthProvider.credential(firebaseAuth.currentUser.email ?? "", currentPassword);
                            await reauthenticateWithCredential(firebaseAuth.currentUser, authCredential);
                            await updatePassword(firebaseAuth.currentUser, password)
                            console.log("USER PASSWORD UPDATED");
                        }

                        // Update profile data (screen name, picture...)
                        const profileData: ChatUserProfile = {
                            authid: firebaseAuth.currentUser.uid,
                            picture: picture,
                            nickname: nickname,
                            activity: serverTimestamp()
                        }
                        await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), profileData);
                        console.log("PROFILE EDIT:", profileData, firebaseAuth.currentUser);
                    }

                    return { data: "User profile update successful." };
                }
                catch (error: any) {
                    console.error("userEdit() ERROR", error.message);
                    return { error: error.message };
                }
            },
            invalidatesTags: ['User', 'Profiles'],
        }),
    })
});

export const {
    useUserLoadQuery,
    useUserLoginMutation,
    useUserLogoutMutation,
    useUserRegisterMutation,
    useUserEditMutation
} = authApi;