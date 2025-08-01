import { Avatar, Button, Card, Col, Divider, Input, Row } from "antd"
import {PictureOutlined} from "@ant-design/icons"
import './PostNewStatusBar.css'
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { useState } from "react"
import CreatePostModal from "../CreatePostModal"

const PostNewStatusBar=()=>{
  const {user}=useSelector((state:RootState)=>state.auth);
  const [visible, setVisible] = useState<boolean>(false);
   const [mediaArena, setMediaArena] = useState(false);
  const open1=()=>{
    setMediaArena(false);
    setVisible(true);
  }
  const open2=()=>{
    setMediaArena(true);
    setVisible(true);
  }

    return(
        <>
            <CreatePostModal 
              visible={visible} 
              setVisible={setVisible} 
              mediaArena={mediaArena} 
              setMediaArena={setMediaArena}>
            </CreatePostModal>
            
            <Card style={{ marginBottom:10,borderRadius: 10, padding: 16,maxHeight:200,boxShadow: "0 2px 8px rgba(0,0,0,0.1)"  }}>
                <Row align="middle" gutter={16}>
                  <Col>
                    <Avatar
                      src={user!.avt}
                      size={40}
                    />
                  </Col>
                  <Col flex="auto">
                    <div>
                      <Input type="primary" onClick={open1}
                          placeholder="Bạn đang nghĩ gì?"
                          readOnly 
                          style={{
                            borderRadius: 20,
                            padding: "8px 16px",
                            cursor:'pointer'
                          }}
                      />
                      
                    </div>
                    
                  </Col>
                </Row>

                <Divider style={{ margin: "12px 0" }} />

                <Row justify="space-around">
                  <Col span={24} style={{height:40}}>
                    <Button className="button_upload_post" icon={<PictureOutlined style={{ color: "green", fontSize: 24 }} />} style={{width:"100%",height:"100%",border:0}} onClick={open2}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
                          Ảnh/video
                        </div>
                      </div>
                    </Button>
                  </Col>
                </Row>
              </Card>
        </>
    )
}

export default PostNewStatusBar;