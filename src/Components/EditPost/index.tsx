import { Avatar, Button, Col, Input, message, Modal, Row, Typography } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import PostService from "../../services/postService";
import { Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { MediaType,Post as PostDTO } from "../../utils/type";

const { Title, Text } = Typography;

interface prop{
    post:PostDTO,
    setPost:Dispatch<SetStateAction<PostDTO>>;
}

const EditPost:React.FC<prop>=({post,setPost})=>{
    const [visible,setVisible]=useState(false);
    const [loading, setLoading] = useState(false);
    const [title,setTitle]=useState<string>(post.title);

    const { user } = useSelector((state: RootState) => state.auth);
    
    const handleOk = async () => {
        setLoading(true);
        try {
            await PostService.update(post.id,title);
            const newPost:PostDTO={
                ...post,
                title:title,
            }
            setPost(newPost);
            message.success("Thành công!");
            setVisible(false); 
          } catch (error) {
            message.error("Lỗi!"+error);
          }finally {
                setLoading(false); 
        }
        };
    return (
      <>
        <Button type="link" onClick={()=>setVisible(true)} icon={<EditOutlined/>}>Chỉnh sửa</Button>
        <Modal
            title={<div style={{ textAlign: "center", width: "100%" ,fontSize:23,fontWeight:700}}>Chỉnh sửa bài viết</div>}
            open={visible}
            footer={null}
            onCancel={() => setVisible(false)}
        >  
            <div style={{ position: "relative" }}>
                {loading && (
                    <div style={{ 
                        position: "absolute", 
                        top: 0, left: 0, right: 0, bottom: 0, 
                        backgroundColor: "rgba(255, 255, 255, 0.7)", 
                        display: "flex", justifyContent: "center", alignItems: "center", 
                        zIndex: 10
                    }}>
                        <Spin size="large" />
                    </div>
                )}

                {/* Nội dung modal */}
                <div style={{ opacity: loading ? 0.5 : 1 }}>
                    <Row>
                        <Col span={3}>
                            <Avatar
                                style={{ marginLeft: 5 }}
                                size={50}  
                                src={user!.avt}
                            />
                        </Col>
                        <Col span={20}>
                            <Title ellipsis={{ tooltip: true }} level={5} style={{ margin: 0 }}>{user!.name}</Title>
                            <Text ellipsis type="secondary">Công khai</Text>
                        </Col>
                    </Row>

                    <div style={{ maxHeight: 350, overflow: 'auto' }}>
                        <Row style={{ marginTop: 10, width: "100%" }}>
                            <Col span={24}>
                                <Input.TextArea 
                                    placeholder="Bạn đang nghĩ gì?"  
                                    value={title}
                                    autoSize={{ minRows: 1, maxRows: 10000 }}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        border: "none",
                                        outline: "none", 
                                        boxShadow: "none",
                                        fontSize: 25,   
                                    }}
                                />    
                            </Col>
                        </Row>

                            <div style={{ marginTop: 10, width: "100%", position: "relative" }} className="preview-upload">
                                {post.mediaType==MediaType.IMAGE&&<img style={{ zIndex: 2, width: "100%" }} src={post.media} />}
                            </div>
                    </div>

                    <div style={{ textAlign: "center", width: "100%", marginTop: 10 }}>
                        <Button 
                            type="primary" 
                            size="large" 
                            onClick={handleOk} 
                            style={{ fontSize: 16, width: "100%" }}
                            disabled={loading}
                        >
                            Lưu
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>

      </>
    );
  };
  
export default EditPost;