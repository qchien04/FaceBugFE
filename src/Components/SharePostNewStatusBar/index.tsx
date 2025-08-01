import {
    Avatar,
    Button,
    Col,
    Input,
    message,
    Modal,
    Row,
    Typography,
    Spin
  } from "antd";
  import { useState } from "react";
  import { ShareAltOutlined } from "@ant-design/icons";
  import { useSelector } from "react-redux";
  import { RootState } from "../../store";
  import PostService from "../../services/postService";
  import "./PostNewStatusBar.css";
  
  const { Title, Text } = Typography;
  
  interface Props {
    id: number;
  }
  
  const SharePostNewStatusBar: React.FC<Props> = ({ id }) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
  
    const { user } = useSelector((state: RootState) => state.auth);
  
    const handleOk = async () => {
      setLoading(true);
      const formShare = {
        title: title.trim(),
        type: "GROUP",
        id: id,
      };
  
      const data = await PostService.share(formShare);
  
      if (data) {
        message.success("Chia sẻ thành công");
        setVisible(false);
        setTitle("");
      } else {
        message.error("Đã xảy ra lỗi");
      }
  
      setLoading(false);
    };
  
    return (
      <>
        <Modal
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
          centered
          width={600}
          bodyStyle={{ padding: 24 }}
          title={
            <div style={{ textAlign: "center", fontSize: 22, fontWeight: 600 }}>
              Chia sẻ bài viết
            </div>
          }
        >
          <Spin spinning={loading}>
            <Row gutter={16} align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Avatar size={50} src={user?.avt} />
              </Col>
              <Col>
                <Title level={5} style={{ margin: 0 }}>
                  {user?.name}
                </Title>
                <Text type="secondary">Công khai</Text>
              </Col>
            </Row>
  
            <Input.TextArea
              placeholder="Bạn đang nghĩ gì?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoSize={{ minRows: 4, maxRows: 8 }}
              style={{
                fontSize: 16,
                borderRadius: 8,
                padding: 12,
                resize: "none",
                borderColor: "#d9d9d9",
              }}
            />
  
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <Button
                type="primary"
                onClick={handleOk}
                disabled={!title.trim() || loading}
                size="large"
              >
                Đăng bài
              </Button>
            </div>
          </Spin>
        </Modal>
  
        <Button
          icon={<ShareAltOutlined />}
          onClick={() => setVisible(true)}
          type="default"
          style={{ marginLeft: 8, marginTop:0}}
        >
          Chia sẻ
        </Button>
      </>
    );
  };
  
  export default SharePostNewStatusBar;
  