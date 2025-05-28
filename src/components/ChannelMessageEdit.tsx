import styles from "../stylesheets/ChannelMessageEdit.module.css";
import { useState } from "react";
import { useEditMessageMutation } from "../datastore/chatSlice";
import iconTalk from "/icons/icon-talk.png";


type ChannelMessageEditProps = {
    messageId: string,
    messageText: string,
    editMessageCallback: (feedback: string) => void,
}

export default function ChannelMessageEdit({ messageId, messageText, editMessageCallback }: ChannelMessageEditProps): React.JSX.Element {

    const [message, setMessage] = useState<string>(messageText);
    const [editMessage, { isLoading: editIsLoading, isError: editIsError, error: editError }] = useEditMessageMutation();

    async function onEditMessageSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            await editMessage({ messageId: messageId, messageContent: message });
            editMessageCallback("Message edited.");
            console.log("EDIT MESSAGE SUCCESS:", messageId);
        }
        catch (err) {
            console.log("OnEditMessage error:", messageId, err);
            // TODO: Error handling... 
        }
    }

    return (
        <form onSubmit={onEditMessageSubmit} className={styles['edit-message-form']}>
            <textarea value={message} onChange={(evt) => setMessage(evt.target.value)}></textarea>
            <button disabled={editIsLoading}>
                {editIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                <img src={iconTalk} alt="Save changes" /> Save
            </button>
            {editIsError && <div className={styles['error-message']}>{editError as string}</div>}
        </form>
    );
}