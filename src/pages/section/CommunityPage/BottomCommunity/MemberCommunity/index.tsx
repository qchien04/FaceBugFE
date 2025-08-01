// src/components/GroupMembers.jsx
import { useEffect, useState } from 'react';
import { Input, Card, Avatar, List, Button, Divider, Tag, Typography, App } from 'antd';
import { DeleteRowOutlined } from '@ant-design/icons';
import CommunityService from '../../../../../services/communityService';
import { useOutletContext } from 'react-router-dom';
import { getTimeAgo } from '../../../../../utils/request';
import { Link } from 'react-router-dom';
import { Community, CommunityMember, CommunityRole } from '../../../../../utils/type';

interface CommunityContext {
  communityData:Community;
  role: CommunityRole;
}
const { Title, Text } = Typography;


const GroupMembers = () => {

    const [members, setMembers] = useState<CommunityMember[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const { communityData, role } = useOutletContext<CommunityContext>();
    const { modal } = App.useApp();
    
    const getdata= async()=>{
        const data:CommunityMember[]=await CommunityService.getMembers(communityData.communityId);
        setMembers(data);
    }
    const handleDelete = async (id: number) => {
        modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn xóa thành viên này không?',
            onOk: async () => {
                await CommunityService.deleteMember(communityData.communityId,id);
                getdata();
            },
        });
    }
    useEffect(()=>{
        getdata();
    },[])

    // Lọc members theo searchTerm
    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const admins = filteredMembers.filter((m) => m.role === CommunityRole.ADMIN);
    const normalMembers = filteredMembers.filter((m) => m.role !== CommunityRole.ADMIN);
    const paginatedMembers = normalMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <Card style={{ maxWidth: 600, margin: 'auto', marginTop: 10 }}>
            <Title level={5}>Thành viên</Title>
            <Text>Người và Trang mới tham gia nhóm này sẽ hiển thị tại đây.</Text>
            <Input.Search
                placeholder="Tìm thành viên"
                style={{ margin: '12px 0' }}
                allowClear
                value={searchTerm}
                onChange={e => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); 
                }}
            />
            <Divider orientation="left" orientationMargin="0">Quản trị viên & người kiểm duyệt</Divider>
            <List
                itemLayout="horizontal"
                dataSource={admins}
                renderItem={(admin) => (
                    <List.Item actions={[<Tag color="blue">ADMIN</Tag>]}> 
                        <List.Item.Meta
                            avatar={<Avatar src={admin.avt} />}
                            title={<Text>{admin.name}</Text>}
                            description={<Text >{admin.role}</Text>}
                        />
                    </List.Item>
                )}
            />
            <Divider orientation="left" orientationMargin="0">Thành viên khác</Divider>
            <List
                itemLayout="horizontal"
                dataSource={paginatedMembers}
                renderItem={(member) => (
                    <List.Item actions={role==CommunityRole.ADMIN?[<Button type="link" icon={<DeleteRowOutlined style={{color:"red"}} onClick={()=>handleDelete(member.userId)}/>} />]:[]}>
                        <List.Item.Meta
                            avatar={<Link to={`/profile/${member.userId}`}><Avatar src={member.avt} /></Link>}
                            title={<Link to={`/profile/${member.userId}`}><Text>{member.name}</Text></Link>}
                            description={<Text>Tham gia vào {getTimeAgo(member.joinAt)}</Text>}
                        />
                    </List.Item>
                )}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: normalMembers.length,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size || 5);
                    },
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20],
                }}
            />
        </Card>
    );
};

export default GroupMembers;
