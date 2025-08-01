import { Button } from 'antd';
import React, { useEffect } from 'react';
import { GoogleOutlined } from "@ant-design/icons";
import { FE_URL } from '../../../config/api';
import authService from '../../../services/authService';

import { signIn } from "../../../store/slice/authSlice";
import { useDispatch } from "react-redux";
import { User } from "../../../utils/type";



const GoogleLogin:React.FC<{accessToken:string,setAccessToken:(token:string)=>void,loading:boolean}> =({setAccessToken,loading}) => {
  const dispatch=useDispatch();
  useEffect(() => {
    const check =async ()=>{
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const act = params.get("access_token");
        if (act) {
          console.log("Access Token:", act);
          setAccessToken(act)
          // Gửi Access Token đến Backend
          const response = await authService.signingoogle(hash);
          console.log(response.jwt);
          localStorage.setItem("jwtToken",response.jwt);

          const user:User=await authService.getbasicInfo();
          console.log(user);

          dispatch(signIn({user}));
        }
      }
    }
    check();
  }, [dispatch,setAccessToken]);

  const handleLogin = () => {
    const clientId = '82696225190-hdskhqludierkcsj1r4h9cif8kb6lq2t.apps.googleusercontent.com'; 
    const redirectUri = `${FE_URL}/auth/sign-in`; 
    const scope = 'openid profile email';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=login`;

    window.location.href = authUrl;
  };

  return (
    <div>
        <div>          
          <Button
              type="primary"
              size="small"
              icon={<GoogleOutlined/>}
              onClick={handleLogin}
              style={{ width: '300px', height: '40px' }}
              disabled={loading}
              variant='filled' 
              shape='round' 
              
          >
            Đăng nhập với tài khoản Google 
          </Button>
        </div>
    </div>
  );
}

export default GoogleLogin;
