/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Page component for the chat channel page. Contains info about the channel, a list of users in the channel and a list of messages,
    as well as buttons to edit and leave the channel, and a form to post new messages.   
*/
import { NavLink, useParams } from "react-router-dom";
import ChannelMessages from "./ChannelMessages";
import ChannelPostMessage from "./ChannelPostMessage";
import { useUserLoadQuery } from "../datastore/userSlice";
import { useGetChannelQuery, useJoinChannelMutation } from "../datastore/chatSlice";
import React, { useEffect, useState } from "react";
import ChannelUsers from "./ChannelUsers";
import ChannelLeaveButton from "./ChannelLeaveButton";
import { ChatUserData } from "../typedefs/chatUserTypes";

import styles from "../stylesheets/ChannelPage.module.css";
import iconEdit from "/icons/icon-edit.png";
import ChannelEditorDialog from "./ChannelEditorDialog";


// Helper to check if the user is currently logged on
function isLoggedIn(user: ChatUserData | undefined): boolean {
    return (user != undefined) && (user.uid != undefined) && (user.uid != null) && (user.uid.length > 0);
}

export default function ChannelPage(): React.JSX.Element {

    // Fetch the channel ID from the page route (/channel/:channelId)
    const { channelId } = useParams<string>();

    // State controlling if the channel editor dialog box is open.
    const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);

    // Load the current user
    const { data: userData, isLoading: userIsLoading, isError: userIsError, error: userError } = useUserLoadQuery();

    // Load info about this channel
    const { data: channelData, isLoading: channelIsLoading, isError: channelIsError, error: channelError } = useGetChannelQuery(channelId ?? "");
    const [joinChannel, { isLoading: joinIsLoading, isError: joinIsError, error: joinError }] = useJoinChannelMutation();


    // Make current user join the channel if they are not already in it. 
    useEffect(() => {
        if (channelId && channelId.length && userData && (channelId != userData.channelid)) {
            joinChannel(channelId);
        }
    }, [userData, joinChannel, channelId]);



    function onEditorOpen(): void {
        setIsEditorOpen(!isEditorOpen);
    }

    function onEditorClose(): void {
        setIsEditorOpen(false);
    }

    return (
        <>
            {(!isLoggedIn(userData) && !channelIsLoading && !userIsLoading && !joinIsLoading) && <section className={styles['channel-page']}>
                <div className={styles['login-message']}>You must be logged on to join a channel. <NavLink to="/user/login">Go to the login page.</NavLink></div>
            </section>}
            {isLoggedIn(userData) && <section className={styles['channel-page']}>
                {userIsError || channelIsError || joinIsError && <div className={styles['error-message']}>(
                    {userError != undefined ? userError as string : ""}
                    {channelError != undefined ? channelError as string : ""}
                    {joinError != undefined ? joinError as string : ""}
                    )</div>}
                <div className={styles['channel-page-header']}>
                    {userIsLoading || joinIsLoading || channelIsLoading && <div id="busy" className={styles['busy']} title="Please wait..."></div>}
                    <h2 className={styles['channel-page-title']}>{channelData?.name ?? "Untitled channel"}</h2>
                    <div className={styles['channel-page-desc']}>{channelData?.description ?? ""}</div>
                    {((channelData != undefined)
                        && (channelData.admin != undefined)
                        && (userData != undefined)
                        && (channelData.admin.length > 0)
                        && (userData.uid.length > 0)
                        && (channelData.admin == userData.uid)) && <button className={styles['channel-editor-button']} onClick={onEditorOpen} title="Edit channel"><img src={iconEdit} alt="Edit channel information" /></button>}
                </div>
                <ChannelEditorDialog
                    channelId={channelId ?? ""}
                    name={channelData && channelData.name ? channelData.name : ""}
                    description={channelData && channelData.description ? channelData.description : ""}
                    permanent={channelData && channelData.permanent ? channelData.permanent : true}
                    admin={channelData && channelData.admin ? channelData.admin : ""}
                    open={isEditorOpen}
                    onClose={onEditorClose}
                />
                <div className={styles['channel-page-content']}>
                    <div className={styles['channel-page-users']}>
                        <ChannelLeaveButton />
                        <ChannelUsers channelId={channelId ?? ""} adminId={channelData && channelData.admin ? channelData.admin : ""} />
                    </div>
                    <div className={styles['channel-page-messages']}>
                        <ChannelPostMessage channelId={channelId ?? ""} />
                        <ChannelMessages channelId={channelId ?? ""} />
                    </div>
                </div>
            </section>}
        </>
    );
}