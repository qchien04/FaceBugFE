import { useEffect } from "react";
import { useState } from "react";
import PostService from "../../../services/postService";
import { Col, Empty, message, Row } from "antd";
import Post from "../../../Components/Post";
import { useSearchParams } from "react-router-dom";
import { CategoryContent, Post as PostDTO} from "../../../utils/type";
import { AxiosError } from "axios";

const WatchPage=()=>{
    const [posts,setPosts]= useState<PostDTO[]>([])
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category') as CategoryContent | null;

    const fetchPost = async () => {
      try {
        const data = await PostService.getSuggestPostVideo(category);
        console.log(data.length);
        setPosts(data);
      } catch (err) {
        message.error("Không thể tải bài viết"+err);
      }
  };
    useEffect(()=>{
      fetchPost();
    },[category])

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
          <Col xs={24} sm={18} md={18} lg={18} >
            <div>
              {posts.map((val) => (
                <Post val={val} key={val.id} 
                      //community={community}
                      deletePost={deletePost} 
                  />
                ))
              }
            </div>
            <Empty description="Không có bài viết nào" />
          </Col>
        </Row>
      </>
    )
}


export default WatchPage;