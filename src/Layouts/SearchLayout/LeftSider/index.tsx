import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

const LeftSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentSearch = location.search; // lấy query params hiện tại

  const menuItems = [
    {
      key: "user",
      label: "Mọi người",
      onClick: () => navigate({ pathname: "", search: currentSearch }),
    },
    {
      key: "community",
      label: "Nhóm",
      onClick: () => navigate({ pathname: "community", search: currentSearch }),
    },
    {
      key: "page",
      label: "Trang",
      onClick: () => navigate({ pathname: "page", search: currentSearch }),
    },
  ];
  const pathToKey = () => {
    const path = location.pathname.split("/").pop();
    console.log(path+ "nenene")
    if (!path || path === "search") return "user";
    return path;
  };
  const selectedKey = pathToKey();
  return (
    <div>
      <div>
        <h1 style={{ fontSize: 19, textAlign: "center" }}>Tìm kiếm</h1>
      </div>
      <Menu
        style={{ width: "100%", borderRight: "none",background:"#1f1f1f" }}
        selectedKeys={[selectedKey]}
        mode="inline"
        items={menuItems}
      />
    </div>
  );
};

export default LeftSider;
