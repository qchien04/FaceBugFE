import React, { useEffect, useState } from "react";

import { Row, Col, Typography, message, Empty, Divider } from "antd";
import FriendRequestCard from "../../../../Components/FriendRequestCard";
import friendshipService from "../../../../services/friendshipService";
import { ProfileSummary } from "../../../../utils/type";

const { Title } = Typography;


const FriendRequestsPage: React.FC = () => {
  const [friends, setFriends] = useState<ProfileSummary[]>([]);
  
  const fetchFriend = async () => {
      const data = await friendshipService.getRequest();
      setFriends(data);
  };
  
  const updateView=(id:number)=>{
    const newList=friends.filter(item=>item.id!=id)
    setFriends(newList);
  }

  const refuseRequestHandle=async(userId:number)=>{
    const data=await friendshipService.refuseRequestMakeFriend(userId);
    if(data){
      updateView(userId)
    }
    else{
      message.error("Có lỗi xảy ra!")
    }
}
const acceptRequestHandle=async(userId:number)=>{
    const data=await friendshipService.acceptRequestMakeFriend(userId);
    if(data){
      message.success("Kết bạn thành công!")
      updateView(userId)
    }
    else{
      message.error("Có lỗi xảy ra!")
    }
}

  useEffect(() => {
      fetchFriend();
  }, []);


  return (
    <div style={{ padding: 24, minHeight: "100vh" ,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={3} style={{ color: "#fff" }}>Lời mời kết bạn</Title>
      </div>

      <Divider></Divider>
      {friends.length>0?<Row gutter={[16, 16]} style={{width:"100%"}}>
        {friends.map((request) => (
          <Col span={6} key={request.id}>
            <FriendRequestCard
              id={request.id}
              name={request.name}
              avatar={request.avt}
              subtitle={""}
              onAccept={() => acceptRequestHandle(request.id)}
              onDecline={() => refuseRequestHandle(request.id)}
            />
          </Col>
        ))}
      </Row>:
      <Empty description={"Bạn không có lời mời kết bạn nào"}/>}
    </div>
  );
};

export default FriendRequestsPage;
