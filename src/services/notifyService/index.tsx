import axiosClient from '../../config/axiosconfig';
import { APIResponse } from '../../utils/type';


export enum NotificationType {
  FRIEND_REQUEST="FRIEND_REQUEST",
  POST_LIKE="POST_LIKE",
  INVITE_COMMUNITY="INVITE_COMMUNITY",
  COMMENT="COMMENT",
  VIDEO_UPLOAD="VIDEO_UPLOAD",
  SYSTEM_MESSAGE="SYSTEM_MESSAGE",
  NORMAL="NORMAL",
  MESSAGE="MESSAGE",
}

export interface NotificationAction {
  label:string,
  action:string,
  method:string,
}
export interface NotificationResponse{
  id:number,
  receiveId:number,
  type:NotificationType,
  message:string,
  link:string,
  createdAt:string,
  isRead:boolean,
  avt:string,
  isClicked:boolean,
  actions:NotificationAction[],
}

const notifyService = {
  markAllNotification: async (): Promise<APIResponse> => {
    try {
      const {data} = await axiosClient.post(`/notifications/markAll`);
      return data;
    } catch (error) {
      console.error('Error marking all notifications:', error);
      throw error;
    }
  },
  getMyNotifications: async (): Promise<NotificationResponse[]> => {
    try {
      const {data} = await axiosClient.get(`/notifications/`);
        return data;
    } catch (error) {
      console.error('Error fetching friend:', error);
      throw error; 
    }
  },




};


export default notifyService;