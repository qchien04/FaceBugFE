// src/services/userService.js
import axiosClient from '../../config/axiosconfig';
import { CreatePageRequest, PaginatedResponse, Profile, ProfileSummary } from '../../utils/type';

const userService = {
  // Lấy danh sách người dùng
  getUsers: async (params:string) => {
    try {
      const response = await axiosClient.get('/users', { params });
      return response; // Trả về dữ liệu đã xử lý từ Interceptor
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Đẩy lỗi ra để xử lý thêm nếu cần
    }
  },

  // Tạo người dùng mới
  createUser: async (data:unknown) => {
    try {
      const response = await axiosClient.post('/users', data);
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  getUsersByQuery: async (query:string) => {
    try {
      const {data} = await axiosClient.get(`api/users/${query}`);
      return data; // Trả về dữ liệu đã xử lý từ Interceptor
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Đẩy lỗi ra để xử lý thêm nếu cần
    }
  },
  searchUsersByKey: async (query:string,isPage:boolean=false,page:number=0,size:number=10):Promise<PaginatedResponse<ProfileSummary>> => {
    try {
      const {data} = await axiosClient.get<PaginatedResponse<ProfileSummary>>(`friendship/searchFriend?key=${query}&&isPage=${isPage}&&page=${page}&&size=${size}`);
      console.log(data)
      return data; // Trả về dữ liệu đã xử lý từ Interceptor
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; // Đẩy lỗi ra để xử lý thêm nếu cần
    }
  },
  userProfileData:async (id:number):Promise<Profile>=>{
    try {
      const {data} = await axiosClient.get(`/api/users/profile/${id}`);
      return data; 
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; 
    }
  },

  userProfilesData:async ():Promise<ProfileSummary[]>=>{
    try {
      const {data} = await axiosClient.get(`/api/users/profiles`);
      return data; 
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error; 
    }
  },

  changeUserDescription:async (text:string):Promise<string>=>{
    try {
      const {data} = await axiosClient.post(`/api/users/profile/description`,text);
      return data; 
    } catch (error) {
      console.error('Error changeUserDescription users:', error);
      throw error; 
    }
  },
  changeUserAbout:async (form:object):Promise<string>=>{
    try {
      const {data} = await axiosClient.put(`/api/users/profile/about`,form);
      return data; 
    } catch (error) {
      console.error('Error changeUserDescription users:', error);
      throw error; 
    }
  },
  changeCoverPhoto: async (formData:FormData): Promise<string> => {
    const { data } = await axiosClient.post("/api/users/changeCoverPhoto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    return data;
  },  
  changeAvt: async (formData:FormData): Promise<string> => {
    const { data } = await axiosClient.post("/api/users/changeAvt", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    return data;
  },

  createPage:async (ok:CreatePageRequest):Promise<string>=>{
    try {
      const {data} = await axiosClient.post(`/api/users/createPage`,ok);
      return data; 
    } catch (error) {
      console.error('Error changeUserDescription users:', error);
      throw error; 
    }
  },

};

export default userService;
