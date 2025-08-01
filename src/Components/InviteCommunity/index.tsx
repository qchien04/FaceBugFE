import {  PlusCircleFilled, UserAddOutlined } from "@ant-design/icons";
import { Modal, Input, List, Avatar, Button, message } from "antd";
import { useEffect, useState } from "react";
import friendshipService from "../../services/friendshipService";
import CommunityService from "../../services/communityService";
import { AxiosError } from "axios";
import { Community, ProfileSummary } from "../../utils/type";

interface props{
  community:Community,
}


const InviteCommunity:React.FC<props> = ({community}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchFriendList, setSearchFriendList] = useState<ProfileSummary[]>([]);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSearchFriendList([]);
    } else {
      (async () => {
        try {
          const allFriends:ProfileSummary[] = await friendshipService.getAllFriendProfilesByKey(inputValue);

          setSearchFriendList(allFriends);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm bạn bè:", error);
        }
      })();
    }
  }, [inputValue]);

  const handleAdd = async (friend: ProfileSummary) => {
    try{
      const data=await CommunityService.inviteCommunity(friend,community.communityId);
      if(data){
        message.success("Mời thành công");
      setInputValue("");
      setIsOpen(false);
    }}
    catch (error) {
      const err = error as AxiosError<{ message: string }>;
    
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error("Đã có lỗi xảy ra.");
      }
    }
  };

 
  return (
    <>
      {isOpen ? (
        <Modal
          title={"Mời bạn bè"}
          open={isOpen}
          onCancel={() => setIsOpen(false)}
          footer={null}
          className="add-member-modal"
        >
          <Input.Search
            placeholder="Nhập tên bạn bè..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            allowClear
            className="ant-input-search"
          />

          <div className="friend-list-container">
            <List
              className="friend-list"
              dataSource={searchFriendList}
              renderItem={(friend) => (
                <List.Item
                  actions={
                     [
                        <Button icon={<PlusCircleFilled/>}
                          key="add"
                          style={{ fontSize: 18, cursor: "pointer" }}
                          onClick={() => handleAdd(friend)}
                        />,
                      ]
                }>
                  <List.Item.Meta
                    avatar={<Avatar src={friend.avt} />}
                    title={friend.name}
                  />
                </List.Item>
              )}
            />
          </div>

        </Modal>
      ) : (
        <Button className="ml" icon={<UserAddOutlined/>}   onClick={() => setIsOpen(true)}>Mời</Button>
      )}
    </>
  );
};

export default InviteCommunity;
