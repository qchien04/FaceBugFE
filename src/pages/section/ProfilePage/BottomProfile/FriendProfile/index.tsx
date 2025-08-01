import { Button, Card, Col, Row, Modal, Empty } from "antd";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import friendshipService from "../../../../../services/friendshipService";
import { DeleteOutlined } from "@ant-design/icons";
import { RootState } from "../../../../../store";
import { useSelector } from "react-redux";
import { ProfileSummary } from "../../../../../utils/type";

const { confirm } = Modal;

const FriendProfile: React.FC = () => {
    const {user}=useSelector((state:RootState)=>state.auth);
    const { id } = useParams<{ id: string }>();
    const userId = id ? parseInt(id, 10) : 0;

    const [friends, setFriends] = useState<ProfileSummary[]>([]);
    
    const fetchFriend = async () => {
        const data = await friendshipService.getAllFriendByUserId(userId);
        setFriends(data);
    };

    const unfriend= async(id: number)=>{
        await friendshipService.unFriend(id);
        setFriends(friends!.filter(friend=>friend.id!==id))
    }

    useEffect(() => {
        fetchFriend();
    }, []);

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
        <Row justify={"center"} style={{ width: "100%", maxWidth: 1600}}>
            <Col span={16}>
                <Card title={"Danh sách bạn bè"}>
                    {friends ? (
                        <Row gutter={[10, 10]} justify={"center"}>
                            {friends.length>0 ? friends.map((friend, index) => (
                                <Col xs={22}md={11} key={index} style={{
                                    padding: 10,
                                    borderRadius: 8, 
                                    border:"1px solid black",                                
                                    marginRight:10,
                                    boxShadow: "6px 4px 6px rgba(0, 0, 0, 0.05)",
                                }}>
                                    <Row align={"middle"} justify={"space-between"}>
                                        <Col span={20}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <Link to={`/profile/${friend.id}`}>
                                                    <img
                                                        src={friend.avt}
                                                        style={{ objectFit: "cover", height: 50, width: 50, borderRadius: "50%" }}
                                                        className="picture_element"
                                                    />
                                                </Link>

                                                <Link to={`/profile/${friend.id}`}>
                                                    <div>{friend.name}</div>
                                                </Link>
                                            </div>
                                        </Col>

                                        {user?.id==userId&&<Col>
                                            <Button
                                                icon={<DeleteOutlined />}
                                                danger
                                                onClick={() => handleDeleteFriend(friend.id)}
                                            />
                                        </Col>}
                                    </Row>
                                </Col>
                            )) : <Empty description="Không có bạn bè" />}
                        </Row>
                    ) : (
                        <Empty description="Không có bạn bè" />
                    )}
                </Card>
            </Col>
            <div style={{ height: 500 }}></div>
        </Row>
    );
};

export default FriendProfile;
