
import { Col, Empty, message, Row } from "antd";
import { useEffect, useState } from "react";
import PostService from "../../../services/postService";
import Post from "../../../Components/Post";
import { useOutletContext } from "react-router-dom";
import { AxiosError } from "axios";
import { Community,PaginatedResponse,Post as PostDTO } from "../../../utils/type";

const CommunityOverView:React.FC=()=>{
    const [posts,setPosts]= useState<PostDTO[]>([])
    const [loading, setLoading] = useState<boolean>(false);
    const {communities}=useOutletContext<{communities:Community[]}>();
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const fetchPost = async (pageNum = 0) => {
      setLoading(true);
      const data:PaginatedResponse<PostDTO> = await PostService.getAllCommunityPosts(pageNum,5);
      if (pageNum === 0) {
        setPosts(data.content || []);
      } else {
        setPosts(prev => [...prev, ...(data.content || [])]);
      }
      setHasMore(!data.last);
      setLoading(false);
  };
    useEffect(() => {
      if(!loading){
        fetchPost(page);
      }
    }, [page]);

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
        <Row justify={"center"} style={{width:"100%"}}>
          <Col xs={24} sm={16} md={16} lg={16} >
            <div>
            {posts.length === 0 ? (
              <Empty description="Chưa có bài viết nào trong nhóm này." />
            ) : (
              posts.map((val) => (
                <Post val={val} key={val.id} 
                    community={communities.find(c=>c.communityId===val.communityId)}
                    deletePost={deletePost} 
                />
              ))
            )}
            {loading && <div style={{textAlign: "center", margin: 16}}>Đang tải...</div>}
          </div>
          </Col>
        </Row>
      </>
    )
}

export default CommunityOverView;