import { Col, Row } from "antd";
import LeftSider from "./LeftSider";
import { Outlet } from "react-router-dom";
import RightSider from "./RightSider";

export default function HomeLayout() {
  return (
    <>

      <Row>
        <Col xs={0} sm={6} md={6} lg={6}>
          <div className="control-sider_non-background">
            <LeftSider /> 
          </div>
        </Col>

        <Col xs={24} sm={12} md={12} lg={12} >
          <div className="main-content">
            <Outlet />
          </div>
        </Col>

        <Col xs={0} sm={6} md={6} lg={6}>
          <div className="friend-sider">
            <RightSider /> 
          </div>
        </Col>
      </Row>
    </>
    
  );
}
