import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Menu, Row, Col, Avatar, Typography, App, Select } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import userService from '../../services/accountInfoService';
import authService from '../../services/authService';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { User, CategoryContent, ProfileSummary, AuthState } from '../../utils/type';
import { signIn } from '../../store/slice/authSlice';
const { Text } = Typography;

const CreatePageModal = () => {
    const { message } = App.useApp();
    const [visible,setVisible]= useState(false);
    const [loading, setLoading] = useState(false);
    const [switchingProfile, setSwitchingProfile] = useState<number | null>(null);

    const [profiles,setProfiles]=useState<ProfileSummary[]|null>(null)

    const [form] = Form.useForm();
    const dispatch=useDispatch();

    const navigate=useNavigate();

    const {user}=useSelector((state:RootState)=>state.auth);
    console.log(user);


    const fetchProfile=async()=>{
        const data=await userService.userProfilesData();
        setProfiles(data);
    }

    useEffect(()=>{
        fetchProfile();
    },[])


    const onClose=()=>{
        setVisible(false);
    }
    const handleSubmit = async (values: { name: string, content: string}) => {
        const { name, content } = values;
        setLoading(true);
        
        try {
            await userService.createPage({name:name,content:content});
            message.success('Tạo trang thành công!');
            onClose();
            
        } catch (error) {
            message.error('Có lỗi xảy ra khi tạo trang'+error);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = async (profileDTO: ProfileSummary) => {
        try {
            setSwitchingProfile(profileDTO.id);
            const response = await authService.switchProfile(profileDTO.id);
            
            // Update JWT token
            localStorage.setItem('jwtToken', response.jwt);
            
            // Update auth state
            const userInfo = await authService.getbasicInfo();
            const userData: User = {
                email: userInfo.email,
                roles: userInfo.roles,
                permissions: userInfo.permissions,
                name: userInfo.name,
                id: userInfo.id,
                avt: profileDTO.avt || '',
                accountType: userInfo.accountType
            };
            const st:AuthState={
                user:userData,
                isAuthenticated:true,
            }
            dispatch(signIn(st));
            
            message.success('Đổi profile thành công!');
            navigate('/'); // Redirect to home page
            onClose();
        } catch (error) {
            message.error('Có lỗi xảy ra khi đổi profile');
            console.error('Error switching profile:', error);
        } finally {
            setSwitchingProfile(null);
        }
    };

    const categoryLabels: Record<CategoryContent, string> = {
        [CategoryContent.COMEDY]: "Hài kịch",
        [CategoryContent.GAME]: "Game",
        [CategoryContent.VLOG]: "Vlog",
        [CategoryContent.MOVIE]: "Phim",
        [CategoryContent.MUSIC]: "Âm nhạc",
        [CategoryContent.EDUCATION]: "Giáo dục",
        [CategoryContent.LIFESTYLE]: "Lối sống",
        [CategoryContent.REVIEW]: "Đánh giá",
        [CategoryContent.REACTION]: "Reaction",
        [CategoryContent.SHORT_FILM]: "Phim ngắn",
        [CategoryContent.FOOD]: "Ẩm thực",
        [CategoryContent.TRAVEL]: "Du lịch",
        [CategoryContent.FASHION]: "Thời trang",
        [CategoryContent.BEAUTY]: "Làm đẹp",
        [CategoryContent.PET]: "Thú cưng",
        [CategoryContent.OTHER]: "Khác"
    };
    return (
        <>
            <Button onClick={() => { setVisible(true) }} type="primary">
                Quản lý trang
            </Button>
            <Modal
                title="Quản lý trang"
                open={visible}
                onCancel={onClose}
                footer={null}
                width={800}
            >
                <Row gutter={24}>
                    <Col span={12}>
                        <div>
                            <Typography.Title level={4}>Tạo trang mới</Typography.Title>
                            <Form
                                form={form}
                                name="create-page"
                                onFinish={handleSubmit}
                                initialValues={{
                                    name: '',
                                    content: '',
                                }}
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Tên trang"
                                    name="name"
                                    rules={[{ required: true, message: 'Vui lòng nhập tên trang' }]}
                                >
                                    <Input
                                        prefix={<LockOutlined />}
                                        placeholder="Nhập tên trang"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Chủ đề"
                                    name="content"
                                    rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}
                                >
                                    <Select
                                        placeholder="Chọn chủ đề"
                                        style={{ width: '100%' }}
                                    >
                                        {Object.values(CategoryContent).map((cat) => (
                                            <Select.Option key={cat} value={cat}>
                                                {categoryLabels[cat]}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        block
                                        loading={loading}
                                    >
                                        Tạo trang
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div>
                            <Typography.Title level={4}>Danh sách trang của bạn</Typography.Title>
                            <div style={{ 
                                height: '400px', 
                                overflowY: 'auto',
                                border: '1px solid #f0f0f0',
                                borderRadius: '4px'
                            }}>
                                <Menu 
                                    style={{ 
                                        width: "100%",
                                        borderRight: "none",
                                    }}
                                    mode="inline"
                                    items={(profiles || []).map(c => ({
                                        key: c.id.toString(),
                                        label: (
                                            <Row align="middle" gutter={8}>
                                                <Col>
                                                    <Avatar size={50} src={c.avt} />
                                                </Col>
                                                <Col style={{ maxWidth: 200, flex: 1, overflow: 'hidden' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                                        <Text
                                                            ellipsis
                                                            style={{
                                                                fontSize: 16,
                                                                fontWeight: 500,
                                                                display: 'block',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                        >
                                                            {c.name}
                                                        </Text>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <Button 
                                                        type="primary" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleButtonClick(c);
                                                        }}
                                                        loading={switchingProfile === c.id}
                                                    >
                                                        {switchingProfile === c.id ? 'Đang đổi...' : 'Đổi profile'}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ),
                                        style: {
                                            height: 80,
                                            padding: '8px 16px',
                                        },
                                    }))}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default CreatePageModal;