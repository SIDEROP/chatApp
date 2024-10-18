import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import chatSlice from "./slices/chatSlice";
import messageSlice from "./slices/messageSlice";
import userSlice from "./slices/userSlice";
import notificationSlice from "./slices/notificationSlice";

const Store = configureStore({
    reducer:{
       auth:authSlice,
       chat:chatSlice,
       message:messageSlice,
       user:userSlice,
       notification:notificationSlice
    }
})

export {Store}