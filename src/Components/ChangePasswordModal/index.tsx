import { useState } from 'react';
import { Modal, Form, Input, Button, notification } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import authService from '../../services/authService';

const ChangePasswordModal = ({ visible, onClose }: { visible: boolean, onClose: () => void }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values: { oldPassword: string, newPassword: string, confirmPassword: string }) => {
        const { oldPassword, newPassword, confirmPassword } = values;

        // Validate password fields
        if (newPassword !== confirmPassword) {
            notification.error({
                message: 'Mật khẩu nhập lại không khớp!',
                description: 'Hãy nhập lại mật khẩu mới!',
            });
            return;
        }
        if (newPassword == oldPassword) {
            notification.error({
                message: 'Mật khẩu cũ không được trùng mật khẩu mới!',
                description: 'Nhập mật khẩu khác',
            });
            return;
        }
        

        setLoading(true);

        
        try {
            authService.changePassWord({newPassword:newPassword,oldPassword:oldPassword})
            
            notification.success({
                message: 'Đổi mật khẩu thành công',
            });

            form.resetFields();
            onClose(); 
        } catch (error) {
            notification.error({
                message: 'Lỗi đổi mật khẩu'+ error,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Đổi mật khẩu"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={400}
        >
            <Form
                form={form}
                name="change-password"
                onFinish={handleSubmit}
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
                layout="vertical"
            >
                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Nhập mật khẩu cũ' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu cũ"
                    />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Nhập mật khẩu mới' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Mật khẩu mới"
                    />
                </Form.Item>

                <Form.Item
                    label="Nhập lại mật khẩu mới"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Nhập lại mật khẩu mới!' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="Nhập lại mật khẩu mới"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;
