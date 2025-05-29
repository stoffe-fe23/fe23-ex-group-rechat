import { useState } from "react";
import { useEditMessageMutation } from "../datastore/chatSlice";

import styles from "../stylesheets/ChannelMessageEdit.module.css";
import iconTalk from "/icons/icon-talk.png";


type ChannelMessageEditProps = {
    messageId: string,
    messageText: string,
    editMessageCallback: (feedback: string) => void,
}

export default function ChannelMessageEdit({ messageId, messageText, editMessageCallback }: ChannelMessageEditProps): React.JSX.Element {

    const [message, setMessage] = useState<string>(messageText);
    const [editMessage, { isLoading: editIsLoading, isError: editIsError, error: editError }] = useEditMessageMutation();

    // Form submit handler - save changes to the message. 
    async function onEditMessageSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            await editMessage({ messageId: messageId, messageContent: message });
            editMessageCallback("Message edited.");
        }
        catch (err) {
            console.log("OnEditMessage error:", messageId, err);
        }
    }

    return (
        <form onSubmit={onEditMessageSubmit} className={styles['edit-message-form']}>
            <textarea value={message} onChange={(evt) => setMessage(evt.target.value)}></textarea>
            <button disabled={editIsLoading}>
                {editIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                <img src={iconTalk} alt="Save changes" /> Save
            </button>
            {editIsError && <div className={styles['error-message']}>An error occurred! ({editError as string})</div>}
        </form>
    );
}