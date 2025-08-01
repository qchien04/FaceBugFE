import React, { useState } from 'react';
import { Card, Typography, Space, Button, Input, message } from 'antd';
import { GlobalOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import CommunityService from '../../../../../services/communityService';
import { Community, CommunityRole, Privacy } from '../../../../../utils/type';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface props {
  community: Community;
  role:CommunityRole,
}

const IntroduceCommunity: React.FC<props> = ({ community,role}) => {
  
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(
    (community.communityDescription || '').replace(/\\n/g, '\n')
  );
  console.log(description)
  console.log('Initial description:', JSON.stringify(description));
  const [tempDesc, setTempDesc] = useState(description);

  const handleSave = async() => {
    const data= await CommunityService.changeDescription(community.communityId, tempDesc)
    if (data){
      message.success('Đổi thành công');
    }
    else{
      message.error('Có lỗi xảy ra');
    }
    setDescription(tempDesc);
    setEditing(false);
  };

  return (
    <div style={{width:"100%",position:"sticky",top:"40px"}}>
    <Content style={{ paddingLeft: 10, display:"flex",justifyContent:"center"}}>
      <Card style={{padding: 20, marginTop: 0 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title level={5}>Giới thiệu</Title>
              {role==CommunityRole.ADMIN&&!editing && (
                <Button
                  icon={<EditOutlined />}
                  type="link"
                  onClick={() => {
                    setTempDesc(description);
                    setEditing(true);
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>

            {editing ? (
              <>
                <TextArea
                  rows={4}
                  value={tempDesc}
                  onChange={(e) => setTempDesc(e.target.value)}
                />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <Button type="primary" onClick={handleSave}>Lưu</Button>
                  <Button onClick={() => setEditing(false)}>Hủy</Button>
                </div>
              </>
            ) : (
              <div style={{ marginBottom: 0, whiteSpace: 'pre-line' }}>
                {description || 'Chưa có mô tả.'}
              </div>
            )}
          </div>

          <div>
            <GlobalOutlined style={{ marginRight: 8}} />
            <Text strong >{community.privacy === Privacy.PRIVATE ? "Riêng tư" : "Công khai"}</Text>
            <Paragraph style={{ marginLeft: 24 }}>
              {community.privacy === Privacy.PRIVATE
                ? "Chỉ thành viên nhóm có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."
                : "Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng."}
            </Paragraph>
          </div>

          <div>
            <EyeOutlined style={{ marginRight: 8}} />
            <Text strong >Hiển thị</Text>
            <Paragraph style={{marginLeft: 24 }}>
              Ai cũng có thể tìm thấy nhóm này.
            </Paragraph>
          </div>

          <Button type="default" block>
            Tìm hiểu thêm
          </Button>
        </Space>
      </Card>
    </Content>
    </div>
  );
};

export default IntroduceCommunity;
