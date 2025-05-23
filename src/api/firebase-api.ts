import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";


// Base RTK Query slice, endpoints are added in userSlice.ts and chatSlice.ts
export const firebaseApi = createApi({
    baseQuery: fakeBaseQuery(),
    tagTypes: ["Profiles", "Users", "User", "Messages", "Channels", "Channel"],
    endpoints: () => ({}),
});