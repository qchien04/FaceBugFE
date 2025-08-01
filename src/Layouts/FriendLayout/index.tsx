import { Col, Row } from "antd";
import LeftSider from "./LeftSider";
import { Outlet } from "react-router-dom";

export default function FriendLayout() {
  return (
    <>
      <Row>
        <Col xs={0} sm={6} md={6} lg={6}>
          <div className="control-sider">
            <LeftSider /> 
          </div>
        </Col>

        <Col xs={24} sm={18} md={18} lg={18} >
          <div className="main-content">
            <Outlet />
          </div>
        </Col>
      </Row>
    </>
  );
}
