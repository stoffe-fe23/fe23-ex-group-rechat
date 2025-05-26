import { useLoadUsersQuery } from "../datastore/chatSlice";
import ChannelUserItem from "./ChannelUserItem";
import styles from "../stylesheets/ChannelUsers.module.css";

type ChannelUsersProps = {
    channelId: string,
}

export default function ChannelUsers({ channelId }: ChannelUsersProps): React.JSX.Element {
    const { data: usersList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadUsersQuery(channelId);

    return (
        <div className={styles['channel-users']}>
            {listIsLoading && <div>Please wait...</div>}
            <div className={styles['channel-users-list']}>
                {!usersList || !usersList.length && <div>No users in channel!</div>}
                {usersList?.map((usr, idx) => <ChannelUserItem key={usr.authid ?? idx} userData={usr} />)}
            </div>
        </div>
    );
}
