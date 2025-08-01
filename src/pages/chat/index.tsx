// import { useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../store";
// import chatService from "../../services/chatService";

// import SockJS from "sockjs-client";
// import Stomp from 'stompjs';
// import ChatPart from "./ChartPart";
// import { openChatBox } from "../../store/slice/chatBoxSlice";
// import { Message } from "../../utils/type";





// const Chat:React.FC =()=>{
//     const [stompClientState, setStompClientState] = useState<Stomp.Client | null>(null);
//     const [isConnect,setIsConnect]=useState<boolean>(false);

//     const [currMessageList,setCurrMessageList]=useState<Message[]|null>(null);

//     const {chatboxFrame} = useSelector((state:RootState)=>state.chatBox);
//     const {members} = useSelector((state:RootState)=>state.memberGroup);

//     const [active,setActive]=useState<boolean>(true);
//     const dispatch=useDispatch(); 
    
//     const isOpenRef = useRef<boolean>(false);
//     const isOpen = useSelector((state: RootState) => state.chatBox.isOpen);

//     useEffect(() => {
//         isOpenRef.current = isOpen;
//     }, [isOpen]);

//     useEffect(() => {
//         if (chatboxFrame?.conversationId && isConnect) {
//             (async () => {  
//                 try {
//                     if(members==null || currMessageList==null) {
//                         const [getMessageRoomChat, findmembers] = await Promise.all([
//                             chatService.getMessageRoom(chatboxFrame.conversationId),
//                             chatService.findMemberInConversation(chatboxFrame.conversationId)
//                         ]);
//                         if (findmembers.length != 0 || chatboxFrame.conversationRole != "MEMBER" || chatboxFrame.isGroup!=1){
//                             dispatch(initMember(findmembers));
//                             setCurrMessageList(getMessageRoomChat);
//                         }
//                         else{
//                             setActive(false);
//                         }
//                     }
                    
//                 } catch (error) {
//                     console.error("Lỗi khi tải tin nhắn: ", error);
//                 }
//             })();
//         }
//     }, [chatboxFrame, isConnect]);
//     useEffect(()=>{
//         if(!stompClientState) connect();
//     },[])

//     useEffect(() => {
//     if (isConnect && stompClientState?.connected && chatboxFrame?.conversationId) {
//         try {
//             const conversationId = chatboxFrame.conversationId;
        
//             const subscription = stompClientState.subscribe(
//                 `/conversation/${conversationId}`, 
//                 onMessageReceive);
            
//             return () => {
//                 console.log("unsubscribe"+conversationId)
//                 subscription.unsubscribe();
//             };
//         } catch (error) {
//             setActive(false);
//             console.error(`Lỗi khi đăng ký WebSocket với conversationId=${chatboxFrame.conversationId}:`, error);
//         }
//     }
// }, [isConnect, stompClientState, chatboxFrame]);

//     const onMessageReceive = (serverRespone: Stomp.Message) => {
//         const newMessage:Message=JSON.parse(serverRespone.body)

//         if(newMessage.conversationId==chatboxFrame?.conversationId||newMessage.senderId==0){
//             setCurrMessageList(prevMessages => [...prevMessages||[], newMessage]);
//             if(!isOpenRef.current) dispatch(openChatBox({chatboxFrame:chatboxFrame,isOpen:true}))
//         }
//     };

    
//     const connect = () => {
//         const socket = new SockJS("http://localhost:8080/sockjs");
//         const stompClient = Stomp.over(socket);
//         const token = localStorage.getItem('jwtToken');
//         stompClient.connect({
//             Authorization: `Bearer ${token}`  // 👈 gửi JWT qua header
//         }, () => {
//             setStompClientState(stompClient); 
//             setIsConnect(true);
//         }, errorCallback);
        
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             console.log("Trạng thái WebSocket:", stompClientState?.connected);
//         }, 1000); 
    
//         return () => clearInterval(interval);
//     }, [stompClientState]);

//     const errorCallback = (error: string | Stomp.Frame) => {
//         if (typeof error === 'string') {
//             console.error("Error socket: " + error);
//         } else {
//             console.error("Error frame: ", error);
//         }
//     };

//     return(
//         <>
//         {active&&members&&currMessageList?
//         <ChatPart   chatboxFrame={chatboxFrame}
//                     members={members}
//                     stompClientState={stompClientState}
//                     currMessageList={currMessageList}
//                     isConnect={isConnect}
//         ></ChatPart>:
//         <div style={{width:"100%",textAlign:"center",fontSize:20}}>
//             <p style={{marginTop:30}}>Bạn đã bị đá khỏi nhóm 😢 </p>
//         </div>
//         }
//         </>
        
//     );
// }

// export default Chat;