import { Col, Image, Row, Tabs } from "antd";
import { Community, CommunityRole, Privacy } from "../../../../utils/type";
import { GlobalOutlined, LockFilled } from "@ant-design/icons";
import AvatarOverlap from "../../../../Components/AvatarList";

import "./top.css";

import OptionGroup from "./OptionGroup";
import { Link } from "react-router-dom";
import InviteCommunity from "../../../../Components/InviteCommunity";
import SharePostNewStatusBar from "../../../../Components/SharePostNewStatusBar";
import { Dispatch, SetStateAction, useState } from "react";
import ChangeCoverPhoto from "./ChangeCoverPhoto";

interface props{
    community:Community;
    role:CommunityRole,
    setRole:Dispatch<SetStateAction<CommunityRole>>,
}
const TopCommunity:React.FC<props>=({community,role,setRole})=>{
    const [previewImage, setPreviewImage] = useState<string|null>(null);


    const getTabs=()=>{
      if((role===CommunityRole.NONE||role===CommunityRole.PENDING) && community.privacy==Privacy.PRIVATE)
        return [ { label: <Link to={``} style={{fontWeight:700,fontSize:16}}>Giới thiệu</Link>, key: "1" }, ]

      if(role==CommunityRole.ADMIN){
        if(community.privacy==Privacy.PRIVATE)
          return[
            { label: <Link to={``} style={{fontWeight:700,fontSize:16}}>Thảo luận</Link>, key: "1" },
            { label: <Link to={`pin`} style={{fontWeight:700,fontSize:16}}>Đáng chú ý</Link>, key: "2" },
            { label: <Link to={`members`} style={{fontWeight:700,fontSize:16}}>Mọi người</Link>, key: "3" },
            { label: <Link to={`media`} style={{fontWeight:700,fontSize:16}}>File phương tiện</Link>, key: "4" },
            { label: <Link to={`pending`} style={{fontWeight:700,fontSize:16}}>Chờ xác nhận</Link>, key: "5" },
          ]
        else
          return[
            { label: <Link to={``} style={{fontWeight:700,fontSize:16}}>Thảo luận</Link>, key: "1" },
            { label: <Link to={`pin`} style={{fontWeight:700,fontSize:16}}>Đáng chú ý</Link>, key: "2" },
            { label: <Link to={`members`} style={{fontWeight:700,fontSize:16}}>Mọi người</Link>, key: "3" },
            { label: <Link to={`media`} style={{fontWeight:700,fontSize:16}}>File phương tiện</Link>, key: "4" },
          ]
      }
        return[
          { label: <Link to={``} style={{fontWeight:700,fontSize:16}}>Thảo luận</Link>, key: "1" },
          { label: <Link to={`pin`} style={{fontWeight:700,fontSize:16}}>Đáng chú ý</Link>, key: "2" },
          { label: <Link to={`members`} style={{fontWeight:700,fontSize:16}}>Mọi người</Link>, key: "3" },
          { label: <Link to={`media`} style={{fontWeight:700,fontSize:16}}>File phương tiện</Link>, key: "4" },
        ]
    }

    const getActiveTab = () => {
      if (location.pathname.includes("/pin")) return "2"; 
      if (location.pathname.includes("/members")) return "3"; 
      if (location.pathname.includes("/media")) return "4"; 
      if (location.pathname.includes("/pending")) return "5"; 
      return "1";
    };
    return (
      <div style={{marginTop:70,marginBottom:30,height:600,width:1536}}>
        <Row justify={"center"}>
            <Col span={17}>
              <div>
              {(previewImage||community.coverPhoto) ? (
                <Image
                  src={previewImage?previewImage:community.coverPhoto}
                  style={{ width: "100%", height: 370,borderBottomLeftRadius:20,borderBottomRightRadius:20, objectFit: "cover" }}
                  preview={false}
                />
              ) : (
                <div style={{ width: "100%", height: 370 }} />
              )}
                <ChangeCoverPhoto role={role} community={community} setPreviewImage={setPreviewImage}></ChangeCoverPhoto>
              </div>
            </Col>
          </Row>
        <Row justify={"center"}>
          <Col span={17} >
            <div className="community-info-container">
              <div className="community-info-container_left">
                <h1>
                  {community?.communityName}
                </h1>
                <p>
                  {community?.privacy==Privacy.PRIVATE?<><LockFilled/> Nhóm riêng tư</>:
                    <><GlobalOutlined/> Nhóm công khai </>}
                  - {community?.totalMembers} thành viên
                </p>
                <AvatarOverlap avatarUrls={community?.avts||[]}/>
              </div>

              <div className="community-info-container_right">
                {community&&<InviteCommunity community={community}></InviteCommunity>}
                {community&&<SharePostNewStatusBar id={community.communityId}/>}
                <OptionGroup communityId={community.communityId} role={role} setRole={setRole}></OptionGroup>
              </div>

            </div>
            
          </Col>
        </Row>

        <Row justify={"center"}>
            <Col span={17} >
              <div className="option_profile" style={{marginTop:25}}>
                  <Tabs
                    defaultActiveKey="1"
                    activeKey={getActiveTab()} 
                    items={getTabs()}
                    tabBarStyle={{ borderBottom: "none"}}
                  />
                </div>
            </Col>
          </Row>
          
      
      </div>
    )
}

export default TopCommunity;