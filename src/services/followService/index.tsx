import axiosClient from '../../config/axiosconfig';
import { APIResponse } from '../../utils/type';

export enum FollowState{
    FOLLOW="FOLLOW",
    NONE="NONE",
}

const followService = {
  follow: async (id:number): Promise<APIResponse> => {
    const {data} = await axiosClient.post(`/follow/${id}`);
    return data;
  },
  unfollow: async (id:number): Promise<APIResponse> => {
    const {data} = await axiosClient.get(`/follow/${id}/unfollow`);
    return data;
  },

  checkFollow: async (id:number): Promise<FollowState> => {
    const {data} = await axiosClient.get(`/follow/${id}/checkFollow`);
    return data;
  },




};


export default followService;