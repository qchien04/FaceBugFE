import React from "react";
import { Card, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

interface FriendRequestCardProps {
  id:number,
  name: string;
  avatar?: string;
  subtitle?: string;
  onAccept: () => void;
  onDecline: () => void;
}

const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  id,
  name,
  avatar,
  subtitle,
  onAccept,
  onDecline,
}) => {
  return (
    <Card
      hoverable
      styles={{
        body: {
          padding: 12,
          backgroundColor: "#1c1e21",
        },
      }}
      style={{
        borderRadius: 12,
        width: 200,
        height: 350,
        backgroundColor: "#1c1e21",
        color: "#fff",
      }}
      cover={
        <img
          alt={name}
          src={avatar || "https://via.placeholder.com/200x200?text=No+Avatar"}
          style={{ height: 200, objectFit: "cover", borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
      }
    >
      <Link to={`/profile/${id}`} className="profile-link">
        <Text strong style={{ color: "#fff" }}>
          {name}
        </Text>
      </Link>
     
      <br />
      {subtitle && (
        <Text type="secondary" style={{ color: "#aaa", fontSize: 12 }}>
          {subtitle}
        </Text>
      )}
      <div style={{position:"absolute", marginTop: 12, display: "flex",flexDirection:"column",width:"90%", gap: 8,bottom:10 }}>
        <Button type="primary" block onClick={onAccept}>
          Xác nhận
        </Button>
        <Button block danger onClick={onDecline}>
          Xóa
        </Button>
      </div>
    </Card>
  );
};

export default FriendRequestCard;
