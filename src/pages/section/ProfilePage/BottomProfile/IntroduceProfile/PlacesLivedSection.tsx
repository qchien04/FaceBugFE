import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, Typography, Space, Button, Input, Tag } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const { Title, Text } = Typography;
interface prop{
  userId:number,
  from:string,
  currentCity:string,
  setFrom:Dispatch<SetStateAction<string>>, 
  setCurrentCity:Dispatch<SetStateAction<string>>, 
  update:() => Promise<void>,
}
const PlacesLivedSection: React.FC<prop> = ({userId,currentCity,from,setCurrentCity,setFrom,update}) => {
  const [editingHometown, setEditingHometown] = useState(false);
  const [editingCurrentLocation, setEditingCurrentLocation] = useState(false);
  const {user}=useSelector((state:RootState)=>state.auth);
  const handleSaveHometown = () => {
    update();
    setEditingHometown(false);
  };

  const handleSaveCurrentLocation = () => {
    update();
    setEditingCurrentLocation(false);
  };

  return (
    <Card title="Nơi từng sống">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={5}>Quê quán</Title>
        {editingHometown ? (
          <Input
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            onPressEnter={handleSaveHometown}
          />
        ) : (
          <Text>{from?from:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingHometown ? <SaveOutlined /> : <EditOutlined />}
          onClick={() =>
            editingHometown ? handleSaveHometown() : setEditingHometown(true)
          }
        >
          {editingHometown ? "Lưu" : "Chỉnh sửa"}
        </Button>}

        <Title level={5}>Nơi ở hiện tại</Title>
        {editingCurrentLocation ? (
          <Input
            value={currentCity}
            onChange={(e) => setCurrentCity(e.target.value)}
            onPressEnter={handleSaveCurrentLocation}
          />
        ) : (
          <Text>{currentCity?currentCity:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingCurrentLocation ? <SaveOutlined /> : <EditOutlined />}
          onClick={() =>
            editingCurrentLocation
              ? handleSaveCurrentLocation()
              : setEditingCurrentLocation(true)
          }
        >
          {editingCurrentLocation ? "Lưu" : "Chỉnh sửa"}
        </Button>}
      </Space>
    </Card>
  );
};

export default PlacesLivedSection;
