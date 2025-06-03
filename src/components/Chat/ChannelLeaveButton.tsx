/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Component for the button allowing the user to leave the channel they are currently in.  
*/
import React from 'react';
import { useLeaveChannelMutation } from '../../datastore/chatSlice';
import { useNavigate } from 'react-router';

import styles from "../../stylesheets/ChannelLeaveButton.module.css";
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
                console.error("Leave channel error:", err);
            }
        }
    }

    return (
        <div className={styles['channel-leave']}>
            <form onSubmit={onLeaveSubmit}>
                <button title="Leave the channel">
                    {leaveIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    <img src={iconExit} alt="Leave the channel." /><span>Leave channel</span>
                </button>
            </form>
            {leaveIsError && <div className={styles['error-message']}>An error occurred! ({leaveError != undefined ? leaveError as string : ""})</div>}
        </div>
    );
}


