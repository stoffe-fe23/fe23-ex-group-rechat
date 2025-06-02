/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Type definitions used by the userSlice endpoints. 
*/
import { User } from "firebase/auth";
import { FieldValue } from "firebase/firestore";


export type LoginData = {
    email: string,
    password: string
}

export type RegisterUserData = {
    nickname: string,
    email: string,
    password: string
}

export type ChatUserUpdateData = {
    email: string,
    password: string,
    currentPassword: string,
    authid?: string,
    picture: string,
    nickname: string,
    channelid?: string,
    activity?: number | Date
}

export type ChatUserProfile = {
    authid: string,
    picture: string,
    nickname: string,
    channelid?: string,
    isactive?: boolean,
    activity: number | Date | FieldValue
}

export type ChatUserAuth = {
    uid: string,
    displayName: string,
    email: string,
    emailVerified: boolean,
    photoURL: string,
    creationTime: string,
    lastSignInTime: string

}

export type ChatUserData = {
    uid: string,
    email: string,
    emailVerified: boolean,
    picture: string,
    nickname: string,
    activity: number | Date,
    creationTime: string,
    lastSignInTime: string,
    channelid?: string,
    authenticated: boolean,
    isactive: boolean
}

export type ChatUserState = {
    userAuth: User | null,
    userProfile: ChatUserProfile | null,
    authenticated: boolean

}

export type ChatUserStoreThunk = {
    user: ChatUserState
}