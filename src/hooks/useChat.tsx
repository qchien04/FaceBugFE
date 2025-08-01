// hooks/useChat.ts
import { useEffect, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import chatService from "../services/chatService";
import { updateChatBox,initMember } from "../store/slice/chatBoxSlice"
import { ChatBoxFrame, CreateConversationRequest, Message, MessageType } from "../utils/type";

interface Callbacks {
  onMessage?: (msg: Message) => void;
  onTyping?: (typing: Message) => void;
}

export const useChat = (
  chatBoxFrame:ChatBoxFrame,
  conversationId:number|null,
  callbacks: Callbacks = {}
) => {
  const { wsManager, isConnected } = useWebSocket();
  const [checked,setChecked]=useState<boolean>(false);
  const [conversation,setConversation]=useState<number|null>(conversationId);
  const dispatch = useDispatch();
  const [messages, setMessages] = useState<Message[]>([]);
  const { user } = useSelector((s: RootState) => s.auth);

  const checkHaveConversation=async ()=>{
    const data=await chatService.checkHaveConversation(chatBoxFrame.friend!.id);
    if(data.id!=null){
      setConversation(data.id);
      const newFrame:ChatBoxFrame={
        ...chatBoxFrame,
        conversationId:data.id,
      }
      dispatch(
        updateChatBox(newFrame)
      )
    }
    setChecked(true);
  }

  const createRoom=async()=>{
    const request:CreateConversationRequest={
      isGroup:false,
      localUserId:user!.id,
      remoteUserId:chatBoxFrame!.friend!.id,
      name:"no",
    }
    const data=await chatService.createConversation(request);
    setConversation(data.id);

    const newFrame:ChatBoxFrame={
      ...chatBoxFrame,
      conversationId:data.id,
    }

    dispatch(
      updateChatBox(newFrame)
    )

  }
  const fetchData=async ()=>{
    const [msgs, mems] = await Promise.all([
      chatService.getMessageRoom(conversation!),
      chatService.findMemberInConversation(conversation!),
    ]);
    dispatch(initMember(mems));
    setMessages(msgs);
  }

  const fetchMember=async()=>{
    const data= await chatService.findMemberInConversation(conversation!);
    dispatch(initMember(data));
  }

  // subscribe to WS
  useEffect(() => {
    //if (conversation || !isConnected) return;

    if(chatBoxFrame.friend!=null&&checked==false){
      checkHaveConversation();
    }
    if(conversation!=null){
      if (!isConnected) return;

      fetchData();
      const dest = `/conversation/${conversation}`;
      const unsub = wsManager.subscribe(dest, data => {
        // giả sử server gắn field `type: "MESSAGE"` hoặc `type: "TYPING"`
        const msg=data as Message;
        if (msg.typing === true) {
          if(msg.senderId!=user!.id) 
            callbacks.onTyping?.(msg);
        } 
        else {
          // chèn vào mảng
          if(msg.messageType==MessageType.NOTICE) fetchMember(); //reset member khi them thanh vien

          setMessages(prev => [...prev, msg]);
          callbacks.onMessage?.(msg);
        }
      });
      return () => unsub();
    }
    return ()=>console.log("en of timasdadasd");
    
  }, [conversation, isConnected, wsManager]);

  const sendMessage = (msg: Message) => {
    if((conversation==null)&&chatBoxFrame.friend!=null){ // kiem tra co phai hop chat ảo không,
      
      if(msg.typing==false) { // neeu la typing thi ko tao
        createRoom();
      }

    }
    if (conversation!=null && isConnected) {
      wsManager.send(`/app/sendMessage`, msg);
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
    setMessages, // nếu còn dùng
  };
};
