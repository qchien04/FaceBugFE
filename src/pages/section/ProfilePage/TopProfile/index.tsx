import { Avatar, Button, Col, Image, Row, Tabs } from "antd";
import { useEffect, useState } from "react";

import OptionFriend from "./OptionFriend";
import { Link, useLocation } from "react-router-dom";
import ChangeCoverPhoto from "./ChangeCoverPhoto";
import ChangeAvt from "./ChangeAvt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { openChatBox } from "../../../../store/slice/chatBoxSlice";
import { AccountType, ChatBoxFrame, Profile, ProfileSummary } from "../../../../utils/type";
import { MessageOutlined } from "@ant-design/icons";

import "./TopProfile.css";


interface props{
  profile:Profile;
}
const TopProfile:React.FC<props>=({profile})=>{
    console.log("render top")
    const {user}=useSelector((state:RootState)=>state.auth);
    const location = useLocation();
    const dispatch=useDispatch();
    const [previewImage, setPreviewImage] = useState<string|null>(null);
    const [avt, setAvt] = useState<string>(profile.avt);
    useEffect(() => {
      setAvt(profile.avt);
      setPreviewImage(profile.coverPhoto);
    }, [profile]);

    const handleStartChat = async() => {
      const friend:ProfileSummary={
        avt:profile.avt,
        id:profile.id,
        name:profile.name,  
      }
      const newchatboxFrame:ChatBoxFrame={
          conversationAvt:profile.avt,
          friend:friend,
          conversationId:null,
          conversationName:profile.name,
          isGroup:0,
          conversationRole:"ADMIN",
          isOpen:true,
      }
      dispatch(openChatBox(newchatboxFrame));
    };

    const getActiveTab = () => {
      if (location.pathname.includes("/friends")) return "3"; 
      if (location.pathname.includes("/about")) return "2"; 
      if (location.pathname.includes("/photos")) return "4"; 
      if (location.pathname.includes("/videos")) return "5"; 
      return "1";
    };

    const getItemTab=()=>{
      if(profile.accountType===AccountType.NORMAL){
      return[
        { label: <Link to={``} style={{fontWeight:700,fontSize:16}}>Bài viết</Link>, key: "1" },
        { label: <Link to={`about`} style={{fontWeight:700,fontSize:16}}>Giới thiệu</Link>, key: "2" },
        { label: <Link to={`friends`} style={{fontWeight:700,fontSize:16}}>Bạn bè</Link>, key: "3" },
        { label: <Link to={`photos`} style={{fontWeight:700,fontSize:16}}>Ảnh</Link>, key: "4" },
        { label: <Link to={`videos`} style={{fontWeight:700,fontSize:16}}>Video</Link>, key: "5" },
      ]
      }
      else{
        return[
          { label: <Link to={``} style={{fontWeight:700,fontSize:16}}>Bài viết</Link>, key: "1" },
          { label: <Link to={`about`} style={{fontWeight:700,fontSize:16}}>Giới thiệu</Link>, key: "2" },
          { label: <Link to={`photos`} style={{fontWeight:700,fontSize:16}}>Ảnh</Link>, key: "4" },
          { label: <Link to={`videos`} style={{fontWeight:700,fontSize:16}}>Video</Link>, key: "5" },
        ]
      }
    }
    return (
      <div>
          <Row justify={"center"}>
            <Col xs={24} sm={18} md={18} lg={18}>
              <div style={{background:"#343536"}}>
              {(previewImage||profile?.coverPhoto) ? (
                <Image
                  src={previewImage?previewImage:profile.coverPhoto}
                  style={{ width: "100%", height: 370, objectFit: "cover" }}
                  preview={false}
                />
              ) : (
                <div style={{ width: "100%", height: 370 }} />
              )}
                {user!.id==profile.id&&<ChangeCoverPhoto setPreviewImage={setPreviewImage}></ChangeCoverPhoto>}
              </div>
            </Col>
          </Row>

          {/* ten avt  */}
          <Row justify={"center"}>
            <Col xs={24} md={16} className="xxxx">
              <Row justify="start" className="responsive-row">
                <Col xs={24} 
                  md={12}
                  lg={12}       
                  className="responsive-col"
                >
                  <div style={{height:100,display:"flex",justifyContent:"center"}}>
                    <div style={{position:"absolute",top:-40,width:"100%"}}>
                      <Row gutter={[0,0]}>
                        <Col xs={24} md={7}>
                          <div className="avt-container"> 
                            <Avatar
                              size={130}  
                              src={avt}
                            />
                            {user!.id==profile.id&&<ChangeAvt avt={avt} setAvt={setAvt}></ChangeAvt>}
                          </div>
                        </Col>

                        <Col xs={24} md={14} style={{alignItems:"center",alignContent:"center"}}>
                          <p style={{display:"inline-block",
                              fontSize:22,fontWeight:700,padding:0,
                              margin:0,
                              }}>{profile.name}
                            </p>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>

                <Col span={12} style={{justifyContent:"center"}}>
                  <div className="option-friend">
                    <OptionFriend userId={profile.id} accountType={profile.accountType}></OptionFriend>
                    {user!.id!=profile.id&&<Button onClick={handleStartChat} icon={<MessageOutlined />}>Nhắn tin</Button>}
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          

          {/* controll */}
          <Row justify={"center"} style={{marginTop:30}}>
            <Col span={16} >
              <div className="option_profile">
                  <Tabs
                    defaultActiveKey="1"
                    activeKey={getActiveTab()} 
                    items={getItemTab()}
                    tabBarStyle={{ borderBottom: "none" }}
                  />
                </div>
            </Col>
          </Row>  
      
      </div>
    )
}

export default TopProfile;