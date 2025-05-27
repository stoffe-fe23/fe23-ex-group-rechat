import React, { useState } from 'react';
import { usePostMessageMutation } from '../datastore/chatSlice';
import styles from "../stylesheets/ChannelPostMessage.module.css";
import iconTalk from "/icons/icon-talk-add.png";
import iconAdd from "/icons/icon-add.png";
import iconSub from "/icons/icon-sub.png";

type ChannelPostMessageProps = {
    channelId: string,
}

export default function ChannelPostMessage({ channelId }: ChannelPostMessageProps): React.JSX.Element {

    const [message, setMessage] = useState('');
    const [isExpandedEditor, setIsExpandedEditor] = useState<boolean>(false);
    const [postMessage, { isLoading: postIsLoading, isError: postIsError, error: postError }] = usePostMessageMutation();

    async function onMessageSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            if (channelId.length) {
                const msgInfo = await postMessage({ channelId: channelId, messageContent: message }).unwrap();
                setIsExpandedEditor(false);
                console.log("POST MESSAGE SUCCESS:", msgInfo);
            }
            else {
                throw new Error("No channel specified to post message to.");
            }
        }
        catch (err) {
            console.log("POST MESSAGE FAILURE:", err);
        }

        setMessage("");
    }

    function onExpandClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        event.preventDefault();

        setIsExpandedEditor(!isExpandedEditor);
    }

    return (
        <>
            <div className={styles['channel-new-message']}>
                {postIsLoading && <div>Please wait...</div>}
                <form onSubmit={onMessageSubmit}>
                    <div className={styles['messagefield']}>
                        <input id="message" name="message" type="text" placeholder="Type your message here" onChange={(evt) => setMessage(evt.target.value)} value={message} required autoFocus />
                        {isExpandedEditor && <textarea id="messagexp" name="messagexp" className={styles['messagexp']} value={message} onChange={(evt) => setMessage(evt.target.value)}></textarea>}
                    </div>
                    <button type="button" className={styles['channel-exp-button']} onClick={onExpandClick} title="Expand editor"><img className={styles['channel-exp-button-icon']} src={isExpandedEditor ? iconSub : iconAdd} /></button>
                    <button className={styles['channel-new-button']} title="Send message"><img className={styles['channel-new-button-icon']} src={iconTalk} /> Send</button>
                </form>
            </div>
        </>
    );
}


