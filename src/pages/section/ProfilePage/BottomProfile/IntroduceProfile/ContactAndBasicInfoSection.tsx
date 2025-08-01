import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, Typography, Space, Button, Input, Select, Tag } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";
import { Gender } from "../../../../../utils/type";

const { Title, Text } = Typography;
const { Option } = Select;

interface prop{
  userId:number,
  phone:string,
  gender:Gender,
  setPhone:Dispatch<SetStateAction<string>>, 
  setGender:Dispatch<SetStateAction<Gender>>, 
  update:() => Promise<void>,
}

const ContactAndBasicInfoSection: React.FC<prop> = ({userId,phone, setPhone,gender, setGender,update}) => {
  const {user}=useSelector((state:RootState)=>state.auth);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingGender, setEditingGender] = useState(false);

  return (
    <Card title="Thông tin liên hệ và cơ bản">
      <Space direction="vertical" style={{ width: "100%" }}>
      {userId==user!.id&&<><Title level={5}>Email</Title><Text>{user!.email}</Text></>}
        <Title level={5}>Số điện thoại</Title>
        {editingPhone ? (
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onPressEnter={() => setEditingPhone(false)}
          />
        ) : (
          <Text>{phone?phone:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingPhone ? <SaveOutlined /> : <EditOutlined />}
          onClick={() =>{setEditingPhone(!editingPhone);if(editingPhone) update()}}
        >
          {editingPhone ? "Lưu" : "Chỉnh sửa"}
        </Button>}

        {/* Giới tính */}
        <Title level={5}>Giới tính</Title>
        {editingGender ? (
          <Select value={gender} onChange={setGender} style={{ width: 120 }}>
            <Option value={Gender.BOY}>Nam</Option>
            <Option value={Gender.GIRL}>Nữ</Option>
            <Option value={Gender.OTHER}>Khác</Option>
          </Select>
        ) : (
          <Text>{gender?gender:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingGender ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {setEditingGender(!editingGender);if(editingGender)update()}}
        >
          {editingGender ? "Lưu" : "Chỉnh sửa"}
        </Button>}
      </Space>
    </Card>
  );
};

export default ContactAndBasicInfoSection;
