


import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useState } from "react";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import TextArea from "antd/es/input/TextArea";
import { CommentDTO } from "../../utils/type";



interface prop{
  postId:number,
  addComment: (newComment: CommentDTO) => Promise<void>;
}

const UploadComment:React.FC<prop> = ({postId,addComment}) => {
    const { user } = useSelector((state: RootState) => state.auth);

    const [commentContent,setCommentContent]=useState<string>("");

    const submit=async()=>{
        const newComment:CommentDTO={
            authorAvatar:user!.avt,
            authorId:user!.id,
            authorName:user!.name,
            createdAt:"2025-03-19T18:09:56.691829",
            id:-1,
            content:commentContent,
            replyCounter:null,
            postId:postId,
            parent:null,
        }
        setCommentContent("");
        addComment(newComment);
    }

    return (
        <div style={{display: "flex" ,width:"100%",paddingBottom:10,paddingTop:10,borderTop: "1px solid rgb(164, 158, 158)"}}>
            <div style={{marginLeft:19}}>
                <Avatar size={29} src={user!.avt} />
            </div>

            <div style={{marginLeft:6,flex:1,paddingRight:20}}>
                <div style={{border:"1px solid gray",borderRadius:10,padding:5,wordBreak:"break-word"}}>
                    <div>
                        <TextArea placeholder="Nhập bình luận..." 
                            autoSize={{ minRows: 1, maxRows: 15 }}
                            onChange={(e) => setCommentContent(e.target.value)} 
                            value={commentContent} 
                            className="comment-textarea"
                        >

                        </TextArea>
                        <Button onClick={submit} 
                            icon={<SendOutlined/>}
                            size="large"
                            type="link"
                            style={{position:'absolute',bottom:10,right:20,zIndex:2}} 
                            className="comment-button"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadComment;
