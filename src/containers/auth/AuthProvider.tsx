import { FC, ReactNode, useEffect, useState } from "react";
import { initialize } from "../../store/slice/authSlice";
import authService from "../../services/authService";
import { useDispatch } from "react-redux";
import { User } from "../../utils/type";
import { Spin } from "antd";

interface ChildrenProps {
  children: ReactNode;
}

const AuthProvider: FC<ChildrenProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);  // Thêm loading state

  useEffect(() => {
    (async () => {
      const accessToken = localStorage.getItem('jwtToken');
      if (!accessToken) {
        dispatch( 
          initialize({ isAuthenticated: false, user: null})
        )
        setLoading(false);  // Cập nhật loading khi hoàn tất
        return;
      }

      try {
        const user: User = await authService.getbasicInfo();
        console.log(user);
        dispatch( 
          initialize({ isAuthenticated: true, user })
        );
      } catch {
         dispatch(
          initialize({ isAuthenticated: false, user: null })
        );
      } finally {
        setLoading(false);  // Đảm bảo cập nhật trạng thái loading khi kết thúc
      }
    })();
  }, [dispatch]);

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return <div>
       <Spin tip="Đang tải..." spinning={true} size="large" fullscreen={true} />
  </div>;  // Hoặc một chỉ báo tải khác
  }

  return (
    <>
      {children}
    </>
  );
};

export default AuthProvider;
