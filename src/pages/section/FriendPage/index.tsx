import { useEffect, useState } from "react";
import { Input, Card, Button, List, Avatar, message, Divider } from "antd";
import { UserDeleteOutlined } from "@ant-design/icons";
import friendshipService from "../../../services/friendshipService";
import { useSelector } from "react-redux";
import { Modal } from "antd";
const { confirm } = Modal;
import { RootState } from "../../../store";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import { ProfileSummary } from "../../../utils/type";

const { Title } = Typography;

const FriendsPage: React.FC = () => {
    const {user}=useSelector((state:RootState)=>state.auth);
    const [searchTerm, setSearchTerm] =useState("");
    const [friends, setFriends] = useState<ProfileSummary[] | null>(null);
    const [filteredFriends, setFilteredFriends] = useState<ProfileSummary[]>([]);
    
    const fetchFriend = async () => {
        const data = await friendshipService.getAllFriendByUserId(user!.id);
        setFriends(data);
        setFilteredFriends(data);
    };

    const unfriend= async(id: number)=>{
        try{
            await friendshipService.unFriend(id);
            setFriends(filteredFriends!.filter(item=>item.id!=id))
            setFilteredFriends(filteredFriends!.filter(item=>item.id!=id))
            message.success("Đã xóa bạn bè!")
        }
        catch(e){
            message.error("Có lỗi xảy ra!"+e)
        }
    }

    useEffect(() => {
        fetchFriend();
    }, []);

    useEffect(() => {
        if(friends){
            const filter = friends.filter(friend =>
                friend.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredFriends(filter)
        }
        
    }, [searchTerm]);

    
    const handleDeleteFriend = (id: number) => {
        confirm({
            title: "Xác nhận xóa bạn bè",
            content: "Bạn có chắc chắn muốn xóa người này khỏi danh sách bạn bè?",
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            onOk:()=> unfriend(id),
        });
    };
    
    

    return (
        <div style={{ padding: 24, minHeight: "100vh" ,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Title level={3} style={{ color: "#fff" }}>Tất cả bạn bè</Title>
            </div>

            <Divider></Divider>
            <Input.Search
                placeholder="Tìm kiếm bạn bè"
                allowClear
                enterButton
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: 24 }}
            />

            <List
                style={{ width: '100%' }}
                grid={{ gutter: 16, column: 3 }}
                dataSource={filteredFriends}
                renderItem={friend => (
                <List.Item>
                    <Card>
                        <Card.Meta
                            avatar={<Avatar size={64} src={friend.avt} />}
                            title={<Link to={`/profile/${friend.id}`}>
                                {friend.name}
                            </Link>}
                        />
                        <div style={{ marginTop: 12, textAlign: "right" }}>
                            <Button icon={<UserDeleteOutlined />} danger onClick={()=>handleDeleteFriend(friend.id)}>
                                Hủy kết bạn
                            </Button>
                        </div>
                    </Card>
                </List.Item>
                )}
            />
        </div>
    );
};

export default FriendsPage;
