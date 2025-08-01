// src/components/GroupMembers.jsx
import { useEffect, useState } from 'react';
import { Input, Card, Avatar, List, Typography, Button } from 'antd';
import CommunityService from '../../../../../services/communityService';
import { useOutletContext } from 'react-router-dom';
import { getTimeAgo } from '../../../../../utils/request';
import { CheckSquareOutlined } from '@ant-design/icons';
import { Community, CommunityMember, CommunityRole } from '../../../../../utils/type';

interface CommunityContext {
  communityData:Community;
  role: CommunityRole;
}
const { Title, Text } = Typography;


const PendingCommunity = () => {
    const [allMembers, setAllMembers] = useState<CommunityMember[]>([]);
    const [members, setMembers] = useState<CommunityMember[]>([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const {communityData, role } = useOutletContext<CommunityContext>();
    
    const getdata= async()=>{
        if(role==CommunityRole.ADMIN){
            const data:CommunityMember[]=await CommunityService.getPendingMembers(communityData.communityId);
            setAllMembers(data);
            setMembers(data);
        }
    }
    const accepMember= async(memberId:number)=>{
        if(role==CommunityRole.ADMIN){
            await CommunityService.accepMember(communityData.communityId,memberId);
            setMembers(members.filter(e=>e.userId!=memberId));
        }
    }
    
    useEffect(()=>{
        getdata();
    },[])

    useEffect(() => {
        let filtered = allMembers;
        if (search.trim()) {
            filtered = allMembers.filter(member =>
                member.name.toLowerCase().includes(search.trim().toLowerCase())
            );
        }
        setTotal(filtered.length);
        const start = (page - 1) * pageSize;
        setMembers(filtered.slice(start, start + pageSize));
    }, [allMembers, search, page, pageSize]);

    return (
        <Card style={{ width: 600, margin: 'auto' ,marginTop:10}}>
        <Title level={5}>
            Chờ phê duyệt
        </Title>
        <Input.Search
            placeholder="Tìm thành viên"
            style={{ margin: '12px 0' }}
            allowClear
            value={search}
            onChange={e => {
                setSearch(e.target.value);
                setPage(1); 
            }}
        />

        <List
            itemLayout="horizontal"
            dataSource={members}
            pagination={{
                current: page,
                pageSize: pageSize,
                total: total,
                onChange: (page, pageSize) => {
                    setPage(page);
                    setPageSize(pageSize);
                }
            }}
            renderItem={(member) => (
            <List.Item actions={[<Button icon={<CheckSquareOutlined/>} onClick={()=>accepMember(member.userId)} />]}>
                <List.Item.Meta
                avatar={<Avatar src={member.avt} />}
                title={<Text>{member.name}</Text>}
                description={<Text>Tham gia vào {getTimeAgo(member.joinAt)}</Text>}
                />
            </List.Item>
            )}
        />
        </Card>
        
    );
};

export default PendingCommunity;
