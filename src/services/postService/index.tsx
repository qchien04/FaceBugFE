import axiosClient from '../../config/axiosconfig';
import { APIResponse, CategoryContent, CommentDTO, PaginatedResponse, Post } from '../../utils/type';


const PostService = {
  uploadVideo: async (formData: FormData, config = {}): Promise<APIResponse> => {
    const { data } = await axiosClient.post("/upload2/chunk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
    return data;
  },
  create: async (formData: FormData, config = {}): Promise<Post> => {
    const { data } = await axiosClient.post("/post/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
    return data;
  },
  share: async (okok:object): Promise<APIResponse> => {
    const { data } = await axiosClient.post("/post/share",okok)
    return data;
  },

  createPostCommunity: async (formData:FormData): Promise<Post> => {
    const { data } = await axiosClient.post("/post/community/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    return data;
  },
  update: async (id:number,title:string): Promise<APIResponse> => {
    const { data } = await axiosClient.put(`/post/${id}`, title)
    return data;
  },

  pinPost: async (id:number,pin:boolean): Promise<APIResponse> => {
    const { data } = await axiosClient.put(`/post/${id}/pin`,pin)
    return data;
  },   

  get: async (userId:number,isPage:boolean=false,page:number=0,size:number=10): Promise<PaginatedResponse<Post>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Post>>(`/post/${userId}/all?isPage=${isPage}&&page=${page}&&size=${size}`)
    return data;
  },  

  getCommunityPosts: async (communityId:number,pin:boolean,page:number=0,size:number=10): Promise<PaginatedResponse<Post>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Post>>(`/post/community/${communityId}/all?pin=${pin}&&page=${page}&&size=${size}`)
    return data;
  }, 
  getAllCommunityPosts: async (page:number=0,size:number=10): Promise<PaginatedResponse<Post>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Post>>(`/post/community/all?page=${page}&&size=${size}`)
    return data;
  }, 

  delete: async (id:number): Promise<APIResponse[]> => {
    const { data } = await axiosClient.delete(`/post/${id}`)
    return data;
  },
  getSuggestPost: async (): Promise<Post[]> => {
    const { data } = await axiosClient.get(`/post/suggest/all`)
    return data;
  }, 
  getSuggestPostVideo: async (category?: CategoryContent|null): Promise<Post[]> => {
    const { data } = await axiosClient.get(`/post/suggest/all/video${category ? `?category=${category}` : ''}`)
    return data;
  }, 
  getPostById: async (id:number): Promise<Post> => {
    const { data } = await axiosClient.get(`/post/${id}`)
    return data;
  },
  getImages: async (userId:number): Promise<Post[]> => {
    const { data } = await axiosClient.get(`/post/${userId}/image`)
    return data;
  },
  getVideos: async (userId:number): Promise<Post[]> => {
    const { data } = await axiosClient.get(`/post/${userId}/video`)
    return data;
  },

  getMediaGroup: async (communityId:number): Promise<Post[]> => {
    const { data } = await axiosClient.get(`/post/community/${communityId}/media`)
    return data;
  },
  likePost: async (postId:number): Promise<string[]> => {
    const { data } = await axiosClient.post(`/likes/${postId}/like`)
    return data;
  },
  unlikePost: async (postId:number): Promise<string[]> => {
    const { data } = await axiosClient.delete(`/likes/${postId}/unlike`)
    return data;
  },
  getIsLiked: async (postId:number): Promise<boolean> => {
    const { data } = await axiosClient.get(`/likes/${postId}/isLiked`)
    return data;
  },
  getComment:async (postId:number): Promise<CommentDTO[]> => {
    const { data } = await axiosClient.get(`/comments/${postId}`)
    return data;
  },
  addComment:async (comment:CommentDTO): Promise<CommentDTO> => {
    const { data } = await axiosClient.post(`/comments/${comment.postId}/add`,comment)
    return data;
  },
  getChildComment:async (id:number): Promise<CommentDTO[]> => {
    const { data } = await axiosClient.get(`/comments/${id}/child`)
    return data;
  },
  decreaseRenderTime: async (postIds: number[]): Promise<void> => {
    await axiosClient.post(`/post/decreaseRenderTime`,postIds);
  },

};


export default PostService;