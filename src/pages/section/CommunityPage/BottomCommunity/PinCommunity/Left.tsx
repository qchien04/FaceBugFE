




import { message, Empty } from "antd";
import { useEffect, useState } from "react";
import PostService from "../../../../../services/postService";
import Post from "../../../../../Components/Post";
import { AxiosError } from "axios";
import { Community, CommunityRole, PaginatedResponse,Post as PostDTO } from "../../../../../utils/type";

interface Props {
  community: Community;
  role: CommunityRole;
}

const Left:React.FC<Props>=({community,role})=>{
  const [posts,setPosts]= useState<PostDTO[]>([])
  const [loading, setLoading] = useState<boolean>(false);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  
  const fetchPost = async (pageNum = 0) => {
    setLoading(true);
    const data: PaginatedResponse<PostDTO> = await PostService.getCommunityPosts(community.communityId,true, pageNum, 5);
    if (pageNum === 0) {
      setPosts(data.content || []);
    } else {
      setPosts(prev => [...prev, ...(data.content || [])]);
    }
    setHasMore(!data.last);
    setLoading(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  useEffect(()=>{
    setPage(0);
    setHasMore(true);
  },[community.communityId])

  useEffect(() => {
    fetchPost(page);
  }, [page, community.communityId]);

  const deletePost=(id:number)=>{
    try{
      PostService.delete(id);
      const newPosts=posts.filter((item)=>item.id!=id);
      setPosts(newPosts);
      message.success("Xóa thành công")
    }
    catch (error) {
      const err = error as AxiosError<{ message: string }>;      
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Đã có lỗi xảy ra.");
      }
    }     
  }
  return(
    <>
 
      { posts.length === 0 ? (
        <Empty description="Chưa có bài viết nào trong nhóm này." />
      ) : (
        posts.map((val) => (
          <Post val={val} key={val.id} community={community} deletePost={deletePost} role={role}/>
        ))
      )}
      {loading && <div style={{textAlign: "center", margin: 16}}>Đang tải...</div>}
    </>
  )
}

export default Left;

