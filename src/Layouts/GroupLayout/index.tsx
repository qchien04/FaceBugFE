import { Col, message, Row } from "antd";
import LeftSider from "./LeftSider";
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import CommunityService from "../../services/communityService";
import { useEffect } from "react";
import { Community } from "../../utils/type";

export default function GroupLayout() {
  const location = useLocation();
  const [isSideOn,setIsSideOn]= useState(false);

  const [communities,setCommunities]=useState<Community[]>([]);
  const getCommunityUser=async()=>{
    try{
      const data=await CommunityService.getUserCommunity();
      if(data){
        setCommunities(data)
        setIsSideOn(true);
      }
    }
    catch(err){
      message.error("Something went wrong"+err);
    }
  } 

  useEffect(() => {
    if(location.pathname=="/community"){
      getCommunityUser();
    }
  }, [location.pathname]);

  const getSpanSide=()=>{
    if(isSideOn){
      return 6;
    }
    return 0;
  }
  const getMainSide=()=>{
    return 24-getSpanSide();
  }

  return (
    <>
      <Row>
        <Col xs={0} sm={getSpanSide()} md={getSpanSide()} lg={getSpanSide()}>
          <div className="control-sider">
            <LeftSider communities={communities}/> 
          </div>
        </Col>

        <Col xs={24} sm={getMainSide()} md={getMainSide()} lg={getMainSide()} >
          <div className="main-content">
            <Outlet context={{communities}}/>
          </div>
        </Col>
      </Row>
    </>
  );
}
