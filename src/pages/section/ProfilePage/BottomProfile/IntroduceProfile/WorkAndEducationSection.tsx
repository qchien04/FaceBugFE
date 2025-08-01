import React, { Dispatch, SetStateAction, useState } from "react";
  import { Card, Typography, Space, Button, Input, Tag } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const { Title, Text } = Typography;

interface prop{
  userId:number,
  currentJob:string,
  education:string,
  setCurrentJob:Dispatch<SetStateAction<string>>, 
  setEducation:Dispatch<SetStateAction<string>>, 
  update:() => Promise<void>,
}
const WorkAndEducationSection: React.FC<prop> = ({userId,currentJob,education,setCurrentJob,setEducation,update}) => {
  const {user}=useSelector((state:RootState)=>state.auth);
  const [editingJob, setEditingJob] = useState(false);
  const [editingEducation, setEditingEducation] = useState(false);

  return (
    <Card title="Công việc và học vấn">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={5}>Công việc hiện tại</Title>
        {editingJob ? (
          <Input
            value={currentJob}
            onChange={(e) => setCurrentJob(e.target.value)}
            onPressEnter={() => setEditingJob(false)}
          />
        ) : (
          <Text>{currentJob?currentJob:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingJob ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {setEditingJob(!editingJob);if(editingJob) update()}}
        >
          {editingJob ? "Lưu" : "Chỉnh sửa"}
        </Button>}

        {/* Học vấn */}
        <Title level={5}>Học vấn</Title>
        {editingEducation ? (
          <Input
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            onPressEnter={() => setEditingEducation(false)}
          />
        ) : (
          <Text>{education?education:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingEducation ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {setEditingEducation(!editingEducation);if(editingEducation) update()}}
        >
          {editingEducation ? "Lưu" : "Chỉnh sửa"}
        </Button>}
      </Space>
    </Card>
  );
};

export default WorkAndEducationSection;
