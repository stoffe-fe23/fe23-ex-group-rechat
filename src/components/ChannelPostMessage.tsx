import React, { useState } from 'react';
import { usePostMessageMutation } from '../datastore/chatSlice';

import styles from "../stylesheets/ChannelPostMessage.module.css";
import iconTalk from "/icons/icon-talk-add.png";
import iconEditor from "/icons/icon-editor.png";
import iconStop from "/icons/icon-stop.png";

type ChannelPostMessageProps = {
    channelId: string,
}

export default function ChannelPostMessage({ channelId }: ChannelPostMessageProps): React.JSX.Element {

    const [message, setMessage] = useState('');

    // Toggle textarea message editor on or off
    const [isExpandedEditor, setIsExpandedEditor] = useState<boolean>(false);

    const [postMessage, { isLoading: postIsLoading, isError: postIsError, error: postError }] = usePostMessageMutation();

    // Form submit handler - post the new message to the channel
    async function onMessageSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            if (channelId.length) {
                await postMessage({ channelId: channelId, messageContent: message }).unwrap();
            }
            else {
                throw new Error("No channel specified to post message to.");
            }
        }
        catch (err) {
            console.log("POST MESSAGE FAILURE:", err);
        }

        setMessage("");
        setIsExpandedEditor(false);
    }

    // Toggle showing the textarea input field instead of the oneliner text field.
    function onExpandClick(event: React.SyntheticEvent<HTMLButtonElement>): void {
        event.preventDefault();
        setIsExpandedEditor(!isExpandedEditor);
    }

    return (
        <>
            <div className={styles['channel-new-message']}>
                <form onSubmit={onMessageSubmit}>
                    <div className={styles['messagefield']}>
                        <input id="message" name="message" type="text" placeholder="Type your message here" onChange={(evt) => setMessage(evt.target.value)} value={message} required autoFocus autoComplete="off" />
                        {isExpandedEditor && <textarea id="messagexp" name="messagexp" className={styles['messagexp']} value={message} onChange={(evt) => setMessage(evt.target.value)} autoFocus></textarea>}
                    </div>
                    <button type="button" className={styles['channel-exp-button']} onClick={onExpandClick} title="Expand editor"><img className={styles['channel-exp-button-icon']} src={isExpandedEditor ? iconStop : iconEditor} /></button>
                    <button className={styles['channel-new-button']} title="Send message" disabled={postIsLoading}><img className={styles['channel-new-button-icon']} src={iconTalk} /> Send</button>
                    {postIsLoading && <div id='busy' className={styles['busy']}></div>}
                </form>
                {postIsError && <div className={styles['error-message']}>An error occurred! ({postError as string})</div>}
            </div>
        </>
    );
}


