import { useLoadUsersQuery } from "../datastore/chatSlice";
import ChannelUserItem from "./ChannelUserItem";

import styles from "../stylesheets/ChannelUsers.module.css";

type ChannelUsersProps = {
    channelId: string,
    adminId: string
}

export default function ChannelUsers({ channelId, adminId }: ChannelUsersProps): React.JSX.Element {

    // Load list of users in the specified channel
    const { data: usersList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadUsersQuery(channelId);

    return (
        <>
            <div className={styles['channel-users-list']}>
                {listIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                {!usersList || !usersList.length && <div>No users in channel!</div>}
                {usersList?.map((usr, idx) => <ChannelUserItem key={usr.authid ?? idx} userData={usr} isAdmin={adminId == usr.authid} />)}
                {listIsError && <div className={styles['error-message']}>An error occurred! ({listError as string})</div>}
            </div>
        </>
    );
}
