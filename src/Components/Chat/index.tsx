import { DeleteOutlined, MessageFilled, MessageOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Col, Dropdown, MenuProps, Row,Typography,Modal, Empty } from 'antd';
import "./Chat.css";
import { useEffect, useState } from 'react';
import chatService from '../../services/chatService';
import { useDispatch } from 'react-redux';
import { openChatBox } from '../../store/slice/chatBoxSlice';
import { ChatBoxFrame, ConversationResponse, ProfileSummary } from '../../utils/type';
import CreateGroupModal from '../CreateGroupModal';
import { useConversation } from '../../hooks/useConversation';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { deleteMessageNotify } from '../../store/slice/messageNotifySlice';
import friendshipService from '../../services/friendshipService';
const { Title, Text } = Typography;


function Conversation(){

    const {addConversation, conversations, deleteConversation}=useConversation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user}=useSelector((state:RootState)=>state.auth);
    const MessageNotifyList=useSelector((state:RootState)=>state.messageNotify);

    const [inputValue, setInputValue] = useState<string>("");
    const [isSearchFriend,setIsSearchFriend]=useState(false)
    const [searchFriendList,setsearchFriendList]=useState<ProfileSummary[]>([])
    
    const dispatch=useDispatch();

    const handleStartChat = (val:ConversationResponse) => {
        const newchatboxFrame:ChatBoxFrame={
            conversationAvt:val.avt,
            conversationId:val.id,
            conversationName:val.name,
            isGroup:val.type,
            conversationRole:val.conversationRole,
            isOpen:true,
        }
        dispatch(openChatBox(newchatboxFrame));
    };
    const showWarningModal = (conversationId: number) => {
        Modal.confirm({
            title: "Xác nhận rời phòng",
            content: "Bạn có chắc chắn muốn rời khỏi phòng chat này không?",
            okText: "Xác nhận",
            cancelText: "Hủy",
            onOk: async () => {
                deleteConversation(conversationId);
            },
            onCancel: () => {
                console.log("Hủy rời phòng");
            }
        });
    };

    const hanldeCreateGroup= async(values:string)=>{
        const conver=await chatService.createConversation({isGroup:true,name:values});
        if(typeof conver === "object" && "id" in conver){
            const v=conver as ConversationResponse;
            addConversation(v)
            handleStartChat(v);
        }
    }

    const previewMessage=(val:ConversationResponse)=>{
        if(val.lastMessage==null){
            return "Bắt đầu chat"
        }
        if(val.lastMessage.nameSend==null){
            return "Bắt đầu chat"
        }
        if(MessageNotifyList[val.id.toString()]){
            if(MessageNotifyList[val.id.toString()].senderId==user!.id){
                return "Bạn: "+MessageNotifyList[val.id.toString()].content;
            }
            const name=MessageNotifyList[val.id.toString()].nameSend?.split(" ").pop();
            return name+": "+MessageNotifyList[val.id.toString()].content;
        }
        let name="Bạn";
        if(val.lastMessage.senderId!=user!.id){
            name = val.lastMessage.nameSend!.split(" ").pop()||"";
        }
        return name+": "+val.lastMessage.content;
    }

    const CreateDotNotify=(val:ConversationResponse)=>{
        const {id}=val;
        if(MessageNotifyList[id.toString()]&& MessageNotifyList[id.toString()].state==true){
            return true;
        }
        return false;
    }

    const items: MenuProps['items'] = [];
    (conversations||[]).map((val,index)=>{
        const item={
            key: index+'',
            label: (
                <Badge offset={[-5, 0]} dot={CreateDotNotify(val)}>
                    <Row align="middle" style={{width:200}}>
                        <Col span={3}>
                            <Avatar
                                className='avt'
                                size={48}
                                src={val.avt}
                            />
                        </Col>
        
                        <Col span={17} offset={4} >
                            <Title ellipsis={{ tooltip: true }} level={5} style={{ margin: 0 }}>{val.name}</Title>
                            <Text ellipsis type="secondary">{previewMessage(val)}</Text>
                        </Col>
                    </Row>
                </Badge>   
            ),
            extra: (
                <Button 
                    type='text' 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        showWarningModal(val.id);
                    }} 
                    icon={<DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />}
                ></Button>
            ),
            onClick:()=>{
                dispatch(deleteMessageNotify(val.id))
                handleStartChat(val)
            }
        }
        items.push(item)
        
    })

    items.push({
        key: -1,
        label: <Empty style={{}} description="Không có đoạn chat nào nữa!" />,
    })


    useEffect(()=>{
        if(isSearchFriend){
            if(inputValue=='') setsearchFriendList([]);
            else (async()=>{ 
                const allfriend= await friendshipService.getAllFriendProfilesByKey(inputValue);
                setsearchFriendList(allfriend);
            })()
        }
        
    },[isSearchFriend,inputValue])
    

    const itemsSearch: MenuProps['items'] = [];
    searchFriendList.map((val,index)=>{
        const item={
            key: index+'',
            label: (
                <Row align="middle" style={{width:250,paddingTop:10}}>
                    <Col span={3}>
                        <Avatar
                            className='avt'
                            size={48}
                            src={val.avt} 
                        />
                    </Col>
    
                    <Col span={17} offset={4}>
                        <Title level={5} style={{ margin: 0 }}>{val.name}</Title>
                    </Col>
                </Row>
                
            ),

            onClick:()=>{

                const newchatboxFrame:ChatBoxFrame={
                    conversationAvt:val.avt,
                    friend:val,
                    conversationId:null,
                    conversationName:val.name,
                    isGroup:0,
                    conversationRole:"ADMIN",
                    isOpen:true,
                }
                dispatch(openChatBox(newchatboxFrame));
            }
        }
        itemsSearch.push(item)
        
    })

    return(
        <>
            <Dropdown menu={{items:isSearchFriend?itemsSearch:items}} 
                trigger={["click"]}
                dropdownRender={(menu)=>(
                    <>
                        
                        <div className='chat__dropdown'>
                            <Row >
                                <Col span={8} style={{fontSize:20,textAlign:'center',display:"flex",alignItems:'center',justifyContent:"center"}}>
                                    <MessageFilled/> <strong>Chat</strong> 
                                </Col>
                                <Col span={4} offset={9}>
                                    <div>
                                        <Button type='link' onClick={() => setIsModalOpen(true)}>Tạo nhóm</Button>
                                        <CreateGroupModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        onCreate={hanldeCreateGroup}
                                    />
                                    </div>
                                    
                                    
                                </Col>
                            </Row>
                            <Row > 
                                <Col span={24}>
                                    <div className="chat-search-bar" >
                                        <SearchOutlined className="chat-search-icon" />
                                        <input 
                                            // onBlur={()=>{setInputValue("");setIsSearchFriend(false)}} 
                                                onFocus={()=>setIsSearchFriend(true)} 
                                                onChange={(e) => setInputValue(e.target.value)} 
                                                type="text" 
                                                placeholder="Tìm kiếm" 
                                                value={inputValue}
                                                className="chat-search-input" 
                                        />
                                        {isSearchFriend?<Button type='link' onClick={()=>{setInputValue("");setIsSearchFriend(false)}}>Hủy</Button>:
                                        <></>}
                                    </div>
                                </Col>
                            </Row>
                            <div className='notify__body'>
                                {menu}
                            </div>
                        </div>
                    </>
                )}
                >
                <Badge dot={Object.values(MessageNotifyList).filter((notify) => notify.state === true).length>0?true:false}>
                    <Button type='text' 
                            onClick={()=>{setIsSearchFriend(false);setInputValue("")}} 
                            icon={<MessageOutlined style={{ fontSize: '20px', color: 'blue' }}
                    />}>

                    </Button>
                </Badge>
            </Dropdown>
        </>
    );
}

export default Conversation;