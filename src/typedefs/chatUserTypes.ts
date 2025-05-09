

export type LoginData = {
    username: string,
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
    channelid: string,
    activity: number | Date
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

export type ChatUserState = {
    userAuth: ChatUserAuth | null,
    userProfile: ChatUserProfile | null,
    authenticated: boolean

}

export type ChatUserStoreThunk = {
    user: ChatUserState
}