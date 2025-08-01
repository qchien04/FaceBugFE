import { Avatar, message} from "antd";
import PostService from "../../services/postService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTimeAgo } from "../../utils/request";
import { NotificationResponse } from "../../services/notifyService";

import "./Notify.css"
import { Post } from "../../utils/type";
import PostModal from "../PostModal";

interface prop{
    item?:NotificationResponse,
}
const WithModalNoitify=React.memo(({item}:prop)=>{
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [post,setPost]=useState<Post|null>(null);
    const [commentId,setCommentId]=useState<number|null>(null);
    const { postId } = useParams<{ postId: string }>();



    
   
    const fetchdata=async()=>{
        console.log("goi comment")
        const endpoint=postId?postId:item!.link.split("/").pop();
        const arr=endpoint!.split("?");
        let commentId=null;
        if(arr[1]){
            commentId=arr[1].split("=").pop();
        }
        if(arr){
            const postdata=await PostService.getPostById(parseInt(arr[0]));
            setPost(postdata);
            if(commentId) setCommentId(parseInt(commentId));
        }
        else{
            message.error("Có lỗi xảy ra!");
        }
        
    }

    useEffect(() => {
        if(isModalOpen) fetchdata();
    }, [isModalOpen]);


    return(
    <>
        {!postId&&
                <div className="notify__item" onClick={()=>setIsModalOpen(true)}>
                <div>
                    <Avatar src={item!.avt} size={50}/>
                </div>
                    
                <div className="notify__content">
                    <div className="notify__message">{item!.message}</div>
                    <div className="notify__time">{getTimeAgo(item!.createdAt)}</div>
                </div>
            </div>
        }
        
        {post&&<PostModal post={post} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} commentId={commentId}></PostModal>}
    </>
    )
})
export default WithModalNoitify;