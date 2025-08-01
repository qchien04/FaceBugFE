import React, {useRef, memo, useEffect, useState, useCallback } from 'react';
import { Avatar, Badge, Button, Col, Form, Image, Input, Row } from 'antd';
import { CloseOutlined, PictureFilled, SendOutlined } from '@ant-design/icons';
import "./chatpart.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import moment from 'moment';
import { pushPersonalMessageNotify } from '../../store/slice/messageNotifySlice';
import { useChat } from '../../hooks/useChat';
import { ChatBoxFrame, Message, MessageType } from '../../utils/type';


type FormSend={
  content:string,
}
type MessageProps = {
  name_send:string,
  message: Message;
  userId: number;
  preMessageEmail:number|null,
  nextMessageEmail:number|null,
  nextMessageType:string|null,
  preMessageType:string|null,
  avt:string|undefined,
};

const MessageContainer = memo(({name_send, message, userId ,
                                preMessageEmail,nextMessageEmail,
                                avt,nextMessageType,preMessageType }: MessageProps) => {
  return (
    <>
    {message.messageType=="NOTICE"?
      <div className='inner-notice'>
        {message.content}
      </div>:

      <div
        className={(message.senderId === userId)||(message.senderId==0)? "inner-outgoing" : "inner-incoming"}
      >
        {message.senderId !== userId && (message.senderId!=nextMessageEmail || nextMessageType=='NOTICE')&&
        <div className="avtSmall">
          <Avatar
            size={20}
            src={avt} 
          />
        </div>}

        {message.senderId !== userId&& (message.senderId!=preMessageEmail|| preMessageType=='NOTICE') && (
          <div className="inner-name">{name_send}</div>
        )}
        {message.messageType!=='IMAGE'?
        
        <div className="inner-content" style={{ whiteSpace: 'pre-line' }}>{message.content}</div>: (
          <Image alt='Đang tải ảnh' preview={true} style={{width:110,height:70,borderRadius: 10}} src={message.content}/>
        )}
      </div>}
    </>
  
  );  
});
interface prop{
  chatBoxFrame:ChatBoxFrame,
}

const ChatPart:React.FC<prop> = ({chatBoxFrame}) => {
  
  const {user}=useSelector((state:RootState)=>state.auth);
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form] = Form.useForm();
  const dispatch=useDispatch();

  
  const handleTyping = useCallback((data: Message) => {
    const elementListTyping=chatBoxRef.current?.querySelector(".inner-list-typing");
    if(elementListTyping){
      const existTyping = elementListTyping.querySelector(`[user-id="${data.senderId}"]`);
      if(!existTyping){
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.senderId.toString());
        boxTyping.innerHTML = `
          <div class="inner-name" style="margin-left: 0px">${data.nameSend+" "} </div>
          <div class="inner-dots"><span></span><span></span><span></span></div>
        `;
        elementListTyping?.appendChild(boxTyping);
        if(chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight+100; 
        setTimeout(() => {
          const boxTypingDelete = elementListTyping.querySelector(`[user-id="${data.senderId}"]`);
          if(boxTypingDelete) {
            elementListTyping.removeChild(boxTypingDelete);
          }
        }, 3000);
      }
    }
  },[]);

  const {messages: currMessageList,sendMessage,isConnected}=useChat(
    chatBoxFrame,
    chatBoxFrame!.conversationId,
    {
      onMessage: () => {       
      },
      onTyping: handleTyping,
    }
  );

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight+100; // Cuộn xuống cuối
    }
  }, [currMessageList]); 


  const sendMessageToRoom = (values:FormSend) => {
    form.resetFields();
    const newMessage:Message = {
      senderId: user!.id,
      nameSend:user!.name,
      conversationId: chatBoxFrame!.conversationId||0,
      content: values.content || "",
      imageUrl:  previewImage || "",
      timeSend: moment().format("YYYY-MM-DDTHH:mm:ss"),
      messageType:previewImage?MessageType.IMAGE:MessageType.TEXT,
      receiveIds:chatBoxFrame.members?.map(item => item.memberId)||[],
      typing:false,
    };
    if (isConnected) {          
      sendMessage(newMessage)

      setPreviewImage(null)
      dispatch(
        pushPersonalMessageNotify(
          newMessage
        )
      )
    } else {
      console.error("WebSocket is not connected");
    }
  };

  
  const sendTyping=()=>{
    if (isConnected) {
     const newMessage:Message = {
      senderId: user!.id,
      nameSend:user!.name,
      conversationId: chatBoxFrame.conversationId||0,
      content:"",
      imageUrl:"",
      timeSend: moment().format("YYYY-MM-DDTHH:mm:ss"),
      messageType:MessageType.TEXT,
      receiveIds:chatBoxFrame.members!.map(item => item.memberId),
      typing:true,

    };
      sendMessage(newMessage)
      
    } else {
      console.error("WebSocket is not connected");
    }
  }

  const lastRequestTime = useRef(Date.now());

  function handleInput() {
      const now = Date.now();
      if (now - lastRequestTime.current > 2000) {
          lastRequestTime.current = now;
          sendTyping();
      }
  }

  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
      setPreviewImage(null);
  };

  return (
    <>
    {<div className='chatbox'>
        <Row className='message-scroll-part' ref={chatBoxRef}>
          <Col span={24} style={{background:"#242526"}}>
            <div className="innerChatbox" my-id={user?.email}>
              <div className="inner-body" >
                  {currMessageList.map((message, index) => (
                    <MessageContainer name_send={chatBoxFrame.members!.find(item => item.memberId === message.senderId)?.memberName||""} 
                    avt={chatBoxFrame!.isGroup?(chatBoxFrame.members!.find(item => item.memberId === message.senderId)?.memberAvt||chatBoxFrame!.conversationAvt)
                                              :chatBoxFrame!.conversationAvt}  
                    key={index} 
                    userId={user!.id} 
                    message={message} 
                    preMessageEmail={index>0?currMessageList[index-1].senderId:null}
                    nextMessageEmail={index<(currMessageList.length-1)?currMessageList[index+1].senderId:null}
                    nextMessageType={index<(currMessageList.length-1)?currMessageList[index+1].messageType:null}
                    preMessageType={index>0?currMessageList[index-1].messageType:null}
                    />
                  ))}
                <div className="inner-list-typing"/>
              </div>


            </div>
          </Col>


        </Row>
        {previewImage && (
            <Row align={"middle"}>
              <Col span={6} style={{margin:2,width: 50, height: 40,backgroundColor:"#242526",
                borderRadius:10,textAlign:"center",paddingTop:1}}>
                  <PictureFilled/> Ảnh đã thêm 
              </Col>
              <Col span={4} offset={1}>
                <Badge count={<Button onClick={handleDeleteImage} style={{borderRadius:"50%",width: 15, height: 15}}
                                icon={<CloseOutlined style={{width: 8, height: 8}} rotate={0} spin={false}/>}
                              />}
                >
                  <Image src={previewImage} alt="Preview" style={{borderRadius:10, width: 50, height: 50, objectFit: "cover" }} />
                </Badge>
                
              </Col>
            </Row>
          )
        }


        <Row className='form-part'>
          <Col span={24}>
            <Form form={form} onFinish={sendMessageToRoom}>
              <Row align="middle" className='form-send'>
                <Col span={3} offset={1} style={{paddingBottom:6 }}>
                  <Button type='link' icon={<PictureFilled style={{ fontSize: 20 }} />} onClick={() =>{document.getElementById("upload-image")?.click()}} />
                </Col>
                <Col span={13} offset={0}>
                  <Form.Item style={{ marginBottom: 0,paddingBottom:6 }} name="content">
                    <Input.TextArea
                      placeholder="Nhập nội dung..."
                      className="input-item"
                      onChange={handleInput}
                      autoComplete='off'
                    />
                  </Form.Item>

                  <Form.Item name="picture" style={{ display: "none" }}>
                    <Input type="file" accept="image/*" id="upload-image" onChange={handleImageChange} />
                  </Form.Item>
                </Col>
                
                <Col span={4} offset={2} style={{paddingBottom:6 }}>
                  <Button
                    htmlType="submit"
                    icon={<SendOutlined />}
                    type="primary"
                  />
                </Col>        
              </Row>
            </Form>    
          </Col>
        </Row>
    </div>
    }
    
    </>
  );
};

export default ChatPart;
