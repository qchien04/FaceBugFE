import React, { useEffect, useState } from "react";

import { List, Card, Avatar, Divider } from "antd";
import userService from "../../../../services/accountInfoService";
import { Link, useLocation } from "react-router-dom";
import { PaginatedResponse, ProfileSummary } from "../../../../utils/type";


const PageSearchPage: React.FC = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const keyword = query.get("key");

  const [page, setPage] = useState(1);
  const [friends, setFriends] = useState<ProfileSummary[]>([]);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  console.log(friends)
  
  const fetchFriend = async () => {
    const data:PaginatedResponse<ProfileSummary>=await userService.searchUsersByKey(keyword!,true,page-1,pageSize)
    setFriends(data.content||[]);
    
    setTotal(data.totalElements);
 };
 
 useEffect(() => {
     fetchFriend();
 }, [keyword,page,pageSize]);

  return (
    <div style={{ width: "100%" }}>
      <div>
        <h1 style={{ fontSize: 19, textAlign: "center" }}>Tìm kiếm</h1>
      </div>
      <Divider style={{ margin: "16px 0", width: "100%" }} />
      <List
        style={{width:"100%"}}
        itemLayout="horizontal"
        dataSource={friends}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: [5],
        }}
        renderItem={(item) => (
          <Card
            key={item.id}
            style={{
              backgroundColor: "#242526",
              borderRadius: 12,
              marginBottom: 12,
              border: "none",
              color: "#fff",
            }}
            styles={{
              body: {
                padding: 16,
                backgroundColor: "#242526",
              },
            }}
          >
            <List.Item
              style={{ backgroundColor: "transparent" }}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.avt || undefined}
                    size={48}
                    style={{ backgroundColor: item.avt ? "transparent" : "#ccc" }}
                  />
                }
                title={<span style={{ color: "#fff", fontWeight: "bold" }}>
                        <Link to={`/profile/${item.id}`} className="profile-link">
                        {item.name}
                        </Link>
                      </span>}
              />
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};

export default PageSearchPage;
