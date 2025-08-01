import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

import PostService from "../../../../../services/postService";
import PostModalWithMedia from "../../../../../Components/PostModalWithMedia";
import { Community, CommunityRole,Post } from "../../../../../utils/type";
interface CommunityContext {
    communityData:Community;
    role: CommunityRole;
  }
const MediaCommunity: React.FC = () => {
    
    const { communityData } = useOutletContext<CommunityContext>();
    const [images,setImages]=useState<Post[]>([])
    const fetchImage=async()=>{
        const data=await PostService.getMediaGroup(communityData.communityId);
        console.log(data);
        setImages([...data]);
      }

    useEffect(() => {
        fetchImage();
    }, []);

    return (
        <Row justify={"center"} style={{ width: "100%", maxWidth: 1600}}>
            <Col span={16}>
                <Card title={"Danh sách ảnh"}>
                    <Row>
                        {images && (
                            images.map((val,index)=>(
                                <Col key={index}>
                                    <PostModalWithMedia post={val}/>
                                </Col>
                                
                            ))
                        )}
                    </Row>
                    
                </Card>
            </Col>
            <div style={{ height: 500 }}>
                
            </div>
        </Row>
    );
};

export default MediaCommunity;
