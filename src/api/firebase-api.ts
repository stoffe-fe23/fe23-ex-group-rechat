import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

// Base RTK Query API slice, expanded upon in userSlice.ts and chatSlice.ts
export const firebaseApi = createApi({
    baseQuery: fakeBaseQuery(),
    tagTypes: ["User", "Messages"],
    endpoints: () => ({}),
});