import { Outlet, useLocation, useParams } from "react-router-dom";
import TopCommunity from "./TopCommunity";
import CommunityService from "../../../services/communityService";
import { useEffect, useState } from "react";
import IntroduceCommunity from "./BottomCommunity/IntroduceCommunity";
import { Community, CommunityRole, Privacy } from "../../../utils/type";


const CommunityPage = () => {
  console.log("render main")
  const { communityId } = useParams<{ communityId: string }>();
  const location = useLocation();

  const communityIdnumber = communityId ? parseInt(communityId, 10):0;

  const [communityData,setCommunityData]=useState<Community|null>(null);
  const [role,setRole]=useState<CommunityRole>(CommunityRole.NONE);
  

  const getdata= async()=>{
    const community = location.state && typeof location.state === "object" && "community" in location.state
  ? location.state.community as Community
  : undefined;
    if(community){
      console.log("------------------------------8888888888--------------------------");
      console.log(community);
      console.log("------------------------------8888888888--------------------------");
      setCommunityData(community);
    }
    else{

      const data:Community=await CommunityService.get(communityIdnumber);
      console.log("--------------------------------------------------------");
      console.log(data);
      console.log("--------------------------------------------------------");
      setCommunityData(data);
    }
    
    const data22:CommunityRole=await CommunityService.checkExist(communityIdnumber);
    setRole(data22 as CommunityRole);
    
  }
  useEffect(()=>{
    getdata();
  },[communityIdnumber])

  const isPrivateAndPending = communityData && (role === CommunityRole.NONE || role === CommunityRole.PENDING) && communityData.privacy === Privacy.PRIVATE;

  return (
    <>
      <div style={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
        {communityData&&<TopCommunity community={communityData} role={role} setRole={setRole}></TopCommunity>}
        {isPrivateAndPending ?
          <IntroduceCommunity community={communityData} role={role} />
          :
          communityData&&<Outlet context={{ communityData ,role}} />
        }
      </div>
    </>
    
  );
};

export default CommunityPage;
