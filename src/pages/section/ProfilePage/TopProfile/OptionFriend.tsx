import { Button, Dropdown, message } from "antd"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import friendshipService, { FriendRequestStatus } from "../../../../services/friendshipService";
import { RootState } from "../../../../store";
import { CheckOutlined, CloseOutlined, DeleteOutlined, SendOutlined, UserAddOutlined, UserOutlined } from "@ant-design/icons";
import followService, { FollowState } from "../../../../services/followService";
import { AxiosError } from "axios";
import { AccountType } from "../../../../utils/type";
interface props{
    message?:string,
    accountType:AccountType;
    userId:number
}
const OptionFriend:React.FC<props>=({userId,accountType})=>{
    
    const {user}=useSelector((state:RootState)=>state.auth);
    
    const [friendStatus,setFriendStatus]=useState<FriendRequestStatus>(FriendRequestStatus.NONE);
    const [followStatus,setFollowStatus]=useState<FollowState>(FollowState.NONE);


    const getdata= async()=>{
      if(accountType===AccountType.NORMAL){
        const frStatus=await friendshipService.checkFriendStatus(userId);
        setFriendStatus(frStatus);
      }else{
        const followStatus=await followService.checkFollow(userId);
        setFollowStatus(followStatus);
      }
    }

    const followHandle=async()=>{
      try{
        setFollowStatus(FollowState.FOLLOW)
        await followService.follow(userId);
    
      } catch (error) {
          const err = error as AxiosError<{ message: string }>;
        
          if (err.response?.data?.message) {
            message.error(err.response.data.message);
          } else {
            message.error("Đã có lỗi xảy ra.");
          }
        }
    }
    const unfollowHandle=async()=>{
      try{
        setFollowStatus(FollowState.NONE)
        await followService.unfollow(userId);
      } catch (error) {
        const err = error as AxiosError<{ message: string }>;
        
        if (err.response?.data?.message) {
          message.error(err.response.data.message);
        } else {
          message.error("Đã có lỗi xảy ra.");
        }
      }
    }
    
    useEffect(()=>{
      getdata();
    },[userId])
  
    function getButtonState(state:FriendRequestStatus) {
      if(accountType===AccountType.NORMAL){
        switch (state) {
          case FriendRequestStatus.FRIENDS:
              return(
                  <Dropdown menu={{ items:items2 }} placement="top">
                      <Button icon={<UserOutlined />}>Bạn bè!</Button>
                  </Dropdown>
                )
          case FriendRequestStatus.RECEIVED:
            return(
              <Dropdown menu={{ items }} placement="top">
                  <Button icon={<UserAddOutlined />}>Bạn có lời mời!</Button>
              </Dropdown>
            )
            
          case FriendRequestStatus.NONE:
            return <Button onClick={MakeFriendHandle} icon={<SendOutlined/>}>Kết bạn</Button>;
          default:
            return <Button onClick={removeRequestHandle} icon={<DeleteOutlined/>}>Hủy yêu cầu!</Button>;
        }
      }else{
        switch (followStatus) {
          case FollowState.FOLLOW:
            return <Button onClick={unfollowHandle} icon={<UserAddOutlined/>}>Hủy theo dõi</Button>;
          case FollowState.NONE:
            return <Button onClick={followHandle} icon={<UserAddOutlined/>}>Theo dõi</Button>;
        }
      }
    }
  
    const MakeFriendHandle=async()=>{
      const data=await friendshipService.sendRequestMakeFriend(userId);
      if(data){
        setFriendStatus(data)
      }
    }
    const removeRequestHandle=async()=>{
        const data=await friendshipService.removeRequestMakeFriend(userId);
        if(data){
          setFriendStatus(FriendRequestStatus.NONE)
        }
    }
    const refuseRequestHandle=async()=>{
        const data=await friendshipService.refuseRequestMakeFriend(userId);
        if(data){
          setFriendStatus(FriendRequestStatus.NONE)
        }
    }
    const acceptRequestHandle=async()=>{
        const data=await friendshipService.acceptRequestMakeFriend(userId);
        if(data){
          setFriendStatus(FriendRequestStatus.FRIENDS)
        }
    }
    const unFriendHandle=async()=>{
      const data=await friendshipService.unFriend(userId);
      if(data){
        setFriendStatus(FriendRequestStatus.NONE)
      }
  }
    const items = [
        { key: "1", label: <Button onClick={refuseRequestHandle} icon={<CloseOutlined/>}>Từ chối</Button> },
        { key: "2", label: <Button onClick={acceptRequestHandle} icon={<CheckOutlined/>}>Đồng ý</Button>},
    ];
    const items2 = [
        { key: "3", label: <Button onClick={unFriendHandle} icon={<DeleteOutlined/>}>Hủy kết bạn</Button> },
      ];
    return (
        <>
        {userId!=user!.id&&getButtonState(friendStatus)}
        </>    
    )
}

export default OptionFriend;