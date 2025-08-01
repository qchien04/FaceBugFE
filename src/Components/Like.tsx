
import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import PostService from "../services/postService";



interface prop{
  postId:number,
}

const Like:React.FC<prop> = ({postId}) => {
  const [liked, setLiked] = useState<boolean>(false);

  const handleLike= async () => {
    setLiked((prev) => !prev);
    try {
      if(!liked){
        await PostService.likePost(postId)
      } 
      else await PostService.unlikePost(postId);

    } catch (error) {
      console.error("Lỗi:", error);
      setLiked((prev) => !prev); 
    }
  };
  
  const fetchIsLike=async()=>{
    const data=await PostService.getIsLiked(postId);
    setLiked(data);
  }

  useEffect(() => {
    fetchIsLike();
  }, []);

  return (
      <Button
        type="text"
        icon={liked ? <LikeFilled style={{ color: "#1890ff" }} /> : <LikeOutlined />}
        onClick={handleLike}
      >
        {"Thích"}
      </Button>
    );
};

export default Like;
