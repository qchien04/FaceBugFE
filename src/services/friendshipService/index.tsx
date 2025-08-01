import axiosClient from '../../config/axiosconfig';
import { APIResponse, CreateConversationRequest, ProfileSummary } from '../../utils/type';

export enum FriendRequestStatus {
  SENT="SENT",
  RECEIVED="RECEIVED",
  FRIENDS="FRIENDS",
  NONE="NONE"
}
const friendshipService = {


  addFriend: async (req:CreateConversationRequest): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.post('/friendship/addFriend',req);
      if(data.status){
        return data;
      }
      else{
        return data;
      }
    } catch (error) {
      console.error("Can not create friend");
      throw error; 
    }
  },
  getOnline: async (onlines:number[]): Promise<number[]> => {
    try {
      const {data} = await axiosClient.post('/friendship/onlines',onlines);
      if(data.status){
        return data;
      }
      else{
        return data;
      }
    } catch (error) {
      console.error("Can not create friend");
      throw error; 
    }
  },
  getAllFriendProfiles: async (): Promise<ProfileSummary[]> => {
    try {
      const {data} = await axiosClient.get('/friendship/getFriendProfiles');
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },
  getRequest: async (): Promise<ProfileSummary[]> => {
    try {
      const {data} = await axiosClient.get('/friendRequest/all');
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },
  getAllFriendByUserId: async (userId:number): Promise<ProfileSummary[]> => {
    try {
      const {data} = await axiosClient.get(`/friendship/allFriend?userId=${userId}`);
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },
  getAllFriendProfilesByKey: async (key:string): Promise<ProfileSummary[]> => {
    try {
      const {data} = await axiosClient.get(`/friendship/getFriendProfiles?key=${key}`);
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },
  sendRequestMakeFriend:async (id:number): Promise<FriendRequestStatus> => {
    try {
      const {data} = await axiosClient.post(`/friendRequest/sendRequest/${id}`);
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },
  removeRequestMakeFriend:async (id:number): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.post(`/friendRequest/removeRequest/${id}`);
        return data;
    } catch (error) {
      console.error('Error remove friend:', error);
      throw error; 
    }
  },
  refuseRequestMakeFriend:async (id:number): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.post(`/friendRequest/refuseRequest/${id}`);
        return data;
    } catch (error) {
      console.error('Error remove friend:', error);
      throw error; 
    }
  },
  acceptRequestMakeFriend:async (id:number): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.post(`/friendRequest/acceptRequest/${id}`);
        return data;
    } catch (error) {
      console.error('Error remove friend:', error);
      throw error; 
    }
  },
  unFriend:async (id:number): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.post(`/friendship/unFriend/${id}`);
        return data;
    } catch (error) {
      console.error('Error unfriend:', error);
      throw error; 
    }
  },
  checkFriendStatus:async (id:number): Promise<FriendRequestStatus> => {
    try {
      const {data} = await axiosClient.get(`/friendRequest/checkFriendStatus?userId=${id}`);
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },



};


export default friendshipService;