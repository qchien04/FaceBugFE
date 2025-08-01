import { Card, Col, Row, Empty } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PostService from "../../../../../services/postService";
import PostModalWithMedia from "../../../../../Components/PostModalWithMedia";
import { Post } from "../../../../../utils/type";

const VideoProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const userId = id ? parseInt(id, 10) : 0;

    const [images,setImages]=useState<Post[]>([])
    const fetchImage=async()=>{
        const data=await PostService.getVideos(userId);
        setImages(data);
    }

    console.log(images);

    useEffect(() => {
        fetchImage();
    }, []);

    return (
        <Row justify={"center"} style={{ width: "100%", maxWidth: 1600}}>
            <Col span={16}>
                <Card title={"Danh sách video"}>
                    <Row justify={"center"}>
                        {images && images.length>0 ? (
                            images.map((val,index)=>(
                                <Col key={index}>
                                    <PostModalWithMedia post={val}></PostModalWithMedia>
                                </Col>
                                
                            ))
                        ) : (
                            <Empty description="Không có video" />
                        )}
                    </Row>
                    
                </Card>
            </Col>
            <div style={{ height: 500 }}>
                
            </div>
        </Row>
    );
};

export default VideoProfile;
