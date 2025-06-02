/*
    Group ReChat - Examensarbete uppgift - Kristoffer Bengtsson (FE23)

    Base Redux Toolkit Query slice, the endpoints are then added in datastore/userSlice.ts and datastore/chatSlice.ts.
*/

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const firebaseApi = createApi({
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Profiles", "Users", "User", "Messages", "Channels", "Channel"],
    endpoints: () => ({}),
});