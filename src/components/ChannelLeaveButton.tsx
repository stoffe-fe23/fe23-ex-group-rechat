import React from 'react';
import { useLeaveChannelMutation } from '../datastore/chatSlice';
import styles from "../stylesheets/ChannelLeaveButton.module.css";
import { useNavigate } from 'react-router';
import iconExit from "/icons/icon-exit.png";


export default function ChannelLeaveButton(): React.JSX.Element {

    const navigate = useNavigate();
    const [leaveChannel, { isLoading: leaveIsLoading, isError: leaveIsError, error: leaveError }] = useLeaveChannelMutation();

    async function onLeaveSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        if (confirm("Are you sure you wish to leave this channel?")) {
            try {
                await leaveChannel().unwrap();
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
            <form onSubmit={onLeaveSubmit}>
                <button>
                    {leaveIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    <img src={iconExit} alt="Leave the channel." />Leave channel
                </button>
            </form>
            {leaveIsError && <div className={styles['error-message']}>{leaveError as string}</div>}
        </div>
    );
}


