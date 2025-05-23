import { useState } from "react";
// import { Link, NavLink } from "react-router-dom";
import { useCreateChannelMutation } from "../datastore/chatSlice";
import { useNavigate } from "react-router";
import PageTabs from "./PageTabs";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

export default function ChannelCreatePage(): React.JSX.Element {

    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [permanent, setPermanent] = useState<boolean>(false);

    const [createChannel, { isLoading: createChannelIsLoading, error: createChannelError }] = useCreateChannelMutation();

    async function onCreateChannelSubmit(evt: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();

        // TODO: Validate input... 

        try {
            const channelId = await createChannel({ name, description, permanent }).unwrap();
            console.log("New channel created", channelId);
            navigate(`/channel/${channelId}`);
        }
        catch (error: any) {
            // TODO: Handle errors...
            console.error("Error creating new channel", error, createChannelError);
        }
    }

    return (
        <>
            <section className='channel-create'>
                <h2>New channel</h2>
                {createChannelIsLoading && <div>Please wait...</div>}
                <form onSubmit={onCreateChannelSubmit}>
                    <div>
                        <label htmlFor="name">Channel name</label>
                        <input type="text" name="name" id="name" value={name} onChange={(evt) => setName(evt.target.value)}></input>
                    </div>
                    <div>
                        <label htmlFor="description">Short description of channel</label>
                        <textarea id="description" name="description" value={description} onChange={(evt) => setDescription(evt.target.value)}></textarea>
                    </div>
                    <div>
                        <input type="checkbox" name="permanent" id="permanent" checked={permanent} onChange={(evt) => setPermanent(evt.target.checked)}></input>
                        <label htmlFor="permanent">Channel persists with no participants</label>
                    </div>
                    <button>Create channel</button>
                </form>
            </section>
        </>
    );
}