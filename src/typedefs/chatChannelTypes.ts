import { FieldValue } from "firebase/firestore"

export type NewMessageParams = {
    channelId: string,
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