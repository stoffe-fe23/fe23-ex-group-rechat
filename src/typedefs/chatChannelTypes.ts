/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Type definitions used by the chatSlice endpoints. 
*/
import { FieldValue } from "firebase/firestore";

export type NewMessageParams = {
    channelId: string,
    messageContent: string
}

export type EditMessageParams = {
    messageId: string,
    messageContent: string
}

export type ChatChannel = {
    channelid?: string,
    name: string,
    description: string,
    permanent: boolean,
    admin?: string
}

export type ChatMessage = {
    messageid?: string,
    author: string,
    channelid: string,
    postdate: number | FieldValue,
    content: string
}

export type ChannelUser = {
    authid: string,
    nickname: string,
    picture: string,
    channelid: string,
    activity: number | FieldValue,
    isactive: boolean
}

export type ChannelUserProfile = {
    authid: string,
    nickname: string,
    picture: string,
}