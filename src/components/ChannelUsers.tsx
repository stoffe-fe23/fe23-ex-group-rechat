import { useLoadUsersQuery } from "../datastore/chatSlice";
import ChannelUserItem from "./ChannelUserItem";
import styles from "../stylesheets/ChannelUsers.module.css";

type ChannelUsersProps = {
    channelId: string,
}

// listIsLoading &&
export default function ChannelUsers({ channelId }: ChannelUsersProps): React.JSX.Element {
    const { data: usersList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadUsersQuery(channelId);

    return (
        <>
            <div className={styles['channel-users-list']}>
                {listIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                {!usersList || !usersList.length && <div>No users in channel!</div>}
                {usersList?.map((usr, idx) => <ChannelUserItem key={usr.authid ?? idx} userData={usr} />)}
                {listIsError && <div className={styles['error-message']}>{listError as string}</div>}
            </div>
        </>
    );
}
