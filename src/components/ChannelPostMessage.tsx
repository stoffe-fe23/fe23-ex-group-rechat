import React, { useState } from 'react';
import { usePostMessageMutation } from '../datastore/chatSlice';
import styles from "../stylesheets/ChannelPostMessage.module.css";
import iconTalk from "/icons/icon-talk-add.png";

type ChannelPostMessageProps = {
    channelId: string,
}

export default function ChannelPostMessage({ channelId }: ChannelPostMessageProps): React.JSX.Element {

    const [message, setMessage] = useState('');

    //  const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const [postMessage, { isLoading: postIsLoading, isError: postIsError, error: postError }] = usePostMessageMutation();


    async function onMessageSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            if (channelId.length) {
                const msgInfo = await postMessage({ channelId: channelId, messageContent: message }).unwrap();
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

    return (
        <>
            <div className={styles['channel-new-message']}>
                {postIsLoading && <div>Please wait...</div>}
                <form onSubmit={onMessageSubmit}>
                    <input id="message" name="message" type="text" placeholder="Type your message here" onChange={(evt) => setMessage(evt.target.value)} value={message} required />
                    <button><img className={styles['channel-new-button-icon']} src={iconTalk} /> Send</button>
                </form>
            </div>
        </>
    );
}


