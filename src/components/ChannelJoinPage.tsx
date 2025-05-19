import { Link, NavLink } from "react-router-dom";
import { useListChannelsQuery } from "../datastore/chatSlice";
import ChannelListItem from "./ChannelListItem";
import { ChatChannel } from "../typedefs/chatChannelTypes";
// import styles from "../styles/FrontPage.module.css";
// styles['front-page']

export default function ChannelJoinPage(): React.JSX.Element {

    const { data: channelList, isLoading: listIsLoading, isError: listIsError, error: listError } = useListChannelsQuery();

    return (
        <div className='front-page'>
            <h2 className="front-heading">Join a channel</h2>
            <div className="channel-list">
                {!channelList || !channelList.length && <div>There are currently no active chat channels.</div>}
                {channelList?.map((chan, idx) => <ChannelListItem key={chan.channelid ?? idx} channelId={chan.channelid ?? ""} channelName={chan.name} channelDescription={chan.description} channelIsPermanent={chan.permanent} />)}
            </div>
        </div>
    );
}