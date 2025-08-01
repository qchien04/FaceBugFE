import { useEffect, useState } from "react";
import { Avatar, Col, Dropdown, Input, Row, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import "./search.css";
import friendshipService from "../../services/friendshipService";
import { ProfileSummary } from "../../utils/type";

let debounceTimeout: ReturnType<typeof setTimeout>;

const SearchBar: React.FC = () => {
    const navigate = useNavigate();
    const [isExpand,setIsExpand]= useState<boolean>(false);
    const [inputVal, setInputVal] = useState<string>("");
    const [userSearchList, setUserSearchList] = useState<ProfileSummary[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFindUser = async (key: string) => {
        if (!key.trim()) return;
        setIsLoading(true);
        const data = await friendshipService.getAllFriendProfilesByKey(key);
        setUserSearchList(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (!inputVal) {
            setUserSearchList([]);
            return;
        }
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            handleFindUser(inputVal);
        }, 400);

        return () => clearTimeout(debounceTimeout);
    }, [inputVal]);

    return (
        <Dropdown
            open={userSearchList.length > 0}
            dropdownRender={(menu) => (
                isLoading ? <div className="search-dropdown">
                        <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center"}}>
                            <Spin/>
                        </div>
                    </div> :
                    <div className="search-dropdown">{menu}</div>
            )}
            menu={{
                items: userSearchList.map((val, idx) => ({
                    key: idx.toString(),
                    label: (
                        <Link to={`/profile/${val.id}`}>
                            <Row align="middle" className="search-item">
                                <Col span={4}>
                                    <Avatar size={40} src={val.avt} />
                                </Col>
                                <Col span={18} offset={2}>
                                    {val.name}
                                </Col>
                            </Row>
                        </Link>
                    ),
                })),
            }}
            trigger={[]}
        >
            <div className="search-container">
                <SearchOutlined className="search-icon" onClick={()=>setIsExpand(pre=>!pre)}/>
                <Row>
                    <Col xs={isExpand?24:0} md={24}>
                        <Input
                            className="search-input"
                            placeholder="Tìm kiếm bạn bè..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onFocus={() => inputVal && handleFindUser(inputVal)}
                            onBlur={() => setTimeout(() => setUserSearchList([]), 200)}
                            onPressEnter={() => navigate(`/search?key=${inputVal}`)}
                        />
                    </Col>
                </Row>
                
            </div>
        </Dropdown>
    );
};

export default SearchBar;
