import { configureStore } from "@reduxjs/toolkit";
import auth from "./slice/authSlice";
import chatBox from "./slice/chatBoxSlice";
import messageNotify from "./slice/messageNotifySlice";
import conversations from "./slice/conversationsSlice";
export const store = configureStore({
  reducer:{
    auth:auth,
    chatBox:chatBox,
    messageNotify: messageNotify,
    conversations: conversations,
  }
});

// Kiểu toàn cục của RootState và AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;