import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, Typography, Space, Button, Select, Input, List, Tag } from "antd";
import { EditOutlined, SaveOutlined, PlusOutlined, LinkOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";

const { Title, Text } = Typography;
const { Option } = Select;

export interface FamilyMember {
  role: string;
  link: string;
}

interface Props {
  userId:number,
  relationship: string;
  familyMembers: FamilyMember[];
  setRelationship: Dispatch<SetStateAction<string>>;
  setFamilyMembers: Dispatch<SetStateAction<FamilyMember[]>>;
  update:() => Promise<void>,
}

const FamilyAndRelationshipsSection: React.FC<Props> = ({
  userId,
  familyMembers,
  relationship,
  setFamilyMembers,
  setRelationship,update
}) => {
  const {user}=useSelector((state:RootState)=>state.auth);
  const [newRole, setNewRole] = useState("");
  const [newLink, setNewLink] = useState("");

  const [editingRelationship, setEditingRelationship] = useState(false);
  const [editingFamily, setEditingFamily] = useState(false);

  const handleAddFamilyMember = () => {
    if (newRole.trim()) {
      setFamilyMembers([...familyMembers, { role: newRole, link: newLink }]);
      setNewRole("");
      setNewLink("");
    }
  };

  return (
    <Card title="Gia đình và các mối quan hệ">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Title level={5}>Trạng thái mối quan hệ</Title>
        {editingRelationship ? (
          <Select value={relationship} onChange={setRelationship} style={{ width: "100%" }}>
            <Option value="Độc thân">Độc thân</Option>
            <Option value="Hẹn hò">Hẹn hò</Option>
            <Option value="Đã kết hôn">Đã kết hôn</Option>
            <Option value="Ly hôn">Ly hôn</Option>
          </Select>
        ) : (
          <Text>{relationship?relationship:<Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingRelationship ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {setEditingRelationship(!editingRelationship);if(editingRelationship) update()}}
        >
          {editingRelationship ? "Lưu" : "Chỉnh sửa"}
        </Button>}

        {/* Gia đình */}
        <Title level={5}>Gia đình</Title>
        {editingFamily ? (
          <>
            <Input
              placeholder="Nhập vai trò (ví dụ: Bố, Mẹ, Anh trai...)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <Input
              placeholder="Nhập liên kết (tùy chọn)"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              onPressEnter={handleAddFamilyMember}
            />
            {user?.id==userId&&<Button type="primary" icon={<PlusOutlined />} onClick={handleAddFamilyMember}>
              Thêm
            </Button>}
            <List
              dataSource={familyMembers}
              renderItem={(item) => (
                <List.Item>
                  <Text>{item.role}</Text>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <Button type="link" icon={<LinkOutlined />} />
                    </a>
                  )}
                </List.Item>
              )}
            />
          </>
        ) : familyMembers.length > 0 ? (
          <List
            dataSource={familyMembers}
            renderItem={(item) => (
              <List.Item>
                <Text>{item.role}</Text>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <Button type="link" icon={<LinkOutlined />} />
                  </a>
                )}
              </List.Item>
            )}
          />
        ) : (
          <Text><Tag color="cyan">Chưa cập nhật</Tag></Text>
        )}
        {user?.id==userId&&<Button
          type="link"
          icon={editingFamily ? <SaveOutlined /> : <EditOutlined />}
          onClick={() => {setEditingFamily(!editingFamily);if(editingFamily) update()}}
        >
          {editingFamily ? "Lưu" : "Chỉnh sửa"}
        </Button>}
      </Space>
    </Card>
  );
};

export default FamilyAndRelationshipsSection;
