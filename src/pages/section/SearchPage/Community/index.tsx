import React, { useEffect, useState } from "react";

import { List, Card, Divider, Image } from "antd";
import { Link, useLocation } from "react-router-dom";
import CommunityService from "../../../../services/communityService";
import { Community, PaginatedResponse } from "../../../../utils/type";


const CommunitySearchPage: React.FC = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  const keyword = query.get("key");

  const [community, setCommunity] = useState<Community[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  
  const fetchFriend = async () => {
     const data:PaginatedResponse<Community>=await CommunityService.searchCommunityByKey(keyword!,page-1,pageSize)
     setCommunity(data.content);
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
        dataSource={community}
        pagination={{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: [5,10],
        }}
        renderItem={(item) => (
          <Card
            key={item.communityId}
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
                  <Image
                    src={item.coverPhoto || undefined}
                    style={{ backgroundColor: item.coverPhoto ? "transparent" : "#ccc",width:100 ,height:50}}
                  />
                }
                title={<span style={{ color: "#fff", fontWeight: "bold" }}>
                        <Link to={`/community/${item.communityId}`} className="profile-link">
                          {item.communityName}
                        </Link>
                      </span>}
                description={item.totalMembers +" Thành viên"}
              />
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};

export default CommunitySearchPage;
