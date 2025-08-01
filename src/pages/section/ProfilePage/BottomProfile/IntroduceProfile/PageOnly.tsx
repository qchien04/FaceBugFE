import React, { Dispatch, SetStateAction, useState } from "react";
import { Card, Typography, Space, Button, Input, Tag, Select } from "antd";
import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";
import { CategoryContent } from "../../../../../utils/type";

const { Text } = Typography;

interface PageOnlyProps {
  userId: number;
  name: string;
  phoneNumber: string;
  description: string;
  categoryContent: CategoryContent|null;
  setCategoryContent: Dispatch<SetStateAction<CategoryContent|null>>;
  setName: Dispatch<SetStateAction<string>>;
  setPhoneNumber: Dispatch<SetStateAction<string>>;
  setDescription: Dispatch<SetStateAction<string>>;
  update: () => Promise<void>;
}

const PageOnly: React.FC<PageOnlyProps> = ({
  userId,
  name,
  phoneNumber,
  description,
  categoryContent,
  setCategoryContent,
  setName,
  setPhoneNumber,
  setDescription,
  update
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [editingName, setEditingName] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingCategoryContent, setEditingCategoryContent] = useState(false);

  const handleSaveName = () => {
    update();
    setEditingName(false);
  };

  const handleSavePhone = () => {
    update();
    setEditingPhone(false);
  };

  const handleSaveDescription = () => {
    update();
    setEditingDescription(false);
  };

  const handleSaveCategoryContent = () => {
    update();
    setEditingCategoryContent(false);
  };
  const categoryLabels: Record<CategoryContent, string> = {
    [CategoryContent.COMEDY]: "Hài kịch",
    [CategoryContent.GAME]: "Game",
    [CategoryContent.VLOG]: "Vlog",
    [CategoryContent.MOVIE]: "Phim",
    [CategoryContent.MUSIC]: "Âm nhạc",
    [CategoryContent.EDUCATION]: "Giáo dục",
    [CategoryContent.LIFESTYLE]: "Lối sống",
    [CategoryContent.REVIEW]: "Đánh giá",
    [CategoryContent.REACTION]: "Reaction",
    [CategoryContent.SHORT_FILM]: "Phim ngắn",
    [CategoryContent.FOOD]: "Ẩm thực",
    [CategoryContent.TRAVEL]: "Du lịch",
    [CategoryContent.FASHION]: "Thời trang",
    [CategoryContent.BEAUTY]: "Làm đẹp",
    [CategoryContent.PET]: "Thú cưng",
    [CategoryContent.OTHER]: "Khác"
  };
  return (
    <Card title="Thông tin cá nhân">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text strong>Danh mục</Text>  
        {editingCategoryContent ? (
          <Select
            value={categoryContent}
            onChange={(value) => setCategoryContent(value)}
            options={Object.entries(categoryLabels).map(([key, label]) => ({
              value: key,
              label: label
            }))}
          />
        ) : (
          <Text>{categoryContent ? categoryLabels[categoryContent] : <Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id === userId && ( 
          <Button
            type="link"
            icon={editingCategoryContent ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => (editingCategoryContent ? handleSaveCategoryContent() : setEditingCategoryContent(true))}
          />
        )}

        {/* Tên */}
        <Text strong>Tên</Text>
        {editingName ? (
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onPressEnter={handleSaveName}
          />
        ) : (
          <Text>{name ? name : <Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id === userId && (
          <Button
            type="link"
            icon={editingName ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => (editingName ? handleSaveName() : setEditingName(true))}
          />
        )}

        {/* Số điện thoại */}
        <Text strong>Số điện thoại</Text>
        {editingPhone ? (
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onPressEnter={handleSavePhone}
          />
        ) : (
          <Text>{phoneNumber ? phoneNumber : <Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id === userId && (
          <Button
            type="link"
            icon={editingPhone ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => (editingPhone ? handleSavePhone() : setEditingPhone(true))}
          />
        )}

        {/* Mô tả */}
        <Text strong>Mô tả</Text>
        {editingDescription ? (
          <Input.TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onPressEnter={handleSaveDescription}
            rows={4}
          />
        ) : (
          <Text>{description ? description : <Tag color="cyan">Chưa cập nhật</Tag>}</Text>
        )}
        {user?.id === userId && (
          <Button
            type="link"
            icon={editingDescription ? <SaveOutlined /> : <EditOutlined />}
            onClick={() => (editingDescription ? handleSaveDescription() : setEditingDescription(true))}
          />
        )}
      </Space>
    </Card>
  );
};

export default PageOnly;
