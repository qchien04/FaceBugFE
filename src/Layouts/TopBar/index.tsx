import {HomeOutlined, TeamOutlined, VideoCameraOutlined, MenuOutlined, UserSwitchOutlined} from "@ant-design/icons"

import "./TopBar.css";
import {Grid, Col, Menu, Row, Space, Drawer } from "antd";
import Notify from "../../Components/Notify";
import { Link, Outlet, useLocation } from "react-router-dom";
import Conversation from "../../Components/Chat";
import UserOption from "../../Components/UserOption";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import SearchBar from "../../Components/SearchBar";
import { AccountType } from "../../utils/type";
const { useBreakpoint } = Grid;

const TopBar: React.FC = () => {
  const location = useLocation(); 
  const screens = useBreakpoint();

  const {user}=useSelector((state:RootState)=>state.auth);

  const menuItemStyle = {
    fontSize: '16px',
    fontWeight: 500
  };

  
  const [drawerOpen, setDrawerOpen] = useState(false);


  const getItem=()=>{
    if(user?.accountType===AccountType.NORMAL){
      return [
        { key: '/', icon: <HomeOutlined />, label: <Link to="/" style={menuItemStyle}>Trang chủ</Link> },
        { key: '/watch', icon: <VideoCameraOutlined />, label: <Link to="/watch" style={menuItemStyle}>Watch</Link> },
        { key: '/community', icon: <TeamOutlined />, label: <Link to="/community" style={menuItemStyle}>Nhóm</Link> },
        { key: '/friend', icon: <UserSwitchOutlined />, label: <Link to="/friend" style={menuItemStyle}>Bạn bè</Link> },
      ];
    }
    else{
      return [
        { key: '/', icon: <HomeOutlined />, label: <Link to="/" style={menuItemStyle}>Trang chủ</Link> },
        { key: '/watch', icon: <VideoCameraOutlined />, label: <Link to="/watch" style={menuItemStyle}>Watch</Link> },
        { key: '/community', icon: <TeamOutlined />, label: <Link to="/community" style={menuItemStyle}>Nhóm</Link> },
       // { key: '/friend', icon: <UserSwitchOutlined />, label: <Link to="/friend" style={menuItemStyle}>Bạn bè</Link> },
      ];
    }
  }

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <Row className="topbar" align="middle" justify="space-between">
        <Col span={6}>
          <Space size="middle" align="center" style={{marginLeft:10}}>
            <Link to="/" className="logo">
              <span>FaceBug</span>
            </Link>
            <div className="search-wrapper">
              <SearchBar />
            </div>
          </Space>
        </Col>

        {/* Responsive Menu */}
        <Col span={12}>
          <div style={{display:"flex",justifyContent:"center",width:"100%"}}>
            {screens.lg ? (
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={getItem()}
                style={{
                  minWidth: 0,  
                  flex: 'auto',         
                  display: 'flex',      
                  justifyContent: 'center',
                  backgroundColor:"transparent",
                  borderBottom:0
                }}
              />
            ) : (
              <MenuOutlined onClick={openDrawer} className="mobile-menu-icon" />
            )}
          </div>
          
        </Col>

        <Col span={6}>
          <Space size="large" style={{marginRight:10, float:"right"}}>
            <Conversation />
            <Notify />
            <UserOption />
          </Space>
        </Col>
      </Row>

      <Drawer
        placement="left"
        closable={true}
        onClose={closeDrawer}
        open={drawerOpen}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={getItem()}
          onClick={closeDrawer}
        />
      </Drawer>

      <Outlet />
    </>
  );
};

export default TopBar;