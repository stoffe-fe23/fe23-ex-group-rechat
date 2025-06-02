/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    RTK Query Endpoints for managing chat channels, messages and participating user lists.
    Uses the Firebase Firestore database service to store data via the Firebase SDK. 
*/
import { firebaseAuth, firebaseDB } from '../api/firebase-init';
import { firebaseApi } from '../api/firebase-api';
import { doc, updateDoc, serverTimestamp, addDoc, collection, query, orderBy, limit, where, onSnapshot, getDocs, getDoc, Timestamp, deleteDoc, Unsubscribe } from 'firebase/firestore';
import { ChannelUser, ChannelUserProfile, ChatChannel, ChatMessage, EditMessageParams, NewMessageParams } from '../typedefs/chatChannelTypes';

// Store database listener unsubscribe handlers here so they can be manually closed. 
const dbUsersListenerUnsubscribe: Unsubscribe[] = [];
const dbMessagesListenerUnsubscribe: Unsubscribe[] = [];


export const chatApi = firebaseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Load and update the user list of the specified channel
        loadUsers: builder.query<ChannelUser[], string>({
            // Load and cache initial data 
            async queryFn(channelId) {
                try {
                    const userList: ChannelUser[] = [];
                    const qry = query(
                        collection(firebaseDB, "users"),
                        where('channelid', '==', channelId),
                        where('isactive', '==', true),
                        orderBy("nickname", "asc")
                    );

                    const userDocs = await getDocs(qry);
                    userDocs.forEach((doc) => {
                        const usr = doc.data() as ChannelUser;
                        usr.activity = usr.activity != null ? (usr.activity as Timestamp).seconds : 0;
                        userList.push(usr);
                    });

                    return { data: userList };
                }
                catch (error: any) {
                    console.error("ERROR IN loadUsers() queryFn()", error);
                    return { error: error.code };
                }
            },
            // Handle cache updates from firestore snapshot updates
            async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved }) {
                let unsubHandle;
                try {
                    // Look for users in the specified channel
                    const qry = query(
                        collection(firebaseDB, "users"),
                        where('channelid', '==', arg),
                        where('isactive', '==', true),
                        orderBy("nickname", "asc")
                    );
                    // Set the database listener to receive updates
                    unsubHandle = onSnapshot(qry, (snapshot) => {
                        updateCachedData(() => {
                            const userList = snapshot.docs.map((doc) => {
                                const usr = doc.data() as ChannelUser;
                                usr.activity = usr.activity != null ? (usr.activity as Timestamp).seconds : 0;
                                return usr;
                            });
                            return userList as ChannelUser[];
                        });
                    });
                    dbUsersListenerUnsubscribe.push(unsubHandle);
                }
                catch (error: any) {
                    console.error('ERROR IN loadUsers() onCacheEntryAdded', error);
                    throw new Error(`Unable to load channel userlist: ${error.message}`);
                }

                await cacheEntryRemoved;
                if (unsubHandle) {
                    unsubHandle();
                }
            },
            providesTags: ['Users'],
        }),

        // Load messages in the specified channel and listen for updates
        loadMessages: builder.query<ChatMessage[], string>({
            // Load and cache initial message data
            async queryFn(channelId) {
                try {
                    const messageList: ChatMessage[] = [];
                    const qry = query(
                        collection(firebaseDB, "messages"),
                        where('channelid', '==', channelId),
                        orderBy("postdate", "desc"),
                        limit(1000)
                    );

                    const messageDocs = await getDocs(qry);
                    messageDocs.forEach((doc) => {
                        const msg = doc.data() as ChatMessage;
                        msg.messageid = doc.id;
                        msg.postdate = msg.postdate != null ? (msg.postdate as Timestamp).seconds : 0;
                        messageList.push(msg);
                    });

                    return { data: messageList };
                }
                catch (error: any) {
                    console.error("ERROR IN loadMessages() queryFn()", error);
                    return { error: error.code };
                }
            },
            // Handle cache updates from firestore snapshot updates
            async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved, cacheDataLoaded }) {
                let unsubHandle;
                try {
                    await cacheDataLoaded;

                    // Look for messages in the specified channel, cap at the 1000 latest
                    const qry = query(
                        collection(firebaseDB, "messages"),
                        where('channelid', '==', arg),
                        orderBy("postdate", "desc"),
                        limit(1000)
                    );
                    // Set the database listener to receive updates in the messages collection
                    unsubHandle = onSnapshot(qry, (snapshot) => {
                        updateCachedData((/* draft */) => {
                            const msgList = snapshot.docs.map((doc) => {
                                const msgData = doc.data() as ChatMessage;
                                msgData.messageid = doc.id;
                                msgData.postdate = msgData.postdate != null ? (msgData.postdate as Timestamp).seconds : 0;
                                return msgData;
                            });
                            return msgList as ChatMessage[];
                        });
                    });
                    dbMessagesListenerUnsubscribe.push(unsubHandle);
                }
                catch (error: any) {
                    console.error('ERROR IN loadMessages() onCacheEntryAdded', error);
                    throw new Error(`Unable to load channel messages: ${error.message}`);
                }

                await cacheEntryRemoved;
                if (unsubHandle) {
                    unsubHandle();
                }
            },
            providesTags: ['Messages'],
        }),

        // Post a new message to the specified channel by the current user
        postMessage: builder.mutation<string, NewMessageParams>({
            async queryFn({ channelId, messageContent }) {
                try {
                    // Check that the channel with the specified ID actually exists
                    if (firebaseAuth.currentUser) {
                        const chanDoc = await getDoc(doc(firebaseDB, "channels", channelId));
                        if (chanDoc.exists()) {
                            const newMsg: ChatMessage = {
                                author: firebaseAuth.currentUser.uid,
                                channelid: channelId,
                                postdate: serverTimestamp(),
                                content: messageContent
                            }
                            const newDocRef = await addDoc(collection(firebaseDB, 'messages'), newMsg);
                            await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { activity: serverTimestamp() });
                            return { data: newDocRef.id };
                        }
                        else {
                            throw new Error("There is no channel with the specified channel ID.")
                        }
                    }
                    else {
                        throw new Error("You must be logged in to post a new message.");
                    }
                    return { data: "New message posted." };
                }
                catch (error: any) {
                    console.error("postMessage() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Messages'],
        }),

        // Edit a message originally posted by the current user
        editMessage: builder.mutation<string, EditMessageParams>({
            async queryFn({ messageId, messageContent }) {
                try {
                    if (messageId.length > 0) {
                        if (firebaseAuth.currentUser) {
                            // Check that the specified message actually exists.
                            const msgDoc = await getDoc(doc(firebaseDB, "messages", messageId));
                            if (msgDoc.exists()) {
                                const msg = msgDoc.data() as ChatMessage;
                                // Check that the message to edit was created by the user. 
                                if (msg && msg.author && (msg.author == firebaseAuth.currentUser.uid)) {
                                    await updateDoc(doc(firebaseDB, "messages", messageId), { content: messageContent });
                                    await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { activity: serverTimestamp() });
                                }
                                else {
                                    throw new Error("You may only edit messages you have posted.");
                                }
                            }
                            else {
                                throw new Error("No message exists with the specified message ID.");
                            }
                        }
                        else {
                            throw new Error("You must be logged in to edit a message.");
                        }
                    }
                    else {
                        throw new Error("No ID specified for message to edit.");
                    }
                    return { data: messageContent };
                }
                catch (error: any) {
                    console.error("editMessage() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Messages'],
        }),

        // Delete a message by the current user
        deleteMessage: builder.mutation<string, string>({
            async queryFn(messageId) {
                try {
                    if (messageId.length > 0) {
                        if (firebaseAuth.currentUser) {
                            // Check that the specified message actually exists.
                            const msgDoc = await getDoc(doc(firebaseDB, "messages", messageId));
                            if (msgDoc.exists()) {
                                const msg = msgDoc.data() as ChatMessage;
                                // Check that the message to delete was created by the user. 
                                if (msg && msg.author && (msg.author == firebaseAuth.currentUser.uid)) {
                                    await deleteDoc(doc(firebaseDB, "messages", messageId));
                                    await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { activity: serverTimestamp() });
                                }
                                else {
                                    throw new Error("You may only delete messages you have posted.");
                                }
                            }
                            else {
                                throw new Error("No message exists with the specified message ID.");
                            }
                        }
                        else {
                            throw new Error("You must be logged in to delete a message.");
                        }
                    }
                    else {
                        throw new Error("No ID specified for message to delete");
                    }
                    return { data: `Message deleted: ${messageId}` };
                }
                catch (error: any) {
                    console.error("deleteMEssage() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Messages'],
        }),

        // Join the specified channel 
        joinChannel: builder.mutation<string, string>({
            async queryFn(channelId) {
                try {
                    if (firebaseAuth.currentUser) {
                        const channelDoc = await getDoc(doc(firebaseDB, "channels", channelId));
                        // const response = await queryApi.dispatch(api.endpoints.getQuote.initiate(someArgsHere))`

                        if (!channelDoc.exists())
                            throw new Error(`Unable to join channel. A channel with the specified ID ${channelId} does not exist.`);

                        await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { channelid: channelId, activity: serverTimestamp() });
                    }
                    return { data: "Joined channel " + channelId };
                }
                catch (error: any) {
                    console.error("joinChannel() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Messages', 'User', 'Users'],
        }),

        // Leave the specified channel - no ID needed here since the user can only be in at most one channel.
        leaveChannel: builder.mutation<string, void>({
            async queryFn() {
                try {
                    if (firebaseAuth.currentUser) {
                        await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { channelid: "", activity: serverTimestamp() });
                    }
                    return { data: "Left current channel." };
                }
                catch (error: any) {
                    console.error("leaveChannel() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Messages', 'User', 'Users'],
        }),

        // Unsubscribe the database listeners for the channel users and messages updates. 
        unsubListeners: builder.mutation<string, void>({
            async queryFn() {
                try {
                    if (dbUsersListenerUnsubscribe.length) {
                        dbUsersListenerUnsubscribe.forEach((unsubHandle) => {
                            if (unsubHandle)
                                unsubHandle();
                        });
                        dbUsersListenerUnsubscribe.length = 0;
                    }
                    if (dbMessagesListenerUnsubscribe.length) {
                        dbMessagesListenerUnsubscribe.forEach((unsubHandle) => {
                            if (unsubHandle)
                                unsubHandle();
                        });
                        dbMessagesListenerUnsubscribe.length = 0;
                    }
                    return { data: "Database listeners closed." };
                }
                catch (error: any) {
                    console.error("resetListeners() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Messages', 'Users'],
        }),

        // Create and join a new channel 
        createChannel: builder.mutation<string, ChatChannel>({
            async queryFn({ name, description, permanent }) {
                try {
                    if (firebaseAuth.currentUser) {
                        const newChannel: ChatChannel = {
                            name: name,
                            description: description,
                            permanent: permanent,
                            admin: firebaseAuth.currentUser.uid
                        }
                        // Create the new channel
                        const newDocRef = await addDoc(collection(firebaseDB, 'channels'), newChannel);

                        // Make the creator join their new channel
                        await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { channelid: newDocRef.id, activity: serverTimestamp() });

                        return { data: newDocRef.id };
                    }
                    else {
                        throw new Error("You must be logged in to create a new channel.");
                    }
                    return { data: "Channel not created." };
                }
                catch (error: any) {
                    console.error("createChannel() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Channels', 'User', 'Users'],
        }),

        // Create and join a new channel 
        editChannel: builder.mutation<string, ChatChannel>({
            async queryFn({ channelid, name, description, permanent, admin }) {
                try {
                    if (firebaseAuth.currentUser) {
                        const channelData: ChatChannel = {
                            name: name,
                            description: description,
                            permanent: permanent,
                            admin: (admin && admin.length ? admin : firebaseAuth.currentUser.uid)
                        }
                        if (channelid && channelid.length > 0) {
                            // Update the channel info
                            await updateDoc(doc(firebaseDB, "channels", channelid), channelData);

                            // Update the activity of the user
                            await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), { activity: serverTimestamp() });
                        }

                        return { data: "Success" };
                    }
                    else {
                        throw new Error("You must be logged on to edit channel information.");
                    }
                }
                catch (error: any) {
                    console.error("editChannel() ERROR", error);
                    return { error: error.code };
                }
            },
            invalidatesTags: ['Channels', 'Channel', 'Users'],
        }),

        // Get a list of all existing channels
        listChannels: builder.query<ChatChannel[], void>({
            async queryFn() {
                try {
                    const channelList: ChatChannel[] = [];
                    const channelDocs = await getDocs(query(collection(firebaseDB, 'channels'), orderBy("name", "asc")));
                    channelDocs.forEach((doc) => {
                        const chan = doc.data() as ChatChannel;
                        chan.channelid = doc.id;
                        channelList.push(chan);
                    });

                    return { data: channelList };
                }
                catch (error: any) {
                    console.error("ERROR IN listChannels() queryFn()", error);
                    return { error: error.code };
                }
            },
            providesTags: ['Channels'],
        }),

        // Get information about a specific channel
        getChannel: builder.query<ChatChannel, string>({
            async queryFn(channelId) {
                try {
                    if ((channelId != undefined) && (channelId.length > 1)) {
                        const channelDoc = await getDoc(doc(firebaseDB, "channels", channelId));
                        if (!channelDoc.exists()) {
                            throw new Error("The specified channel does not exist.");
                        }
                        return { data: channelDoc.data() as ChatChannel };
                    }
                    else {
                        throw new Error("Unable to load channel information. No channel ID specified.");
                    }
                }
                catch (error: any) {
                    console.error("ERROR IN getChannel() queryFn()", error);
                    return { error: error.code };
                }
            },
            providesTags: ['Channel'],
        }),

        // Get a list of all user profiles for resolving name and picture from UIDs
        getUserProfileList: builder.query<ChannelUserProfile[], void>({
            async queryFn() {
                try {
                    const profileList: ChannelUserProfile[] = [];
                    const qry = query(
                        collection(firebaseDB, "users"),
                        orderBy("nickname", "asc")
                    );


                    const userDocs = await getDocs(qry);
                    userDocs.forEach((doc) => {
                        const usr = doc.data() as ChannelUserProfile;
                        const profile: ChannelUserProfile = {
                            authid: doc.id,
                            nickname: usr.nickname,
                            picture: usr.picture
                        }
                        profileList.push(profile);
                    });

                    return { data: profileList };
                }
                catch (error: any) {
                    console.error("ERROR IN getUserProfileList() queryFn()", error);
                    return { error: error.code };
                }
            },
            providesTags: ['Profiles'],
        }),
    })
});

export const {
    useLoadMessagesQuery,
    useListChannelsQuery,
    useGetChannelQuery,
    useLoadUsersQuery,
    useGetUserProfileListQuery,
    usePostMessageMutation,
    useEditMessageMutation,
    useDeleteMessageMutation,
    useJoinChannelMutation,
    useLeaveChannelMutation,
    useCreateChannelMutation,
    useEditChannelMutation,
    useUnsubListenersMutation
} = chatApi;