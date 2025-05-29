import { ChannelUserProfile, ChatMessage } from "../typedefs/chatChannelTypes";
import ChannelMessageEdit from "./ChannelMessageEdit";
import { useState } from "react";
import { useDeleteMessageMutation } from "../datastore/chatSlice";
import { useUserLoadQuery } from "../datastore/userSlice";
import Markdown from "react-markdown";

import iconEdit from "/icons/icon-edit.png";
import iconDelete from "/icons/icon-trash.png";
import iconCancel from "/icons/icon-stop.png";
import userIconDef from '/usericon-default.png';
import styles from "../stylesheets/ChannelMessage.module.css";


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

    // Track if the user picture could not be drawn, to allow use of default pic instead
    const [isPictureBroken, setIsPictureBroken] = useState<boolean>(false);

    // Get reducer for deleting the message
    const [deleteMessage, { isLoading: deleteIsLoading, isError: deleteIsError, error: deleteError }] = useDeleteMessageMutation();

    // Get logged on user data
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    // Disallow use of these format options in message text markdown styling
    const markdownDisallow = ['hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    // Default value if message author data is missing for some reason
    if ((authorData == undefined) || (authorData == null)) {
        authorData = { authid: "", nickname: "Anonymous", picture: "" };
    }

    // Save button pressed in the editing form - hide the form. 
    function onEditMessageCallback(): void {
        setShowingEditForm(false);
    }

    // Edit button clicked, display the editing form in place of the message text. 
    function onEditClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        event.preventDefault();
        setShowingEditForm(true);
    }

    // Delete button clicked - ask confirmation then remove the message.
    function onDeleteClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        event.preventDefault();
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
        event.preventDefault();
        setShowingEditForm(false);
    }

    // Author picture could not be loaded, set use of default icon instead
    function onPictureError(): void {
        setIsPictureBroken(true);
    }

    return (
        <>
            <div className={styles['channel-message']}>
                <img className={styles['channel-message-picture']} src={!isPictureBroken && authorData.picture && authorData.picture.length ? authorData.picture : userIconDef} alt="User picture" onError={onPictureError} />
                <div className={styles['channel-message-name']}>{authorData.nickname}</div>
                <div className={styles['channel-message-date']}>{timestampToDateString(messageData.postdate as number)}</div>
                {!showingEditForm && <div className={styles['channel-message-text']}><Markdown disallowedElements={markdownDisallow}>{messageData.content}</Markdown></div>}
                {showingEditForm && <ChannelMessageEdit messageId={messageData.messageid as string} messageText={messageData.content} editMessageCallback={onEditMessageCallback} />}
                <div className={styles['channel-message-ops']}>
                    {deleteIsLoading || userIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    {(!showingEditForm && userData && (authorData.authid == userData.uid)) && <button title="Edit message" onClick={onEditClick}><img src={iconEdit} alt="Edit message" /></button>}
                    {showingEditForm && <button title="Cancel editing message" onClick={onCancelClick}><img src={iconCancel} alt="Cancel editing" /></button>}
                    {(userData && (authorData.authid == userData.uid)) && <button title="Delete message" onClick={onDeleteClick}><img src={iconDelete} alt="Delete message" /></button>}
                </div>
                {deleteIsError || userIsError && <div className={styles['error-message']}>An error occurred! ({deleteError != undefined ? deleteError as string : ""} {userError != undefined ? userError as string : ""})</div>}
            </div>

        </>
    );
}