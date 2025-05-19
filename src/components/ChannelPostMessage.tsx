import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUserLoadQuery, useUserLoginMutation } from '../datastore/userSlice';
import { usePostMessageMutation } from '../datastore/chatSlice';


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
            <section>
                {postIsLoading && <div>Please wait...</div>}
                <form onSubmit={onMessageSubmit}>
                    <input id="message" name="message" type="text" placeholder="Type your message here" onChange={(evt) => setMessage(evt.target.value)} value={message} required />
                    <button>Send</button>
                </form>
            </section>
        </>
    );
}


