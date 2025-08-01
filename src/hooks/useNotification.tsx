import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "./useWebSocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import notifyService, { NotificationResponse } from "../services/notifyService";
import { pushMessageNotify } from "../store/slice/messageNotifySlice";
import { Message } from "../utils/type";
import chatService from "../services/chatService";
import { pushConversation } from "../store/slice/conversationsSlice";


export const useNotification = () => {
  const { wsManager, isConnected } = useWebSocket();
  const { conversations }= useSelector((s: RootState) => s.conversations)
  const conversationsRef = useRef(conversations);
  const dispatch=useDispatch()
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const { user } = useSelector((s: RootState) => s.auth)

  const fetchNoitify=async()=>{
      const data=await notifyService.getMyNotifications();
      setNotifications(data);
  }

  const deleteAction=(notificationId: number)=> {
    if (notifications.length>0) {
      const newNotifications = notifications.map((notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            actions: [],
          };
        }
        return notification;
      });
      setNotifications(newNotifications);
    }
  }

  const markAllNotification = () => {
    if (notifications.length>0) {
      const newNotifications = notifications.map((notification) => {
        return {
          ...notification,
          isRead:true,
        };
      });
      setNotifications(newNotifications);
    }
  }

  const checkUnReadNoitify=()=>{
    if(notifications){
        const unRead=notifications.filter(item=>item.isRead==false);
        return unRead.length > 0;
    }
    return false;
  }

  const fetchConversationIfNotExist=async (msg:Message)=>{
    const con=conversationsRef.current?.find(conversation=> conversation.id===msg.conversationId);
    console.log('====================================================')
    conversations?.forEach(item=> console.log(item));
    console.log('+===========++')
    console.log(con)
    console.log('====================================================')
    if(!con){
      const data=await chatService.getConversation(msg.conversationId);
      dispatch(pushConversation(data));
    }
    
  }
  // subscribe to WS
  useEffect(() => {
    if (!isConnected) return;
    fetchNoitify();
    const dest = `/user/queue/notifications`;
    const unsub = wsManager.subscribe(dest, data => {
      const newNoti=data as Message;
      if(newNoti.conversationId){
        fetchConversationIfNotExist(newNoti)

        if(newNoti.senderId.toString()!=user!.id.toString())
          dispatch(pushMessageNotify(newNoti));
      } 
      else{
        const newNoti2=data as NotificationResponse;
        setNotifications((pre)=>[newNoti2,...pre])
      }
    });

    return () => unsub();
  }, [isConnected, wsManager]);

  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  return {
    notifications,
    deleteAction,
    markAllNotification,
    checkUnReadNoitify,
  };
};
