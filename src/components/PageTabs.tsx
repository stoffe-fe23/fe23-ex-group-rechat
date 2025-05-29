import { NavLink, useLocation } from "react-router-dom";
import { Location as RouterLocation } from "react-router";
import { useListChannelsQuery } from "../datastore/chatSlice";
import { ChatChannel } from "../typedefs/chatChannelTypes";
import { useUserLoadQuery } from "../datastore/userSlice";

import styles from "../stylesheets/PageTabs.module.css";



export default function PageTabs(): React.JSX.Element {

    // Get the route of the page we are currently on
    const path: RouterLocation = useLocation();

    // Get currently logged on user
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    // Load channel data to build tab for the currently joined channel (if any)
    const { data: channelList, isLoading: listIsLoading, isError: channelIsError, error: channelError } = useListChannelsQuery();
    const channelId: string = (userData != undefined) && (userData.channelid != undefined) ? userData.channelid : "";
    const isInChannel: boolean = (channelId != undefined) && (channelId.length > 1);
    const channelData = isInChannel ? channelList?.find((chan) => chan.channelid == channelId) as ChatChannel : { channelid: "", name: "Active channel", description: "", permanent: false, admin: "" } as ChatChannel;


    // Currently active tab
    // This should match the router in App.tsx for pages that are supposed to have tabs here. 
    let activeTab: string = "";
    switch (path.pathname) {
        case "/": activeTab = "front"; break;
        case "/user/login":
        case "/user/login/new":
        case "/user/register":
        case "/user/profile": activeTab = "user"; break;
        case "/channels":
        case "/channel/create": activeTab = "channels"; break;
        default:
            // Currently on a channel page (/channel/:channelId)
            const fragments = path.pathname.split("/");
            if (fragments[1] && (fragments[1] == "channel") && (fragments[2] && fragments[2].length)) {
                activeTab = "channel";
            }
            break;
    }

    return (
        <>
            <div className={styles['page-tabs']}>
                <div className={activeTab == "front" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/">Home</NavLink>
                </div>
                {userData?.authenticated && <div className={activeTab == "user" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/user/profile">User profile</NavLink>
                </div>}
                {userData?.authenticated && <div className={activeTab == "channels" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/channels">Channels</NavLink>
                </div>}
                {userData?.authenticated && isInChannel && <div className={activeTab == "channel" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to={`/channel/${channelId}`}>Channel: {channelData.name.slice(0, 100)}</NavLink>
                </div>}
                {(listIsLoading || userIsLoading) && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                {(channelIsError || userIsError) && <div className="error-message">An error occurred! ({channelError != undefined ? channelError as string : ""}{userError != undefined ? userError as string : ""})</div>}
            </div>
        </>

    );
}