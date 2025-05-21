import React from 'react';
import { useLeaveChannelMutation } from '../datastore/chatSlice';
import styles from "../stylesheets/ChannelLeaveButton.module.css";
import { useNavigate } from 'react-router';


export default function ChannelLeaveButton(): React.JSX.Element {

    const navigate = useNavigate();
    const [leaveChannel, { isLoading: leaveIsLoading, isError: leaveIsError, error: leaveError }] = useLeaveChannelMutation();

    async function onLeaveSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (confirm("Are you sure you wish to leave this channel?")) {
            try {
                const leaveInfo = await leaveChannel().unwrap();
                console.log("LEAVE CHANNEL SUCCESS:", leaveInfo);
                navigate("/channels");
            }
            catch (err) {
                console.log("LEAVE CHANNEL FAILURE:", err);
                // TODO: Error handling... 
            }
        }
    }

    return (
        <div className={styles['channel-leave']}>
            {leaveIsLoading && <div>Please wait...</div>}
            <form onSubmit={onLeaveSubmit}>
                <button>Leave channel</button>
            </form>
        </div>
    );
}


