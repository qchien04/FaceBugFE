import {
  HomeOutlined,
  TeamOutlined,
  VideoCameraOutlined,
  FlagFilled
} from '@ant-design/icons';
import { Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import CreatePageModal from '../../../Components/PageModal';

const LeftSider: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems = [
    {
      key: '0',
      label: user?.name,
      icon: <Avatar src={user?.avt} size={40} />,
      to: `/profile/${user?.id}`
    },
    {
      key: '1',
      label: 'Trang chủ',
      icon: <HomeOutlined />,
      to: '/'
    },
    {
      key: '2',
      label: 'Watch',
      icon: <VideoCameraOutlined />,
      to: '/watch'
    },
    {
      key: '3',
      label: 'Nhóm',
      icon: <TeamOutlined />,
      to: '/community'
    },
    {
      key: '5',
      label: <CreatePageModal />,
      icon: <FlagFilled />,
      to: null
    }
  ];

  return (
    <div style={{ padding: '16px'}}>
      {menuItems.map((item) => (
        <div
          key={item.key}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 8px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 500,
            transition: 'background 0.2s',
          }}
          onClick={() => {
            if (!item.to) return;
            window.location.href = item.to;
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = '#333';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.background = 'transparent';
          }}
        >
          <div style={{ fontSize: 22 }}>{item.icon}</div>
          <div>
            {typeof item.label === 'string' ? (
              item.to ? <Link to={item.to} >{item.label}</Link> : item.label
            ) : (
              item.label
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeftSider;
