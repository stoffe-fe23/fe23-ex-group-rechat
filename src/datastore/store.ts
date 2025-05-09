import { configureStore } from "@reduxjs/toolkit";
import chatUserReducer from "./sliceChatUser";


export const store = configureStore({
    reducer: {
        user: chatUserReducer
    }
});

// Type definitions for the Root State and dispatch
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
