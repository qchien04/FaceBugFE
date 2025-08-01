import axiosClient from '../../config/axiosconfig';
import { APIResponse, Community, CommunityMember, CommunityRole, CrCommunityForm, PaginatedResponse, ProfileSummary } from '../../utils/type';


const CommunityService = {

  create: async (formData:CrCommunityForm): Promise<APIResponse> => {
    const { data } = await axiosClient.post("/community/create",formData)
    return data;
  },
  searchCommunityByKey : async (query: string, page: number = 0, size: number = 10): Promise<PaginatedResponse<Community>> => {
    try {
      const { data } = await axiosClient.get<PaginatedResponse<Community>>(`community/searchCommunity?key=${query}&page=${page}&size=${size}`);
        
      return data; 
    } catch (error) {
      console.error('Error fetching community:', error);
      throw error;
    }
  },
  outCommunity: async (id:number): Promise<APIResponse> => {
    const { data } = await axiosClient.post(`/community/${id}/outCommunity`)
    return data;
  },
  joinCommunity: async (id:number): Promise<CommunityRole> => {
    const { data } = await axiosClient.post(`/community/${id}/joinCommunity`)
    return data;
  },
  
  inviteCommunity: async (ProfileSummary:ProfileSummary,id:number): Promise<APIResponse> => {
    const { data } = await axiosClient.post(`/community/${id}/inviteCommunity`,ProfileSummary)
    return data;
  },
  changeDescription: async (id:number,description:string): Promise<APIResponse> => {
    const { data } = await axiosClient.post(`/community/${id}/description`,description)
    return data;
  },
  get: async (id:number): Promise<Community> => {
    const { data } = await axiosClient.get(`/community/${id}`)
    return data;
  },
  getUserCommunity: async (): Promise<Community[]> => {
    const { data } = await axiosClient.get(`/community/all`)
    return data;
  },
  getMembers: async (id:number): Promise<CommunityMember[]> => {
    const { data } = await axiosClient.get(`/community/${id}/members`)
    return data;
  },
  getPendingMembers: async (id:number): Promise<CommunityMember[]> => {
    const { data } = await axiosClient.get(`/community/${id}/pendingMembers`)
    return data;
  },
  checkExist: async (id:number): Promise<CommunityRole> => {
    const { data } = await axiosClient.get(`/community/${id}/inCommunity`)
    return data;
  },
  accepMember: async (id:number,memberId:number): Promise<CommunityRole> => {
    const { data } = await axiosClient.post(`/community/${id}/acceptJoinCommunity`,memberId);
    return data;
  },
  changeCoverPhoto: async (formData:FormData): Promise<string> => {
    const { data } = await axiosClient.post("/community/changeCoverPhoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    return data;
  },
  deleteMember: async (id:number,memberId:number): Promise<APIResponse> => {
    const { data } = await axiosClient.delete(`/community/${id}/deleteMember?profileId=${memberId}`);
    return data;
  },
  // update: async (id:number,title:string): Promise<APIResponse> => {
  //   const { data } = await axiosClient.put(`/post/${id}`, title)
  //   return data;
  // },    


};


export default CommunityService;