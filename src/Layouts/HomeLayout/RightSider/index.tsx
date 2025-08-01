// import {HomeOutlined, ShopOutlined, TeamOutlined, UserOutlined, VideoCameraOutlined} from "@ant-design/icons"

import "./RightSider.css";
import { useEffect } from "react";
import { RootState } from "../../../store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import friendshipService from "../../../services/friendshipService";
import { Avatar, Badge, Empty } from "antd";
import { AccountType, ChatBoxFrame, ProfileSummary } from "../../../utils/type";
import { openChatBox } from "../../../store/slice/chatBoxSlice";
const RightSider:React.FC=()=>{
  const {user}=useSelector((state:RootState)=>state.auth);
  const [friends, setFriends] = useState<ProfileSummary[] | null>(null);
  const [online, setOnline] = useState<number[] | null>(null);
  const dispatch=useDispatch();
  const fetchFriend = async () => {
    const data = await friendshipService.getAllFriendByUserId(user!.id);
    setFriends(data);
  };

  const handleStartChat = async(profile:ProfileSummary) => {

    const friend:ProfileSummary={
      avt:profile!.avt,
      id:profile!.id,
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
  
  const fetchOnline = async () => {
    const data = await friendshipService.getOnline(friends!.map(item=>item.id));
    setOnline(data);
  };

  useEffect(() => {
      fetchFriend();
  }, [user!.id]);

  useEffect(() => {
    if(friends){
      fetchOnline();
      const intervalId = setInterval(() => {
        fetchOnline();
      }, 2 * 60 * 1000); 

      return () => clearInterval(intervalId);
    }
  }, [friends]);

    return(
      <>
      {user!.accountType===AccountType.NORMAL?<div>
          <h3 className="sidebar-title">Người liên hệ</h3>

          {friends&&friends.length>0?friends.map((item)=>{
            return(
              <div className="friend-online" key={item.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>handleStartChat(item)}>
                <Badge
                  dot
                  status={online?.includes(item.id)?"success":"error"} 
                  offset={[-5, 40]} 
                  className="custom-badge"
                >
                  <Avatar
                    src={item.avt}
                    size={48}
                  />
                </Badge>
                <span>    {item.name}</span>
              </div>
            )
          }):<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có bạn bè" />}         
        </div>:<></>}
        </>  
    )
}

export default RightSider;