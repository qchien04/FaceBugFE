import { FireOutlined, AppstoreOutlined } from "@ant-design/icons"
import { Menu, MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { CategoryContent } from "../../../utils/type";

interface MenuItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

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


const LeftSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItemStyle = {
    fontSize: '16px',
    fontWeight: 500
  };
  const items: MenuItem[] = [
    {
      key: 'suggested',
      label: <span style={menuItemStyle}>Đề xuất</span>,
      icon: <FireOutlined />
    },
    {
      key: 'categories',
      label: <span style={menuItemStyle}>Thể loại</span>,
      icon: <AppstoreOutlined style={{fontSize: '26px', fontWeight: 500}}/>,
      children: Object.values(CategoryContent).map(category => ({
        key: category,
        label: categoryLabels[category]
      }))
    }
  ];
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'suggested') {
      navigate('/watch');
    } else {
      navigate(`/watch?category=${key}`);
    }
  };

  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');
  const defaultSelectedKeys = currentCategory ? [currentCategory] : ['suggested'];

  return (
    <div>
      <Menu
        style={{ width: "100%", borderRight: "none",background:"#1f1f1f" }}
        className="menu"
        mode="inline"
        items={items as MenuProps['items']}
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={['categories']}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default LeftSider;