/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Component for the main navigation menu of the site.
    In desktop view it is displayed as a row of tabs at the top of the page.
    In mobile view it is displayed as a dropdown menu.   
*/
import { NavLink, useLocation } from "react-router-dom";
import { Location as RouterLocation } from "react-router";
import { useListChannelsQuery } from "../datastore/chatSlice";
import { ChatChannel } from "../typedefs/chatChannelTypes";
import { useUserLoadQuery } from "../datastore/userSlice";

import styles from "../stylesheets/PageTabs.module.css";
import iconMenu from "/icons/icon-menu.png";
import { useEffect, useState } from "react";

export default function PageTabs(): React.JSX.Element {

    // Get the route of the page we are currently on
    const path: RouterLocation = useLocation();

    // Track if the navigation menu/tabs is visible
    const [navMenuIsOpen, setNavMenuIsOpen] = useState<boolean>(false);
    // Track if we are in mobile view with the dropdown menu.
    const [navIsMenu, setNavIsMenu] = useState<boolean>(false);

    // Get currently logged on user
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    // Load channel data to build tab for the currently joined channel (if any)
    const { data: channelList, isLoading: listIsLoading, isError: channelIsError, error: channelError } = useListChannelsQuery();
    const channelId: string = (userData != undefined) && (userData.channelid != undefined) ? userData.channelid : "";
    const isInChannel: boolean = (channelId != undefined) && (channelId.length > 1);
    const channelData = isInChannel ? channelList?.find((chan) => chan.channelid == channelId) as ChatChannel : { channelid: "", name: "Active channel", description: "", permanent: false, admin: "" } as ChatChannel;

    // Toggle visibility of menu/tabs. In desktop mode the tabs are always visible, in mobile view the menu starts hidden 
    useEffect(() => {
        // Check for layout cutoff width (700px), debounce to avoid state set spam during resize. 
        let resizeDebounce: ReturnType<typeof setTimeout> | undefined;
        const resizeObserver = new ResizeObserver((entries) => {
            clearTimeout(resizeDebounce);
            resizeDebounce = setTimeout(() => {
                if (entries.length > 0) {
                    if ((entries[0].contentRect.width > 700)) {
                        setNavMenuIsOpen(true);
                        setNavIsMenu(false);
                    }
                    else {
                        setNavMenuIsOpen(false);
                        setNavIsMenu(true);
                    }
                }
            }, 500);
        });

        resizeObserver.observe(document.body);
        return () => resizeObserver.disconnect();
    }, []);


    // Currently active tab
    // This should match the router in App.tsx for pages that are supposed to have tabs here. 
    const fragments = path.pathname.split("/");
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
            if (fragments[1] && (fragments[1] == "channel") && (fragments[2] && fragments[2].length)) {
                activeTab = "channel";
            }
            break;
    }

    // Click handler for nav links - if in dropdown menu mode, close the menu after clicking a link. 
    function onNavClick(): void {
        if (navIsMenu) {
            setNavMenuIsOpen(false);
        }
    }


    return (
        <>
            <button id="nav" className={`${styles['nav-menu-button']} ${navMenuIsOpen ? styles['nav-menu-button-active'] : ""}`} onClick={() => setNavMenuIsOpen(!navMenuIsOpen)}><img src={iconMenu} alt="Navigation menu" /></button>
            {navMenuIsOpen && <div className={`${styles['page-tabs']} ${navMenuIsOpen ? styles['page-tabs-active'] : ""}`}>
                <div className={activeTab == "front" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/" onClick={onNavClick}>Home</NavLink>
                </div>
                {userData?.authenticated && <div className={activeTab == "user" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/user/profile" onClick={onNavClick}>User profile</NavLink>
                </div>}
                {userData?.authenticated && <div className={activeTab == "channels" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to="/channels" onClick={onNavClick}>Channels</NavLink>
                </div>}
                {userData?.authenticated && isInChannel && <div className={activeTab == "channel" ? styles['page-tabs-tab-active'] : styles['page-tabs-tab']}>
                    <NavLink to={`/channel/${channelId}`} onClick={onNavClick}>Channel: {channelData.name.slice(0, 100)}</NavLink>
                </div>}
                {(listIsLoading || userIsLoading) && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                {(channelIsError || userIsError) && <div className="error-message">An error occurred! ({channelError != undefined ? channelError as string : ""}{userError != undefined ? userError as string : ""})</div>}
            </div>}
        </>

    );
}