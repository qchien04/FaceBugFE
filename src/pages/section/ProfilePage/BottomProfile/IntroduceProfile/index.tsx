import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Layout,
  Menu,
  Row,
  Col,
  message
} from "antd";
import type { MenuProps } from "antd";

import OverviewSection from "./OverviewSection";
import WorkAndEducationSection from "./WorkAndEducationSection";
import PlacesLivedSection from "./PlacesLivedSection";
import ContactAndBasicInfoSection from "./ContactAndBasicInfoSection";
import FamilyAndRelationshipsSection, { FamilyMember } from "./FamilyAndRelationshipsSection";
import userService from "../../../../../services/accountInfoService";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import PageOnly from "./PageOnly";
import { AccountType, CategoryContent, Gender, Profile } from "../../../../../utils/type";

const { Sider, Content } = Layout;


const AboutProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : 0;
  const {user} = useSelector((state:RootState)=>state.auth);
  const [selectedKey, setSelectedKey] = useState("1");
  const [name,setName]= useState("");
  const [gender, setGender] = useState<Gender>(Gender.BOY);
  const [school, setSchool] = useState("");
  const [relationship, setRelationship] = useState("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [education,setEducation]= useState("");
  const [from,setFrom]= useState("");
  const [phone,setPhone]= useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [description,setDescription]= useState("");
  const [categoryContent,setCategoryContent]= useState<CategoryContent|null>(null);
  
  const fetchData = async () => {
    const data:Profile = await userService.userProfileData(userId);
    const familyMembers: FamilyMember[] = typeof data.family === "string" ? JSON.parse(data.family) : data.family;
    setSchool(data.school);
    setGender(data.gender)
    setRelationship(data.relationshipStatus)
    setFamilyMembers(familyMembers||[])
    setEducation(data.education)
    setFrom(data.comeFrom)
    setPhone(data.phoneNumber)
    setCurrentCity(data.currentCity)
    setCurrentJob(data.currentJob)
    setName(data.name)
    setDescription(data.description)
    setCategoryContent(data.categoryContent)
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = {
        id: userId,
        name:name,
        school:school,
        gender: gender,
        relationshipStatus: relationship,
        family: JSON.stringify(familyMembers),
        education:education,
        comeFrom: from,
        phoneNumber: phone,
        currentCity:currentCity,
        currentJob:currentJob,
      };

      await userService.changeUserAbout(updatedProfile);
      message.success("Cập nhật hồ sơ thành công!");
    } catch (error) {
      message.error("Cập nhật thất bại, vui lòng thử lại."+ error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    switch (selectedKey) {
      case "1":
        if(user!.accountType==AccountType.PAGE){
          return <PageOnly categoryContent={categoryContent} setCategoryContent={setCategoryContent} name={name} phoneNumber={phone} description={description} setDescription={setDescription} setName={setName} setPhoneNumber={setPhone} update={handleUpdateProfile} userId={userId}/>
        }
        return <OverviewSection userId={userId} update={handleUpdateProfile} school={school} from={from} phone={phone} setSchool={setSchool} setFrom={setFrom} setPhone={setPhone} relationship={relationship} setRelationship={setRelationship} name={name} setName={setName}/>;
      case "2":
        return <WorkAndEducationSection userId={userId} update={handleUpdateProfile} currentJob={currentJob} setCurrentJob={setCurrentJob} education={education} setEducation={setEducation}/>;
      case "3":
        return <PlacesLivedSection userId={userId} update={handleUpdateProfile} currentCity={currentCity} from={from} setCurrentCity={setCurrentCity} setFrom={setFrom} />;
      case "4":
        return <ContactAndBasicInfoSection update={handleUpdateProfile} userId={userId} gender={gender} phone={phone} setPhone={setPhone} setGender={setGender}/>;
      case "5":
        return <FamilyAndRelationshipsSection userId={userId} update={handleUpdateProfile} familyMembers={familyMembers} relationship={relationship} setFamilyMembers={setFamilyMembers} setRelationship={setRelationship}/>;
      default:
        return <OverviewSection userId={userId} update={handleUpdateProfile} school={school} from={from} phone={phone} setSchool={setSchool} setFrom={setFrom} setPhone={setPhone} relationship={relationship} setRelationship={setRelationship} name={name} setName={setName}/>;
    }
  };

  // Cấu hình items cho Menu
  const items: MenuProps["items"] = [
    { key: "1", label: "Tổng quan" },
    { key: "2", label: "Công việc và học vấn" },
    { key: "3", label: "Nơi từng sống" },
    { key: "4", label: "Thông tin liên hệ và cơ bản" },
    { key: "5", label: "Gia đình và các mối quan hệ" }
  ];

  const getItem = ()=>{
    if(user!.accountType==AccountType.PAGE){
      return [
        { key: "1", label: "Giới thiệu" },
      ]
    }
    return items;
  }

  return (
    <>
    <Row justify={"center"} style={{ width: "100%"}}>
      <Col xs={24} md={16}>
          <Row>
            <Col xs={24} md={0} style={{ marginBottom: 16 }}>
              <Menu
                mode="horizontal"
                selectedKeys={[selectedKey]}
                onClick={(e) => setSelectedKey(e.key)}
                items={getItem()}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              />
            </Col>

            {/* Hiển thị Sider trên desktop */}
            <Col xs={0} md={6}>
              <Sider theme="light">
                <Menu
                  mode="vertical"
                  selectedKeys={[selectedKey]}
                  onClick={(e) => setSelectedKey(e.key)}
                  items={getItem()}
                  style={{ border: "1px solid gray", borderRadius: 10 }}
                />
              </Sider>
            </Col>

            <Col xs={24} md={18}>
              <Content style={{ padding: "0 24px" }}>
                {renderContent()}
              </Content>
            </Col>
          </Row>  
                    
      </Col>
    </Row>

    <div style={{height:200}}></div>
    </>
  );
};

export default AboutProfile;
