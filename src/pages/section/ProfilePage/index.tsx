import "./ProfilePage.css";
import { Outlet, useParams } from "react-router-dom";
import TopProfile from "./TopProfile";
import { useEffect, useState } from "react";
import userService from "../../../services/accountInfoService";
import { Profile } from "../../../utils/type";



const ProfilePage = () => {
  console.log("render main")
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10):0;
  const [profile,setProfile]=useState<Profile>();

  const getdata= async()=>{
    const data=await userService.userProfileData(userId);
    setProfile(data);
  }


  useEffect(() => {
    getdata();
    window.scrollTo({ top: 0, behavior: "instant" }); 
  }, [userId]); 
  return (
    <>
      {id&&profile&&<TopProfile profile={profile}/>}
      {profile&&<Outlet context={{profile}}></Outlet>}
    </>
    
  );
};

export default ProfilePage;
