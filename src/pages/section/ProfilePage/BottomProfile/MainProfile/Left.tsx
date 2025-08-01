import { Button, Card, Col, Empty, Input, Row, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import {ReadOutlined,EnvironmentOutlined,ClockCircleOutlined, HeartOutlined, SaveOutlined, EditOutlined,} from "@ant-design/icons"
import "../../ProfilePage.css";
import "./Bottom.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import friendshipService from "../../../../../services/friendshipService";
import PostService from "../../../../../services/postService";
import userService from "../../../../../services/accountInfoService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { AccountType, Profile, ProfileSummary } from "../../../../../utils/type";
const { Text } = Typography;
interface props{
    profile:Profile,
}
const Left:React.FC<props>=({profile})=>{
    const {user}=useSelector((state:RootState)=>state.auth);
    const [friends,setFriends]= useState<ProfileSummary[]>([])
    const [images,setImages]=useState<string[]>([])
    const [description, setDescription] = useState("");
    const [userData,setUserData]=useState<Profile|null>(null);
    const [editingFrom, setEditingFrom] = useState(false);

    const handleSaveDescription=async()=>{
      setDescription(description)
      setEditingFrom(false)
      await userService.changeUserDescription(description)
    }
    const fetchFriend=async()=>{
      const data=await friendshipService.getAllFriendByUserId(profile.id);
      setFriends(data);
    }
    const fetchImage=async()=>{
      const data=await PostService.getImages(profile.id);
      setImages(data.map(item=>item.media));
    }
    
    const getdata= async()=>{
      const data:Profile=await userService.userProfileData(profile.id);
      console.log(data);
      setUserData(data);
      setDescription(data.description)
    }
    useEffect(()=>{
      fetchFriend();
      fetchImage();
      getdata();
    },[profile.id])


    return(
    <Content className="left-profile">
      <Card className="section_profile-bottom-left intro">
        <Row gutter={[0,10]} justify={"center"} align={"middle"}>   
          
        <Col span={24} style={{fontSize:20}}>
            Giới thiệu
          </Col>
          <Col span={24} style={{ textAlign: "center"}}>
            {editingFrom ? (
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onPressEnter={handleSaveDescription}
            />
          ) : (
            description?<Text>{description}</Text>:<></>
          )}
          {user?.id==profile.id&&<Col span={24} style={{fontSize:20}}>
            <Button
              type="link"
              icon={editingFrom ? <SaveOutlined /> : <EditOutlined />}
              onClick={() => (editingFrom ? handleSaveDescription() : setEditingFrom(true))}
            >
              {editingFrom ? "Lưu" :"Chỉnh sửa tiểu sử" }
            </Button>
          </Col>}
          

          </Col>
            
          {userData?.school && <Col span={24}  className="mt-1">
            <ReadOutlined style={{fontSize:20}}/> Đang học tại 
            <p style={{fontWeight:700,display:"inline"}}> {userData?.school}</p>
          </Col>}

          {userData?.relationshipStatus && <Col span={24}  className="mt-1">
            <EnvironmentOutlined style={{fontSize:20}}/> Đang sống ở 
            <p style={{fontWeight:700,display:"inline"}}> {userData?.comeFrom}</p>
          </Col>}
          {userData?.relationshipStatus && <Col span={24} className="mt-1"><HeartOutlined style={{fontSize:20}}/><p style={{fontWeight:700,display:"inline"}}> {userData?.relationshipStatus}</p></Col>}
          
          <Col span={24} className="mt-1">
            <ClockCircleOutlined style={{fontSize:20}}/> 
             {" Tham gia vào "}
            <p style={{fontWeight:700,display:"inline"}}> {userData?.createdAt?userData.createdAt.split('T')[0]:''}</p>
          </Col>  
            
          {user?.id==profile.id&&<Col span={24} className="mt-3 mb-1" style={{ textAlign: "center" }}>
            <Link to={"about"}> 
              <Button style={{width:'90%'}}>Chỉnh sửa</Button>
            </Link>
          </Col>}
        </Row>
      </Card>

      <Card className="section_profile-bottom-left picture">
        <div className="d-flex justify-content-between">
          <div style={{fontSize:23,fontWeight:500,marginLeft:10}}>Ảnh </div>
          <div style={{fontSize:23,fontWeight:500}}>
            <Link to={"photos"}> 
              <Button type="link" style={{fontSize:20,padding:10}}>Xem thêm</Button>
            </Link>
          </div>
        </div>
        <div className="picturelist">
          <Row >
            {images.length>0 ? (
              images.slice(0, 6).map((val,index)=>(
                <Col span={8} key={index}>
                  <div className="square-wrapper">
                  <img src={val}
                    style={{objectFit: 'cover',maxHeight:100,maxWidth:100,borderRadius:5}}
                    className="picture_element"
                  />
                  </div>
               
            </Col>
            ))
            ) : (
              <Empty description="Không có ảnh" />
            )}
          </Row>
        </div>
      </Card>  

      {profile.accountType==AccountType.NORMAL&&<Card className="section_profile-bottom-left friend">
        <div className="d-flex justify-content-between">
          <div style={{fontSize:20,fontWeight:500,marginLeft:10}}>Bạn bè </div>
          <div style={{fontSize:20,fontWeight:500}}>
            <Link to={"friends"}> 
              <Button type="link" style={{fontSize:15,padding:10}}>Xem tất cả bạn bè</Button>
            </Link>
          </div>
        </div>
        
        <div className="picturelist">
          <Row gutter={[10,10]}>
            {friends?.length>0 ? friends?.slice(0, 6).map((friend,index)=>(
              <Col span={8} key={index}>
                <Link to={`/profile/${friend.id}`}>
                  <div className="square-wrapper">
                    <img
                      src={friend.avt}
                      className="picture_element"
                    />
                  </div>
                  <p className="friend-name">{friend.name}</p>
                </Link>
              </Col>
            )) : <Empty description="Không có bạn bè!" />}
              
          </Row>
        </div>
      </Card>   
      }


    </Content>
    )
}

export default Left;