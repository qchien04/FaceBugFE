import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import "./sider.css";

const LeftSider: React.FC = () => {
  const navigate = useNavigate();
  const menuItemStyle = {
    fontSize: '16px',
    fontWeight: 500
  };
  const menuItems = [
    {
      key: "list",
      label: <span style={menuItemStyle}>Tất cả bạn bè</span>,
      onClick: () => navigate("list"),
    },
    {
      key: "requests",
      label: <span style={menuItemStyle}>Lời mời kết bạn</span>,
      onClick: () => navigate("requests"),
    },
    {
      key: "suggest",
      label: <span style={menuItemStyle}>Gợi ý</span>,
      onClick: () => navigate("suggest"),
    },
  ];
  const pathToKey = () => {
    const path = location.pathname.split("/").pop();
    console.log(path+ "nenene")
    if (!path || path === "friend") return "list";
    return path;
  };
  const selectedKey = pathToKey();

  return (
    <div style={{paddingTop:10}}>
      <Menu
        selectedKeys={[selectedKey]}
        style={{ width: "100%", borderRight: "none",background:"#1f1f1f" }}
        mode="inline"
        items={menuItems} // ✅ sử dụng items
      />
    </div>
  );
};

export default LeftSider;
