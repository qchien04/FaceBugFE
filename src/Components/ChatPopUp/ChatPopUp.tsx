import './ChatPopUp.css';
import {  useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Avatar, Button, Col, Row,Typography } from 'antd';
import {closeChatBox, openChatBox, hideChatBox } from '../../store/slice/chatBoxSlice';
import { CloseOutlined, MinusOutlined } from '@ant-design/icons';
import AddMembergroupForm from '../AddMemberGroupForm';
import ChatPart from '../../pages/chat/ChartPart';
import { ChatBoxFrame } from '../../utils/type';

const { Title, Text } = Typography;
const ChatPopUp = () => {
  const {chatboxFrames}=useSelector((state:RootState)=>state.chatBox);
  console.log("ẻ")
  const dispatch=useDispatch();


  const toggleChatbox = (chatBoxFrame:ChatBoxFrame) => {
    if(chatBoxFrame.isOpen) dispatch(closeChatBox(chatBoxFrame.conversationId!))
    else{
      dispatch(openChatBox(chatBoxFrame));
    }
  };

  return (
    <div>
      {
        chatboxFrames && chatboxFrames
          .filter(frame => !frame.isOpen)
          .map(frame => (
            <Avatar
              key={frame.conversationId}
              onClick={() => toggleChatbox(frame)}
              className='open-chatbox-btn'
              size={50}
              src={frame.conversationAvt}
            />
          ))
      }


      {/* Chatbox container */}
      {chatboxFrames &&
        chatboxFrames
          .filter(frame => frame.isOpen)
          .map((frame, index) => (
            <div
              key={frame.conversationId}
              className="chatbox-container"
              style={{ right: `${index * 320 + 20}px` }} // dãn các box sang trái khi nhiều box
            >
              <Row align="middle" style={{ flex: 0 }}>
                <Col span={3} style={{ paddingLeft: 5 }}>
                  <Avatar
                    className='avt'
                    size={40}
                    src={frame.conversationAvt}
                  />
                </Col>

                <Col span={13} offset={1}>
                  <Title
                    ellipsis={{ tooltip: true }}
                    level={5}
                    style={{ margin: 0 }}
                  >
                    {frame.conversationName}
                  </Title>
                  <Text type="secondary">Đang hoạt động</Text>
                </Col>

                <Col span={2}>
                  {frame.isGroup ? <AddMembergroupForm chatBoxFrame={frame}/> : null}
                </Col>

                <Col span={2}>
                  <Button
                    type='link'
                    icon={<MinusOutlined />}
                    style={{ width: 30, zIndex: 10 }}
                    onClick={() => dispatch(hideChatBox(frame.conversationId!))}
                  />
                </Col>
                <Col span={2}>
                  <Button
                    type='link'
                    icon={<CloseOutlined />}
                    style={{ width: 30, zIndex: 10 }}
                    onClick={() => dispatch(closeChatBox(frame.conversationId!))}
                  />
                </Col>
              </Row>

              <Row className="chat-content">
                <ChatPart chatBoxFrame={frame} />
              </Row>
            </div>
          ))}
    </div>
  );
};

export default ChatPopUp;
