import { Action } from "redux";
import { NotificationResponse } from "../services/notifyService";

export interface APIResponse{
  message:string,
  status:boolean,
}

export interface AddMemberGroupRequest{
  friend:ProfileSummary,
  conversationId:number,
  members:number[],
}
export interface RemoveMemberGroupRequest{
  member:MemberGroupChat,
  conversationId:number,
  members:number[],
}
export interface MemberGroupChat{
  conversationId:number,
  memberId:number,
  memberName:string,
  memberAvt:string,
  memberRole:string,
}

export enum CategoryContent{
  COMEDY = "COMEDY",
  GAME = "GAME",
  VLOG = "VLOG",
  MOVIE = "MOVIE",
  MUSIC = "MUSIC",
  EDUCATION = "EDUCATION",
  LIFESTYLE = "LIFESTYLE",
  REVIEW = "REVIEW",
  REACTION = "REACTION",
  SHORT_FILM = "SHORT_FILM",
  FOOD = "FOOD",
  TRAVEL = "TRAVEL",
  FASHION = "FASHION",
  BEAUTY = "BEAUTY",
  PET = "PET",
  OTHER = "OTHER",
}

export enum MessageType{
  TEXT = "TEXT",
  IMAGE="IMAGE",
  NOTICE="NOTICE",
}

export interface ProfileSummary{
  id:number;
  name:string;
  avt:string;
  accountType?:AccountType;
}
export enum Gender {
    BOY="BOY ", 
    GIRL="GIRL",
    OTHER="OTHER",
}
export interface Profile{
    id:number;
    name:string;
    avt:string;
    coverPhoto:string;
    dateOfBirth:string;
    school:string;
    phoneNumber:string;
    comeFrom:string;
    currentJob:string,
    education:string,
    currentCity:string,
    gender:Gender,
    updatedAt:string;
    description:string;
    createdAt:string;
    relationshipStatus:string;
    family:string,
    accountType:AccountType; 
    categoryContent:CategoryContent;
}

export interface User{
    email:string;
    roles:string[];
    permissions:string[];
    name:string;
    id:number;
    avt:string;
    accountType:AccountType;
}

export interface AuthState{
    isAuthenticated?:boolean;
    isInitialized?:boolean;
    user:User|null;
}

export enum AuthActionType {
    INITIALIZE = 'INITIALIZE',
    SIGN_IN = 'SIGN_IN',
    SIGN_OUT = 'SIGN_OUT',
  }
  
export interface PayloadAction<T> extends Action<string>{
    type: AuthActionType;
    payload: T;
  }
  
  
export const initialState: AuthState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
  };
  

export type normalizeAuthType={
    type:string,
    payload:AuthState,
  }
export type ChatBoxState={
  chatboxFrames:ChatBoxFrame[]|null,
}


export type MemberGroupState={
  members:MemberGroupChat[]|null;
}

export type NotificationState={
  notifications:NotificationResponse[]|null;
}
export type ChatBoxFrame={
  conversationId:number|null,
  conversationAvt:string,
  conversationName:string,
  conversationRole?:string,
  friend?:ProfileSummary,
  members?:MemberGroupChat[]|null,
  isGroup:number,
  isOpen:boolean,
}


export enum ChatBoxActionType {
  CLOSE = 'CLOSE',
  OPEN = 'OPEN',
  CHANGE='CHANGE',
  HIDE='HIDE'
}


export enum MessageNotifyActionType {
  INIT='INIT',
  PUSH = 'PUSH',
  DELETE = 'DELETE',
}

export enum NotificationType {
  INITNOTIFICATION='INITNOTIFICATION',
  PUSHNOTIFICATION = 'PUSHNOTIFICATION',
  MARKNOTIFICATION = 'MARKNOTIFICATION',
  DELETEACTION = 'DELETEACTION',
  MARKALLNOTIFICATION = 'MARKALLNOTIFICATION',
}


export enum MemberGroupActionType {
  INITMEMBER='INITMEMBER',
  PUSHMEMBER = 'PUSHMEMBER',
  REMOVEMEMBER= 'REMOVEMEMBER',
  RESETMEMBER= 'RESETMEMBER',
}


export type WSMessageMap = {
  chat: { text: string; senderId: string };
  notification: { message: string; read: boolean };
  presence: { userId: string; online: boolean };
  // Thêm các loại message khác ở đây
};

export type Message={
  conversationId:number,
  nameSend?:string,
  imageUrl?:string,
  receiveIds?:number[],
  id?:number,
  senderId:number,
  content:string,
  timeSend:string,
  messageType:MessageType,
  typing:boolean,
  state?:boolean,
}

export type ConversationResponse={
    id:number;
    name:string;
    avt:string;
    type:number;
    lastMessage:Message;
    userSendLast:string;
    updatedAt:string;
    conversationRole:string,
  }

export type CreateConversationRequest={ 
  localUserId?:number,
  remoteUserId?:number,
  isGroup:boolean,
  name?:string,
}


export type Typing={
  name:string,
  senderId:number,
  type:string,
  conversationId:number,
}


export interface MessageNotifyResponse{
  senderName:string,
  conversationId:number,
  content:string,
  sendAt:string,
  receiveId:number,
  state?:boolean,
}
export interface MessageNotify{
  senderName:string,
  conversationId:number,
  content:string,
  sendAt:string,
  receiveId:number,
  state?:boolean,
}
export type ConversationsState={
  conversations:ConversationResponse[]|null;
}

export type CreatePageRequest={
  name:string,
  content:string,
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: any;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}
export enum Privacy {
  PUBLIC="PUBLIC",
  PRIVATE="PRIVATE",
}

export enum CommunityRole {
  ADMIN="ADMIN",
  MEMBER="MEMBER",
  NONE="NONE",
  PENDING="PENDING",
}

export interface CrCommunityForm{
  communityName:string,
  coverPhoto:string,
  privacy:Privacy,
}

export interface Community{
  communityId:number,
  communityName:string,
  communityDescription:string,
  coverPhoto:string,
  privacy:Privacy,
  totalMembers:number,
  avts:string[],
}

export interface CommunityMember{
  userId:number,
  name:string,
  avt:string,
  role:CommunityRole,
  joinAt:string,
}

export enum AccountType{
  NORMAL="NORMAL",
  PAGE="PAGE",
 }

 export enum MediaType{
  NONE="NONE",
  TEXT="TEXT",
  IMAGE='IMAGE',
  VIDEO='VIDEO',
}
export interface Post{
  id:number,
  title:string,
  media:string,
  mediaType:MediaType,
  authorId:number,
  isPinned:boolean,
  anonymous:boolean,
  authorName:string,
  authorAvatar:string,
  communityId:number,
  createdAt:string
}
export interface CommentDTO{
  id:number,
  content:string,
  postId:number,
  replyCounter:number|null,
  parent:number|null,

  authorId:number,
  authorName:string,
  authorAvatar:string,
  createdAt:string
}

export type MessageNotifyState=Record<string, Message>

export interface LoginForm{
    username:string,
    password:string
}
export interface RegisterForm{
  email:string,
  username:string,
  password:string
}

export interface AuthEmailForm{
  email:string,
  username:string,
  password:string,
  otp:string

}
export interface RegisterResponse{
  email:string,
  username:string,
  password:string,
  accept: boolean,
}
export interface SigninResponse{
    jwt:string,
    isAuth:boolean
}

  
export interface ChangePasswordRequest{
  oldPassword:string,
  newPassword:string,
 }