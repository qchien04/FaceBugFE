import axiosClient from '../../config/axiosconfig';
import { AuthEmailForm, ChangePasswordRequest, LoginForm, RegisterForm, RegisterResponse, SigninResponse, User } from '../../utils/type';



const authService = {
  getbasicInfo: async (): Promise<User> => {
    try {
      const {data,status} = await axiosClient.get('/api/users/basicInfo');
      if(status===200){
        return data;
      }
        
      else{
        throw new Error("Can not get user information");
      }
    } catch (error) {
      console.error('Error fetching Authorities:', error);
      throw error; 
    }
  },

  changePassWord: async (form:ChangePasswordRequest): Promise<SigninResponse> => {
    try {
      const {data,status} = await axiosClient.post('/auth/changePassword',form);
      if(status===200){
        return data;
      }
        
      else{
        throw new Error("Can not get user information");
      }
    } catch (error) {
      console.error('Error fetching Authorities:', error);
      throw error; 
    }
  },

  signin: async (loginform: LoginForm): Promise<SigninResponse> => {
    try {
      const {data,status} = await axiosClient.post('/auth/signin', loginform);
      if(status===200)
        return data;
      else{
        throw new Error("Can not get login information");
      }
    } catch (error) {
      console.error('Error login: ', error);
      throw error;
    }
  },

  signingoogle: async (accessToken:string): Promise<SigninResponse> => {
    try {
      const {data} = await axiosClient.post('/google/login/user', {accessToken});
      return data;
    } catch (error) {
      console.error('Error login: ', error);
      throw error;
    }
  },

  signup: async (registerForm: RegisterForm): Promise<RegisterResponse> => {
    try {
      const {data} = await axiosClient.post('/auth/signup', registerForm);
      const res={
        ...data,
        accept:true,
      }
      if(data.message!=='not accept')
        return res;
      else{
        res.accept=false;
        return res;
      }
    } catch (error) {
      console.error('Error sign up: ', error);
      throw error;
    }
  },

  authAccount: async (authEmailForm: AuthEmailForm): Promise<SigninResponse> => {
    try {
      const {data} = await axiosClient.post('/auth/authAccount', authEmailForm);
      return data;
    } catch (error) {
      console.error('Error sign up: ', error);
      throw error;
    }
  },

  switchProfile: async (profileId: number): Promise<SigninResponse> => {
    try {
      const {data, status} = await axiosClient.post(`/auth/switchProfile/${profileId}`);
      if(status === 200) {
        return data;
      } else {
        throw new Error("Cannot switch profile");
      }
    } catch (error) {
      console.error('Error switching profile:', error);
      throw error;
    }
  },

};

export default authService;