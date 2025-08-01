import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, Typography, Space, Button, Input, Tag } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";

const { Text } = Typography;

interface prop{
  userId:number,
  school:string,
  from:string,
  phone:string, 
  relationship:string,
  setSchool:Dispatch<SetStateAction<string>>, 
  setFrom:Dispatch<SetStateAction<string>>, 
  setPhone:Dispatch<SetStateAction<string>>, 
  setRelationship:Dispatch<SetStateAction<string>>, 
  update:() => Promise<void>,
  name:string,
  setName:Dispatch<SetStateAction<string>>,
}
const OverviewSection: React.FC<prop> = ({userId,school,from,phone,setSchool,setFrom,setPhone,relationship,update,name,setName}) => {
  const {user}=useSelector((state:RootState)=>state.auth);
  const [editingEducation, setEditingEducation] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingFrom, setEditingFrom] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);

  const handleSaveEducation = () => {
    update();
    setEditingEducation(false);
  };

  const handleSaveName = () => {
    update();
    setEditingName(false);
  };

  const handleSaveFrom = () => {
    update();
    setEditingFrom(false);
  };

  const handleSavePhone = () => {
    update();
    setEditingPhone(false);
  };

  return (
    <Card
      title="Giới thiệu"
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Từng học tại */}
        <Text strong>Tên</Text>
        {editingName ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={handleSaveName}
          />
        ) : (
          <Text>{name?name:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingName ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => (editingName ? handleSaveName() : setEditingName(true))}
        />}
        <Text strong>Từng học tại</Text>
        {editingEducation ? (
          <Input
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            onPressEnter={handleSaveEducation}
          />
        ) : (
          <Text>{school?school:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingEducation ? <SaveOutlined /> : <EditOutlined />}
          onClick={() =>
            editingEducation ? handleSaveEducation() : setEditingEducation(true)
          }
        />}

        {/* Đến từ */}
        <Text strong>Đến từ</Text>
        {editingFrom ? (
          <Input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onPressEnter={handleSaveFrom}
          />
        ) : (
          <Text>{from?from:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingFrom ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => (editingFrom ? handleSaveFrom() : setEditingFrom(true))}
        />}

        {/* Độc thân - ví dụ chỉ hiển thị mà không chỉnh sửa */}
        <Text strong>Trạng thái mối quan hệ</Text>
        <Text>{relationship?relationship:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        {user?.id==userId&&<Button type="link" icon={<EditOutlined />} onClick={() => alert("Chức năng cập nhật tình trạng hôn nhân đang được phát triển")} />
        }
        {/* Điện thoại */}
        <Text strong>Điện thoại</Text>
        {editingPhone ? (
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onPressEnter={handleSavePhone}
          />
        ) : (
          <Text>{phone?phone:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingPhone ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => (editingPhone ? handleSavePhone() : setEditingPhone(true))}
        />}
      </Space>
    </Card>
  );
};

export default OverviewSection;
