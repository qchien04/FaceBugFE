import { Avatar, Button, Card, Col, Divider, Input, Row } from "antd"
import {PictureOutlined} from "@ant-design/icons"
import './PostNewStatusBar.css'
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserSecret } from '@fortawesome/free-solid-svg-icons';
import CreatePostModal from "../CreatePostModal"

interface props{
  communityId:number
}

const PostNewStatusBarGroup:React.FC<props>=({communityId})=>{
  const {user}=useSelector((state:RootState)=>state.auth);
  const [visible, setVisible] = useState<boolean>(false);
  const [anonymous,setAnonymous]= useState<boolean>(false);
  const [mediaArena, setMediaArena] = useState(false);

  const open=()=>{
    setMediaArena(false);
    setVisible(true);
    setAnonymous(false)
  }

  const open1=()=>{
    setMediaArena(false);
    setVisible(true);
    setAnonymous(true)
  }
  const open2=()=>{
    setMediaArena(true);
    setVisible(true);
    setAnonymous(false);
  }

    return(
        <>
            <CreatePostModal visible={visible} 
              setVisible={setVisible} 
              mediaArena={mediaArena} 
              setMediaArena={setMediaArena} 
              communityId={communityId}
              anonymous={anonymous}
            />

            <Card style={{ marginBottom:10, borderRadius: 10, padding: 16,maxHeight:200,boxShadow: "0 2px 8px rgba(0,0,0,0.1)"  }}>
                <Row align="middle" gutter={16}>
                  <Col span={3}>
                    <Avatar
                      src={user!.avt}
                      size={40}
                      style={{marginLeft:10}}
                    />
                  </Col>
                  <Col span={20} offset={1} flex="auto">
                    <Input type="primary" onClick={open}
                          placeholder="Bạn đang nghĩ gì?"
                          readOnly 
                          style={{
                            borderRadius: 20,
                            padding: "8px 16px",
                            cursor:'pointer'
                          }}
                      >
                    </Input> 
                  </Col>
                </Row>

                <Divider style={{ margin: "12px 0" }} />

                <Row justify="space-around">
                  <Col span={12}>
                    <Button className="button_upload_post" type="link" style={{width:"100%",height:"100%",border:0}} onClick={open1}>
                      <div style={{ textAlign: "center" }}>
                      <FontAwesomeIcon icon={faUserSecret} style={{ color: "red", fontSize: 24 }}/>
                        <div style={{ fontSize: 12, fontWeight: "bold", color: "#555" }}>
                          Bài viết ẩn danh
                        </div>
                      </div>
                    </Button>
                    
                  </Col>
                  <Col span={12}>
                    <Button className="button_upload_post" type="link" style={{width:"100%",height:"100%",border:0}} onClick={open2}>
                      <div style={{ textAlign: "center" }}>
                        <PictureOutlined style={{ color: "green", fontSize: 24 }} />
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

export default PostNewStatusBarGroup;