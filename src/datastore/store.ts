import { configureStore } from "@reduxjs/toolkit";
import { firebaseApi } from "../api/firebase-api";


// Configure Redux store, add in RTK Query reducers
export const store = configureStore({
    reducer: {
        [firebaseApi.reducerPath]: firebaseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(firebaseApi.middleware),
});


// Type definitions for the Root State and dispatch
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
