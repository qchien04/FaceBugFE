import axiosClient from '../../config/axiosconfig';
import { AddMemberGroupRequest, APIResponse, ConversationResponse, CreateConversationRequest, MemberGroupChat, Message, MessageNotifyResponse, RemoveMemberGroupRequest } from '../../utils/type';



const chatService = {
  outConversation: async (id:number): Promise<APIResponse> => {
    try{
      const { data } = await axiosClient.delete(`/conversation/delete/${id}`)
      return data;
    } catch (error) {
      console.error('Error delete conversation:', error);
      throw error; 
    }
  },  

  changeAvtGroup: async (formData:FormData): Promise<APIResponse> => {
    const { data } = await axiosClient.post("/conversation/changeAvtGroup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    return data;
  },  


  addMemberToGroup: async (form:AddMemberGroupRequest): Promise<MemberGroupChat> => {
    const { data } = await axiosClient.post(`/conversation/addMemberGroup`,form);
    return data;
  },

  removeMemberFromGroup: async (form:RemoveMemberGroupRequest): Promise<MemberGroupChat> => {
    const { data } = await axiosClient.delete(`/conversation/removeMember`,{data:form});
    return data;
  },

  findMemberInConversation: async (conversationId:number): Promise<MemberGroupChat[]> => {
    const { data } = await axiosClient.get(`/conversation/allMemberInConversation?conversationId=${conversationId}`);
    return data;
  },

  getConversation: async (conversationId:number): Promise<ConversationResponse> => {
    const { data } = await axiosClient.get(`/conversation/getConversation?conversationId=${conversationId}`);
    return data;
  },

  createConversation: async (req:CreateConversationRequest): Promise<ConversationResponse> => {
      const { data } = await axiosClient.post('/conversation/create', req);
      return data;
  },

  checkHaveConversation: async (userId:number): Promise<ConversationResponse> => {
    try {
      const {data} = await axiosClient.get(`/conversation/checkHaveConversation?userId=${userId}`);
        return data;
      }
    catch (error) {
      console.error('Error fetching MessageRoom:', error);
      throw error; 
    }
  },

  getUserChatRooms: async (): Promise<ConversationResponse[]> => {
    try {
      const {data} = await axiosClient.get('/conversation/allConversation');
        return data;
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error; 
    }
  },
 
  getMessageRoom: async (conversationId:number): Promise<Message[]> => {
    try {
      const {data} = await axiosClient.get(`/message/allMessage?conversationId=${conversationId}`);
        return data;
      }
    catch (error) {
      console.error('Error fetching MessageRoom:', error);
      throw error; 
    }
  },

  getAllMessageNoitify: async (): Promise<MessageNotifyResponse[]> => {
    try {
      const {data} = await axiosClient.get(`/messageNotify/allMessageNotify`);
        return data;
      }
    catch (error) {
      console.error('Error fetching getAllMessageNoitify:', error);
      throw error; 
    }
  },

  deleteMessageNoitify: async (conversationId:number): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.delete(`/messageNotify/deleteMessageNotify?conversationId=${conversationId}`);
        return data;
      }
    catch (error) {
      console.error('Error fetching getAllMessageNoitify:', error);
      
      throw error; 
    }
  },
};


export default chatService;