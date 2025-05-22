import { Link, NavLink, useParams } from "react-router-dom";
import { chatApi, useGetChannelQuery, useListChannelsQuery } from "../datastore/chatSlice";
import { useAppDispatch } from "../datastore/hooks";
import { ChatChannel } from "../typedefs/chatChannelTypes";
import styles from "../stylesheets/PageTabs.module.css";
import { useUserLoadQuery } from "../datastore/userSlice";


type PageTabsProps = {
    activeTab: string
}

export default function PageTabs({ activeTab }: PageTabsProps): React.JSX.Element {

    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();
    const { data: channelList, isLoading: listIsLoading, isError: channelIsError, error: channelError } = useListChannelsQuery();

    const channelId: string = (userData != undefined) && (userData.channelid != undefined) ? userData.channelid : "";
    const isInChannel: boolean = (channelId != undefined) && (channelId.length > 1);
    const channelData = isInChannel ? channelList?.find((chan) => chan.channelid == channelId) as ChatChannel : { channelid: "", name: "Active channel", description: "", permanent: false, admin: "" } as ChatChannel;

    const userTab = ['login', 'profile', 'register'];
    const chatTab = ['channels', 'channel-create'];

    // console.log("PAGE TABS", activeTab, channelId, isInChannel, channelData);

    return (
        <>
            {userData?.authenticated && <div className={styles['page-tabs']}>
                <div className={userTab.includes(activeTab) ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/user/profile">User profile</NavLink>
                </div>
                <div className={chatTab.includes(activeTab) ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/channels">Channels</NavLink>
                </div>
                {isInChannel && <div className={activeTab == "channel" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}><NavLink to={`/channel/${channelId}`}>Channel: {channelData.name.slice(0, 100)}</NavLink></div>}
            </div>}
        </>

    );
}