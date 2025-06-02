/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Component displaying a modal dialog box with a channel editor form.  
    This functionality is only available to the channel owner/admin. 
*/
import React, { useEffect, useRef, useState } from 'react';
import { useEditChannelMutation, useLoadUsersQuery } from '../datastore/chatSlice';
import { ChatChannel } from '../typedefs/chatChannelTypes';

import styles from "../stylesheets/ChannelEditorDialog.module.css";
import iconEdit from "/icons/icon-edit.png";
import iconCancel from "/icons/icon-stop.png";

type ChannelEditorDialogProps = {
    channelId: string,
    name: string,
    description: string,
    permanent: boolean,
    admin: string,
    open: boolean,
    onClose: () => void
}

export default function ChannelEditorDialog({ channelId, name, description, permanent, admin, open, onClose }: ChannelEditorDialogProps): React.JSX.Element {

    // Dialog element reference to use for opening it as a modal dialog
    const channelEditor = useRef<HTMLDialogElement>(null);

    // Form field states
    const [channelName, setChannelName] = useState<string>(name);
    const [channelDesc, setChannelDesc] = useState<string>(description);
    const [channelPerm, setChannelPerm] = useState<boolean>(permanent);
    const [channelAdmin, setChannelAdmin] = useState<string>(admin);

    // Load list of users in the specified channel - to populate the admin change menu.
    const { data: usersList, isLoading: listIsLoading, isError: listIsError, error: listError } = useLoadUsersQuery(channelId);

    const [editChannel, { isLoading: editChannelIsLoading, isError: editChannelIsError, error: editChannelError }] = useEditChannelMutation();

    // React to open/closed state changes
    useEffect(() => {
        if (channelEditor && channelEditor.current) {
            if (open) {
                channelEditor.current.showModal();
            }
            else {
                channelEditor.current.close();
            }
        }
        setChannelName(name);
        setChannelDesc(description);
        setChannelPerm(permanent);
        setChannelAdmin(admin);

    }, [open, name, description, permanent, admin]);


    // Form Submit handler - save changes
    async function onEditorFormSubmit(evt: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        evt.preventDefault();
        try {
            await editChannel({ channelid: channelId, name: channelName, description: channelDesc, permanent: channelPerm, admin: channelAdmin } as ChatChannel).unwrap();
            onClose();
        }
        catch (err: any) {
            console.error("Edit channel error: ", err);
        }
    }

    return (
        <dialog ref={channelEditor} className={styles['channel-editor']}>
            <form className={styles['channel-editor-form']} onSubmit={onEditorFormSubmit}>
                <div>
                    <label htmlFor="name">Channel name</label>
                    <input type="text" name="name" id="name" value={channelName} onChange={(evt) => setChannelName(evt.target.value)} placeholder="Name of the channel" minLength={4} maxLength={50} required></input>
                </div>
                <div>
                    <label htmlFor="description">Short description of channel</label>
                    <textarea id="description" name="description" value={channelDesc} onChange={(evt) => setChannelDesc(evt.target.value)} placeholder="Describe what the channel is about." minLength={5} maxLength={255} required></textarea>
                </div>
                <div className={styles['channel-create-permanent-wrapper']}>
                    <input type="checkbox" name="permanent" id="permanent" defaultChecked={channelPerm} onChange={(evt) => setChannelPerm(evt.target.checked)}></input>
                    <label htmlFor="permanent">Channel persists with no participants</label>
                </div>
                <div>
                    <label htmlFor="admin">Channel admin</label>
                    <select name="admin" id="admin" value={channelAdmin} onChange={(evt) => setChannelAdmin(evt.target.value)}>
                        {usersList?.map((usr, idx) => <option key={usr.authid.length ? usr.authid : idx} value={usr.authid}>{usr.nickname}</option>)}
                    </select>
                </div>
                {editChannelIsError || listIsError && <div className={styles['error-message']}> An error occurred when editing the channel! ({editChannelError != undefined ? editChannelError as string : ""}{listError != undefined ? listError as string : ""})</div>}
                <button disabled={editChannelIsLoading || listIsLoading}>
                    {editChannelIsLoading || listIsLoading && <div id="busy" className={styles['busy-editor']} title="Please wait..."></div>}
                    <img src={iconEdit} alt="Edit channel info" />Save
                </button>
                <button disabled={editChannelIsLoading || listIsLoading} type="button" onClick={() => onClose()} formNoValidate>
                    <img src={iconCancel} alt="Cancel channel editor" />Cancel
                </button>
            </form>
        </dialog>
    );
}

