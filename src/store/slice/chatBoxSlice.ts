// src/features/chatBox/chatBoxSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatBoxFrame, ChatBoxState, MemberGroupChat } from '../../utils/type';

const initialState: ChatBoxState = {
  chatboxFrames: null,
};

const chatBoxSlice = createSlice({
  name: 'chatBox',
  initialState,
  reducers: {
    openChatBox(state, action: PayloadAction<ChatBoxFrame>) {
      const newChatBox: ChatBoxFrame = {
        ...action.payload,
        isOpen: true,
      };

      if(state.chatboxFrames==null){
        state.chatboxFrames = [newChatBox];
      }
      else{
        const exist=state.chatboxFrames.find(item=>item.conversationId===action.payload.conversationId)
        if(!exist) state.chatboxFrames.unshift(newChatBox);
        else{
          exist.isOpen=true;
        }
      }
    },

    updateChatBox(state, action: PayloadAction<ChatBoxFrame>) {
      if (state.chatboxFrames != null) {
        state.chatboxFrames = state.chatboxFrames.map(chatBoxFrame => {
          if (chatBoxFrame.friend != null) {
            if(chatBoxFrame.friend.id==action.payload.friend!.id){
              console.log("update_______________________________")
              return {
                ...chatBoxFrame,
                conversationId:action.payload.conversationId,
                isOpen:true,
              };
            }
            return chatBoxFrame;
          }
          return chatBoxFrame;
        });
      }
    },
    
    closeChatBox(state,action: PayloadAction<number>) {
      if(state.chatboxFrames!=null){
        state.chatboxFrames=state.chatboxFrames.filter(chatBoxFrame => chatBoxFrame.conversationId!=action.payload )
      }
    },
    hideChatBox(state, action: PayloadAction<number>) {
      if (state.chatboxFrames != null) {
        state.chatboxFrames = state.chatboxFrames.map(chatBoxFrame => {
          if (chatBoxFrame.conversationId == action.payload) {
            return {
              ...chatBoxFrame,
              isOpen: false,
            };
          }
          return chatBoxFrame;
        });
      }
    },
    initMember(state, action: PayloadAction<MemberGroupChat[]>) {
      if (!state.chatboxFrames) return;
      if (action.payload.length === 0) return;

      const conversationId = action.payload[0].conversationId;

      const targetChatBox = state.chatboxFrames.find(
          frame => frame.conversationId === conversationId
      );

      if (targetChatBox) {
          targetChatBox.members = [...action.payload];
      }
    },

    pushMember(state, action: PayloadAction<MemberGroupChat>) {
      if (!state.chatboxFrames) return;

      const conversationId = action.payload.conversationId;

      const targetChatBox = state.chatboxFrames.find(
        frame => frame.conversationId === conversationId
      );

      if (!targetChatBox) return;

      if (!targetChatBox.members || targetChatBox.members.length === 0) {
        targetChatBox.members = [action.payload];
      } else {
        targetChatBox.members.push(action.payload);
      }
    },


    removeMember(state, action: PayloadAction<MemberGroupChat>) {
      if (!state.chatboxFrames) return;

      const conversationId = action.payload.conversationId;

      const targetChatBox = state.chatboxFrames.find(
        frame => frame.conversationId === conversationId
      );

      if (!targetChatBox || !targetChatBox.members) return;

      targetChatBox.members = targetChatBox.members.filter(
        member => member.memberId !== action.payload.memberId
      );
    },

  },
});

export const {
  openChatBox,
  closeChatBox,
  hideChatBox,
  updateChatBox,
  initMember,
  pushMember,
  removeMember, 
} = chatBoxSlice.actions;

export default chatBoxSlice.reducer;
