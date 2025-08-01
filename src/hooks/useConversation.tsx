import { useEffect } from "react";
import chatService from "../services/chatService";
import { RootState } from "../store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { initConversation, pushConversation, removeConversation } from "../store/slice/conversationsSlice";
import { ConversationResponse } from "../utils/type";


export const useConversation = () => {
  const dispatch = useDispatch();
  const {conversations}=useSelector((state:RootState)=>state.conversations);

  const fetchAllConversation = async () => { 
    const allconversation=await chatService.getUserChatRooms();
    dispatch(
      initConversation(allconversation)
    );
  }

  const addConversation = async (conversation:ConversationResponse) => { 
    dispatch(
      pushConversation(conversation)
    );
  }

  const deleteConversation = async (conversationId:number) => { 
    const data = await chatService.outConversation(conversationId);
    if(data){
      dispatch(
        removeConversation(conversationId)
      );
    }
   
  }
  useEffect(() => {
    console.log("fetch all conversation ---------------------------------------")
    fetchAllConversation()
  }, []);

  return {
    conversations,
    addConversation,
    deleteConversation
  };
};
