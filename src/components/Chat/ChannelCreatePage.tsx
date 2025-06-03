/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Page component with a form to add a new channel.
*/
import { useState } from "react";
import { useCreateChannelMutation } from "../../datastore/chatSlice";
import { useNavigate } from "react-router";

import styles from "../../stylesheets/ChannelCreatePage.module.css";
import iconChannel from "/icons/icon-channel.png";


export default function ChannelCreatePage(): React.JSX.Element {

    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [permanent, setPermanent] = useState<boolean>(false);

    const [createChannel, { isLoading: createChannelIsLoading, isError: createChannelIsError, error: createChannelError }] = useCreateChannelMutation();

    async function onCreateChannelSubmit(evt: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();

        createChannel({ name, description, permanent }).unwrap()
            .then((channelId) => {
                navigate(`/channel/${channelId}`);
            })
            .catch((error: any) => {
                console.error("Error creating new channel", error);
            });
    }

    return (
        <>
            <section className={styles['channel-create']}>
                <div className={styles['leftcol']}>
                    <form onSubmit={onCreateChannelSubmit} className={styles['channel-create-form']}>
                        <h2>New channel</h2>
                        <div>
                            <label htmlFor="name">Channel name</label>
                            <input type="text" name="name" id="name" value={name} onChange={(evt) => setName(evt.target.value)} placeholder="Name of the new channel" minLength={4} maxLength={50} required></input>
                        </div>
                        <div>
                            <label htmlFor="description">Short description of channel</label>
                            <textarea id="description" name="description" value={description} onChange={(evt) => setDescription(evt.target.value)} placeholder="Describe what the new channel is about." minLength={5} maxLength={255} required></textarea>
                        </div>
                        <div className={styles['channel-create-permanent-wrapper']}>
                            <input type="checkbox" name="permanent" id="permanent" checked={permanent} onChange={(evt) => setPermanent(evt.target.checked)}></input>
                            <label htmlFor="permanent">Channel persists with no participants</label>
                        </div>
                        {createChannelIsError && <div className={styles['error-message']}> An error occurred when creating a new channel! ({createChannelError != undefined ? createChannelError as string : ""})</div>}
                        <button disabled={createChannelIsLoading}>
                            {createChannelIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                            <img src={iconChannel} alt="Create new channel" />Create channel
                        </button>
                    </form>
                </div>
                <div className={styles['rightcol']}>
                    <div className={styles['logo']}>Group <span>Re</span>Chat</div>
                </div>
            </section>
        </>
    );
}