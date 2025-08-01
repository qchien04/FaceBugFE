// src/features/memberGroup/memberGroupSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConversationResponse, ConversationsState } from "../../utils/type";

const initialState: ConversationsState = {
  conversations: null,
};

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    initConversation(state, action: PayloadAction<ConversationResponse[]>) {
      state.conversations = [...action.payload];
    },

    pushConversation(state, action: PayloadAction<ConversationResponse>) {
      if (state.conversations === null) {
        state.conversations = [action.payload];
      } else {
        state.conversations.push(action.payload);
      }
    },

    removeConversation(state, action: PayloadAction<number>) {
      if (state.conversations) {
        state.conversations = state.conversations.filter(
          (item) => item.id !== action.payload
        );
      }
    },
  },
});

export const {
  initConversation,
  pushConversation,
  removeConversation,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
