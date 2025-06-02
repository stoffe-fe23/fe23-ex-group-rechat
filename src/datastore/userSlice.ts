/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    RTK Query Endpoints for managing the current user: Registration, login/logoff, user profile etc. 
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
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendEmailVerification,
    verifyBeforeUpdateEmail,
    sendPasswordResetEmail
} from "firebase/auth";
import { firebaseApi } from '../api/firebase-api';
import { ChatUserProfile, ChatUserData, LoginData } from '../typedefs/chatUserTypes';
import { FirebaseError } from 'firebase/app';


export const authApi = firebaseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* Load user authentication and profile data */
        userLoad: builder.query<ChatUserData, void>({
            async queryFn() {
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
                            }
                        }
                    }
                    return { data: userState };
                }
                catch (error: any) {
                    console.error("userLoad() ERROR", error.message);
                    return { error: error.code };
                }
            },
            providesTags: ['User'],
        }),

        /* Log on the user with the specified email and password */
        userLogin: builder.mutation<string, LoginData>({
            async queryFn({ email, password }) {
                try {
                    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

                    // Flag the user profile as active to display in channel user list etc. 
                    if (firebaseAuth.currentUser) {
                        const docUserProfile = await getDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid));
                        if (docUserProfile.exists()) {
                            await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { isactive: true, activity: serverTimestamp() });
                        }
                    }

                    return { data: userCredential.user.uid };
                }
                catch (error: any) {
                    return { error: error.code };
                }
            },
            invalidatesTags: ['User', 'Users'],
        }),

        /* Log off the current user */
        userLogout: builder.mutation<string, void>({
            async queryFn() {
                try {

                    // Set us as inactive in the profile to hide from the joined channel user list etc.
                    if (firebaseAuth.currentUser) {
                        const docUserProfile = await getDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid));
                        if (docUserProfile.exists()) {
                            await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { isactive: false, activity: serverTimestamp() });
                        }
                    }

                    // Log off the user.
                    await signOut(firebaseAuth).catch((err) => console.error("Firebase Signout error!", err));
                    await firebaseAuth.signOut().catch((err) => console.error("Firebase Auth signout error!", err));;
                    return { data: "Logout successful." };
                }
                catch (error: any) {
                    return { error: error.code };
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
                        // Auth account created, add new user profile to the database.
                        const userProfileData: ChatUserProfile = {
                            authid: userCredential.user.uid,
                            picture: "",
                            nickname: nickname.length ? nickname : "Anonymous",
                            channelid: "",
                            activity: serverTimestamp()
                        }
                        await setDoc(doc(firebaseDB, "users", userCredential.user.uid), userProfileData);

                        // Send a verification email with link to let user activate the new account
                        await sendEmailVerification(userCredential.user);
                        return { data: userCredential.user.uid };
                    }
                    else {
                        throw new FirebaseError("account-not-created", "The account could not be created!");
                    }
                }
                catch (error: any) {
                    return { error: error.code };
                }
            },
            invalidatesTags: ['User'],
        }),

        /* Send a password reset email to the user with the specified email address */
        userPasswordReset: builder.mutation<string, string>({
            async queryFn(email) {
                try {
                    await sendPasswordResetEmail(firebaseAuth, email);
                    return { data: "Password reset email sent." };
                }
                catch (error: any) {
                    return { error: error.code };
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
                            await verifyBeforeUpdateEmail(firebaseAuth.currentUser, email);
                        }

                        // Update password if it has been changed
                        if (password && (password.length > 5)) {
                            const authCredential = EmailAuthProvider.credential(firebaseAuth.currentUser.email ?? "", currentPassword);
                            await reauthenticateWithCredential(firebaseAuth.currentUser, authCredential);
                            await updatePassword(firebaseAuth.currentUser, password);
                        }
                        else if (password && (password.length > 0) && (password.length < 6)) {
                            throw new FirebaseError("weak-password", "The password must be 6 characters long or more.");
                        }

                        // Update user profile data 
                        const profileData: ChatUserProfile = {
                            authid: firebaseAuth.currentUser.uid,
                            picture: picture,
                            nickname: nickname,
                            activity: serverTimestamp()
                        }
                        await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), profileData);
                    }

                    return { data: "User profile updated." };
                }
                catch (error: any) {
                    console.error("userEdit() ERROR", error.code);
                    return { error: error.code };
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
    useUserEditMutation,
    useUserPasswordResetMutation
} = authApi;