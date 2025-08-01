import { CloseCircleTwoTone, CrownTwoTone, ExclamationCircleOutlined, MenuOutlined } from "@ant-design/icons";
import { Modal, Input, List, Avatar } from "antd";
import { useEffect, useState } from "react";
import friendshipService from "../../services/friendshipService";
import chatService from "../../services/chatService";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./AddMemberGroupForm.css";
import ChangeGroupAvatar from "../ChangeGroupAvatar";
import { ChatBoxFrame, ProfileSummary, MemberGroupChat } from "../../utils/type";

interface prop{
  chatBoxFrame:ChatBoxFrame,
}

const AddMembergroupForm:React.FC<prop> = ({chatBoxFrame}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchFriendList, setSearchFriendList] = useState<ProfileSummary[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (inputValue.trim() === "") {
      setSearchFriendList([]);
    } else {
      (async () => {
        try {
          const allFriends:ProfileSummary[] = await friendshipService.getAllFriendProfilesByKey(inputValue);

          const memberIds:Set<number> = new Set(chatBoxFrame.members!.map((member) => member.memberId));

          const filteredFriends:ProfileSummary[] = allFriends.filter((friend) => !memberIds.has(friend.id));
          setSearchFriendList(filteredFriends);
        } catch (error) {
          console.error("Lỗi khi tìm kiếm bạn bè:", error);
        }
      })();
    }
  }, [inputValue]);

  const handleAdd = async (friend: ProfileSummary) => {
    try {
      const data:MemberGroupChat = await chatService.addMemberToGroup({
        conversationId: chatBoxFrame!.conversationId!,
        friend: friend,
        members: chatBoxFrame.members!.map(item => item.memberId),
      });
      console.log("Thành viên đã được thêm:", data);
    } catch (error) {
      console.error("Lỗi khi thêm thành viên:", error);
    }
    setInputValue("");
    setIsOpen(false);
  };

  const handleRemove = (member:MemberGroupChat) => {
    Modal.confirm({
      title: "Xác nhận xóa thành viên",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa ${member.memberName} khỏi nhóm không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await chatService.removeMemberFromGroup({
            conversationId: chatBoxFrame!.conversationId!,
            member:member,
            members:chatBoxFrame.members!.map(item=>item.memberId),
          });
        } catch (error) {
          console.error("Lỗi khi xóa thành viên:", error);
        }
      },
    });
  };
  const currentUser:MemberGroupChat = {
    conversationId: chatBoxFrame.conversationId!,
    memberId: user!.id, 
    memberName: "Tôi",
    memberAvt: user!.avt||"ok",
    memberRole: chatBoxFrame!.conversationRole||"ok",
  };

  return (
    <>
      {isOpen ? (
        <Modal
          title={chatBoxFrame?.conversationName}
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
                <List.Item onClick={() => handleAdd(friend)}>
                  <List.Item.Meta
                    avatar={<Avatar src={friend.avt} />}
                    title={friend.name}
                  />
                </List.Item>
              )}
            />
          </div>

          <ChangeGroupAvatar chatBoxFrame={chatBoxFrame}/>
          <div className="member-list-title">Thành viên trong nhóm</div>
          
          <div className="member-list-container">
            <List
              dataSource={[...chatBoxFrame.members!]}
              renderItem={(member) => (
                <List.Item
                  actions={
                    chatBoxFrame?.conversationRole === "ADMIN" && member.memberId !== currentUser.memberId
                      ? [
                          <CloseCircleTwoTone
                            key="remove"
                            twoToneColor="#ff4d4f"
                            style={{ fontSize: 18, cursor: "pointer" }}
                            onClick={() => handleRemove(member)}
                          />,
                        ]
                      : []
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar src={member.memberAvt} />}
                    title={
                      <span style={{ fontWeight: "bold", color: member.memberRole === "ADMIN" ? "red" : "white" }}>
                        {member.memberRole === "ADMIN" && (    
                          <CrownTwoTone twoToneColor="#FFD700" style={{ marginRight: 5 }} />
                        )}
                        {member.memberName}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </Modal>
      ) : (
        <MenuOutlined
          style={{ fontSize: 20, cursor: "pointer" }}
          onClick={() => setIsOpen(true)}
        />
      )}
    </>
  );
};

export default AddMembergroupForm;
