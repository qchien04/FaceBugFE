// src/features/messageNotify/messageNotifySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';
import { Message, MessageNotifyState } from '../../utils/type';

const initialState: MessageNotifyState = {};

const messageNotifySlice = createSlice({
  name: 'messageNotify',
  initialState,
  reducers: {
    initMessageNotify(state, action: PayloadAction<Message[]>) {
      action.payload.forEach((item) => {
        item.state = true;
        state[item.conversationId] = item;
      });
    },

    pushMessageNotify(state, action: PayloadAction<Message>) {
      const payload = action.payload;
      payload.state = true;
      state[payload.conversationId] = payload;
    },

    pushPersonalMessageNotify(state, action: PayloadAction<Message>) {
      const payload = action.payload;
      payload.state = false;
      state[payload.conversationId] = payload;
    },

    deleteMessageNotify(state, action: PayloadAction<number>) {
      const conversationId = action.payload;
      if (state[conversationId+""]) {
        state[conversationId].state = false;

        // Gọi API async bên ngoài slice
        deleteMessageNotifyAPI(conversationId);
      }
    },
  },
});

export const {
  initMessageNotify,
  pushMessageNotify,
  pushPersonalMessageNotify,
  deleteMessageNotify,
} = messageNotifySlice.actions;

export default messageNotifySlice.reducer;

// Hàm gọi API bên ngoài slice (side effect)
const deleteMessageNotifyAPI = async (conversationId: number) => {
  try {
    const res = await chatService.deleteMessageNoitify(conversationId);
    console.log('API Delete:', res);
  } catch (error) {
    console.error('Failed to delete message notify:', error);
  }
};
