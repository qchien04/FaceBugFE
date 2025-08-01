import { Button, Spin, message } from "antd";
import { Form, Input } from "antd";
import GoogleLogin from "./GoogleLogin";

import "./Signin.css";
import authService from "../../../services/authService";
import { signIn } from "../../../store/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LoginForm, User } from "../../../utils/type";
import { useState } from "react";

const Signin: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rulesPassword = [
    {
      required: true,
      message: "Vui lòng nhập mật khẩu!",
    },
  ];
  const rulesUsername = [
    {
      required: true,
      message: "Vui lòng nhập tên đăng nhập!",
    },
  ];

  const handleSubmit = async (values: LoginForm) => {
    try {
      setLoading(true);
      localStorage.removeItem("jwtToken");
      
      const response = await authService.signin(values);
      if (!response?.jwt) {
        throw new Error("Đăng nhập thất bại");
      }

      localStorage.setItem("jwtToken", response.jwt);

      const userInfo = await authService.getbasicInfo();
      if (!userInfo) {
        throw new Error("Không thể lấy thông tin người dùng");
      }

      // Convert AuthoritiesResponse to User type
      const user: User = {
        email: userInfo.email,
        roles: userInfo.roles,
        permissions: userInfo.permissions,
        name: userInfo.name,
        id: userInfo.id,
        avt: userInfo.avt || "", // Provide default empty string if avt is undefined
        accountType:userInfo.accountType
      };

      dispatch(
        signIn({ user })
      );
      
      message.success("Đăng nhập thành công!");
      navigate("/"); // Redirect to home page after successful login
    } catch (error) {
      console.error(error);
      message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <Spin spinning={loading || accessToken.length > 0} tip="Đang xử lý đăng nhập...">
        <div>
          <h2 style={{textAlign:"center"}}>Chào mừng đến với aaaaa</h2>
          <p style={{fontSize:25,fontWeight:700,color:"red",textAlign:"center"}}>FaceBugGGG</p>
          
          <Form
            className="formlogin"
            name="login-form"
            layout="vertical"
            onFinish={handleSubmit}
            style={{ width: '400px', margin: '0 auto' }}
          >
            <Form.Item label="Tài khoản" name="username" rules={rulesUsername}>
              <Input />
            </Form.Item>

            <Form.Item label="Mật khẩu" name="password" rules={rulesPassword}>
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>
            <div>Chưa có tài khoản?</div>
            <Button type="primary" onClick={() => navigate("/auth/sign-up")}>
              Đăng kí
            </Button>
          </Form>
        </div>
      
      
        <div className="google-login" onClick={() => localStorage.removeItem("jwtToken")}>
          <GoogleLogin accessToken={accessToken} setAccessToken={setAccessToken} loading={loading}/>
        </div>
      </Spin>
    </div>
  );
};

export default Signin;
