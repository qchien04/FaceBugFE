import { Button, Dropdown } from "antd"
import { Dispatch, SetStateAction } from "react";
import CommunityService from "../../../../services/communityService";
import { message } from 'antd';
import { CommunityRole } from "../../../../utils/type";

interface props{
    communityId:number
    role:CommunityRole,
    setRole:Dispatch<SetStateAction<CommunityRole>>,
}
const OptionGroup:React.FC<props>=({communityId,role,setRole})=>{
        
  
    function getButtonState(state:CommunityRole) {
      if(state==CommunityRole.ADMIN||state==CommunityRole.MEMBER){
        return(
          <Dropdown menu={{ items:items2 }} placement="top">
              <Button className="ml" >Đã tham gia</Button>
          </Dropdown>
        )
      }
      if(state==CommunityRole.PENDING){
        return(
          <Dropdown menu={{ items:items3 }} placement="top">
              <Button className="ml" >Chờ xác nhân</Button>
          </Dropdown>
        )
      }

      return(
        <Button className="ml" onClick={joinCommnunityHandle}>Tham gia</Button>
      )
          
      
    }
  
    const outCommnunityHandle=async()=>{
      const data=await CommunityService.outCommunity(communityId);
      if (data){
        setRole(CommunityRole.NONE);
        message.success('Rời thành công');
      }
      else{
        message.error('Có lỗi xảy ra');
      }
    }

    const joinCommnunityHandle=async()=>{
      const data=await CommunityService.joinCommunity(communityId);
      if (data){
        setRole(data);
        message.success('Tham gia thành công');
      }
      else{
        message.error('Có lỗi xảy ra');
      }
    }
    // const items = [
    //     { key: "1", label: <Button onClick={refuseRequestHandle}>Từ chối</Button> },
    //     { key: "2", label: <Button onClick={acceptRequestHandle}>Đồng ý</Button>},
    // ];
    const items2 = [
        { key: "3", label: <Button onClick={outCommnunityHandle}>Rời nhóm</Button> },
      ];
      const items3 = [
        { key: "3", label: <Button onClick={outCommnunityHandle}>Hủy yêu cầu</Button> },
      ];
    return (
        <>
            {getButtonState(role)}
        </>    
    )
}

export default OptionGroup;