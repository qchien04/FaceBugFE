import { Avatar, Button, Col, Image, Modal, Row, Typography } from "antd";
import PostService from "../../services/postService";
import { CloseOutlined, CommentOutlined } from "@ant-design/icons";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getTimeAgo } from "../../utils/request";
import Like from "../Like";
import Comment from "../Comment";
const { Title, Text } = Typography;

import "./Postmodal.css";
import UploadComment from "./UploadComment";
import VideoPlayerHLS from "../VideoPlayerHLS";
import { CommentDTO,MediaType,Post as PostDTO } from "../../utils/type";

interface prop{
    commentId?:number|null,
    post:PostDTO,
    isModalOpen:boolean,
    setIsModalOpen:React.Dispatch<React.SetStateAction<boolean>>,
}
const PostModal=React.memo(({post,isModalOpen, setIsModalOpen,commentId}:prop)=>{
    const [comments,setComment]=useState<CommentDTO[]|null>(null);

    const commentRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});


    const fetchComment=async()=>{
        const data=await PostService.getComment(post.id);
        setComment(data);
    }
    const addComment=async(newComment:CommentDTO)=>{
        const data=await PostService.addComment(newComment);
        
        if(comments){
            setComment([data,...comments]);
        }
        else setComment([data]);
    }

    useEffect(() => {
        if (isModalOpen && comments == null) {
            fetchComment();
        }
    }, [isModalOpen]);

    //load more commnet
    const loader = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
            if (entries[0].isIntersecting) {
                console.log("Đã cuộn đến cuối, tải thêm bình luận...");
                //setComment((prev) => [...prev!, ...prev!]);
            }
            },
            { threshold: 1 }
        );
    
        if (loader.current) observer.observe(loader.current);
    
        return () => observer.disconnect();
    }, [comments]);

    //keo xuong comment dang tra loi
    useEffect(() => {
        if (commentId){
            const commentElement = commentRefs.current[commentId];
            if (commentElement) {
                commentElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
        
    }, [comments]);
    

    return(
        <>
            <Modal
                open={isModalOpen}
                footer={null}
                closable={false}
                onCancel={() => setIsModalOpen(false)}
                style={{padding:0}}
                className="post-modal"
                centered={true}
            >
                {/* nut x */}
                <Row justify={"center"} style={{marginBottom:8}}>
                    <Col style={{fontSize:23,fontWeight:700,padding:5}}>Bài viết của {!post.anonymous?post.authorName:"Người dùng ẩn danh"}</Col>
                    <div style={{position:"absolute",top:10,right:10}}>
                        <Button icon={<CloseOutlined/>} onClick={()=>setIsModalOpen(false)} shape="circle"/>
                    </div>
                </Row>

                <div style={{display:'flex',flexDirection:"column",maxHeight:600}}>    
                    {/* phan tren */}
                    <div className="top-modal-post"  style={{height:550,overflowY:"auto",padding:10,borderTop: "1px solid rgb(164, 158, 158)",}}>
                        <Row align="middle" gutter={[16, 16]}>
                            <Col>
                                <Link to={!post.anonymous?`/profile/${post.authorId}`:"#"}>
                                <Avatar size={48} src={!post.anonymous?post.authorAvatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7BUrdRYjK--KE51atND6fsf2PBqIPM0-byw&s"} />
                                </Link>
                            </Col>
                            <Col>
                                <Link to={!post.anonymous?`/profile/${post.authorId}`:"#"} className="profile-link">
                                <Title level={5} style={{ margin: 0 }}>
                                    {!post.anonymous?post.authorName:"Người dùng ẩn danh"}
                                </Title>
                                </Link>
                                <Text type="secondary">{getTimeAgo(post.createdAt)}</Text>
                            </Col>
                        </Row>

                        {/* Nội dung bài đăng */}
                        <Row style={{ marginTop: "16px" }}>
                            <Col span={24}>
                            <Text>
                                {post.title}
                            </Text>
                            </Col>
                        </Row>

                        {post.mediaType===MediaType.IMAGE&&<Row style={{ width: "100%", marginTop: "16px" }}>
                            <Col span={24}>
                            <Image
                                className="full-width-image"
                                src={post.media}
                                style={{
                                width: "100%",
                                height: "auto", 
                                maxHeight: "500px",
                                objectFit: "contain",
                                }}
                                preview={true}
                            />
                            </Col>
                        </Row>}

                        {post.mediaType===MediaType.VIDEO&&<Row style={{ width: "100%", marginTop: "16px" }}>
                            <Col span={24}>
                            <VideoPlayerHLS src={post.media}></VideoPlayerHLS>
                            </Col>
                        </Row>}        

                        {/* Phần Thích và Bình luận */}
                        <Row
                            justify="space-between"
                            align="middle"
                            style={{
                            marginTop: "16px",
                            borderTop: "1px solid rgb(164, 158, 158)",
                            paddingTop: "8px",
                            }}
                        >
                            <Col span={8} offset={3}>
                                <Like postId={post.id}/>
                            </Col>  
                            <Col span={8} offset={3}>
                            <Button type="text" icon={<CommentOutlined />}>
                                Bình luận
                            </Button>
                            </Col>                      
                        </Row>
                        <div className="comment-arena">
                            {(comments||[]).map((val,index)=>(
                                <div key={index}  
                                ref={(el) => { commentRefs.current[val.id] = el || null; }}
                                >
                                    <Comment comment={val} level={1}></Comment>
                                </div>
                                
                            ))}
                        </div>
                        <div ref={loader} style={{ height: "20px", background: "lightgray" }}>Loading...</div>
                    </div>


                    {/* Binh luan ca nhannhan */}
                    <UploadComment postId={post.id} addComment={addComment}></UploadComment>
                </div>
            </Modal>
            
        </>
    )
})
export default PostModal;