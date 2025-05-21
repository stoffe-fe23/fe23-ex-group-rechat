import { NavLink } from "react-router-dom";
import { useListChannelsQuery } from "../datastore/chatSlice";
import ChannelListItem from "./ChannelListItem";
import styles from "../stylesheets/ChannelJoinPage.module.css";

// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

export default function ChannelJoinPage(): React.JSX.Element {

    const { data: channelList, isLoading: listIsLoading, isError: listIsError, error: listError } = useListChannelsQuery();

    return (
        <div className={styles['channel-join']}>
            <h2>Join a channel</h2>
            <div className={styles['channel-join-list']}>
                {!channelList || !channelList.length && <div>There are currently no active chat channels.</div>}
                {channelList?.map((chan, idx) => <ChannelListItem key={chan.channelid ?? idx} channelId={chan.channelid ?? ""} channelName={chan.name} channelDescription={chan.description} channelIsPermanent={chan.permanent} />)}
            </div>
            <NavLink to="/channel/create">Create new channel</NavLink>
        </div>
    );
}