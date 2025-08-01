import { useEffect, useState } from "react";
import Post from "../../../Components/Post";
import PostNewStatusBar from "../../../Components/PostNewStatusBar";
import "./HomePage.css"
import PostService from "../../../services/postService";
import { message } from "antd";
import { AxiosError } from "axios";
import { Post as PostDTO } from "../../../utils/type";
const HomePage=()=>{
  const [posts,setPosts]=useState<PostDTO[]>([])
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const fetchPost = async () => {
    console.log(page);
    setLoading(true);
    const data=await PostService.getSuggestPost();

    const newUniquePosts = data.filter(
      (newPost) => !posts.some((existingPost) => existingPost.id === newPost.id)
    );

    setPosts([...posts,...newUniquePosts]);
    setHasMore(true);
    setLoading(false);
  };

  useEffect(() => {
    if(!loading){
      fetchPost();
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
          <div className="home_post_list">
              <PostNewStatusBar/>
              {posts.map((val,index)=>(
                  <Post val={val} key={index} deletePost={deletePost}></Post>
              ))}
              
              {loading && <div style={{textAlign: "center", margin: 16}}>Đang tải...</div>}
          
        </div>  
      </>
  )
}

export default HomePage;