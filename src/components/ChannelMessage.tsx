import { ChannelUserProfile, ChatMessage } from "../typedefs/chatChannelTypes";
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/ChannelMessage.module.css";
import ChannelMessageEdit from "./ChannelMessageEdit";
import { useState } from "react";
import iconEdit from "/icons/icon-edit.png";
import iconDelete from "/icons/icon-trash.png";
import iconCancel from "/icons/icon-stop.png";
import { useDeleteMessageMutation } from "../datastore/chatSlice";
import { useUserLoadQuery } from "../datastore/userSlice";
import Markdown from "react-markdown";


type ChannelMessageProps = {
    messageData: ChatMessage,
    authorData: ChannelUserProfile
}

function timestampToDateString(time: number, locale: string = 'sv-SE') {
    const dateObj = new Date(time * 1000);
    return `${dateObj.toLocaleDateString(locale)} ${dateObj.toLocaleTimeString(locale)}`;
}


export default function ChannelMessage({ messageData, authorData }: ChannelMessageProps): React.JSX.Element {
    // Toggle for showing the message editor form instead of the text content element
    const [showingEditForm, setShowingEditForm] = useState<boolean>(false);
    // Get reducer for deleting the message
    const [deleteMessage, { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError }] = useDeleteMessageMutation();
    // Get logged on user data
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    const markdownDisallow = ['hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    // Default value if message author data is missing for some reason
    if ((authorData == undefined) || (authorData == null)) {
        authorData = { authid: "", nickname: "Anonymous", picture: "" };
    }

    // Save button pressed in editing form - hide the form. 
    function onEditMessageCallback(feedback: string): void {
        setShowingEditForm(false);
        console.log("End edit message", feedback);
    }

    // Edit button clicked, display the editing form. 
    function onEditClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        setShowingEditForm(true);
    }

    // Delete button clicked - remove the message.
    function onDeleteClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        if (confirm("Are you sure you wish to delete this message?")) {
            if (messageData.messageid && (messageData.messageid.length > 0)) {
                try {
                    deleteMessage(messageData.messageid);
                }
                catch (error: any) {
                    console.log("OnDelete error: ", error);
                }
            }
        }
    }

    // Cancel editing button clicked - hide the editing form without saving.
    function onCancelClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        setShowingEditForm(false);
    }

    return (
        <>
            <div className={styles['channel-message']}>
                <img className={styles['channel-message-picture']} src={authorData.picture && authorData.picture.length ? authorData.picture : userIconDef} alt="User picture" />
                <div className={styles['channel-message-name']}>{authorData.nickname}</div>
                <div className={styles['channel-message-date']}>{timestampToDateString(messageData.postdate as number)}</div>
                {!showingEditForm && <div className={styles['channel-message-text']}><Markdown disallowedElements={markdownDisallow}>{messageData.content}</Markdown></div>}
                {showingEditForm && <ChannelMessageEdit messageId={messageData.messageid as string} messageText={messageData.content} editMessageCallback={onEditMessageCallback} />}
                <div className={styles['channel-message-ops']}>
                    {deleteIsLoading || userIsLoading && <div>Please wait...</div>}
                    {(!showingEditForm && userData && (authorData.authid == userData.uid)) && <button title="Edit message" onClick={onEditClick}><img src={iconEdit} alt="Edit message" /></button>}
                    {showingEditForm && <button title="Cancel editing message" onClick={onCancelClick}><img src={iconCancel} alt="Cancel editing" /></button>}
                    {(userData && (authorData.authid == userData.uid)) && <button title="Delete message" onClick={onDeleteClick}><img src={iconDelete} alt="Delete message" /></button>}
                </div>
            </div>

        </>
    );
}