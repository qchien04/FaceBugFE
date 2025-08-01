import { LockOutlined, LogoutOutlined, MutedFilled } from '@ant-design/icons';

import { Avatar, Badge, Button, Dropdown } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from "../../store/slice/authSlice";
import { useState } from 'react';
import ChangePasswordModal from '../ChangePasswordModal';
import { RootState } from '../../store';
import TestApi from '../../services/test';

function UserOption(){
    const {user}=useSelector((state:RootState)=>state.auth);
    const dispatch=useDispatch();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const handleLogout=()=>{
        const userConfirmed = confirm("Are you sure you want to logout?");
        if (userConfirmed) {
            localStorage.removeItem('jwtToken');
            dispatch(signOut());
        } 
    }
    const handleOpenChangePassword = () => {
        setIsModalVisible(true); // Show the change password modal
    };

    const handleCloseChangePassword = () => {
        setIsModalVisible(false); // Close the modal
    };

    const TestApiFc = () => {
        TestApi.kafka(); 
    }
    const items = [
    {
        key: '1',
        label: <Button icon={<LogoutOutlined/>} type='link'></Button>,
        extra: 'Đăng xuất',
        onClick:()=>{handleLogout()}
    },
    {
        key: '2',
        label: <Button icon={<LockOutlined/>} type='link'></Button>,
        extra: 'Đổi mật khẩu',
        onClick:()=>{handleOpenChangePassword()}
    },
    {
        key: '3',
        label: <Button icon={<MutedFilled/>} type='link'></Button>,
        extra: 'Test api',
        onClick:()=>{TestApiFc()}
    },

    ];


    return(
        <>
            <Dropdown menu={{items:items}} 
                trigger={["click"]}
                dropdownRender={(menu)=>(
                    <>
                        {menu}
                    </>
                )}
                >
                <Badge dot={false}>
                    <Avatar src={user!.avt} style={{cursor:"pointer"}}></Avatar>
                </Badge>
            </Dropdown>

            <ChangePasswordModal
                visible={isModalVisible}
                onClose={handleCloseChangePassword}
            />
        </>
    );
}

export default UserOption;