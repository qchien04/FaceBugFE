import { useState } from "react";
import { Modal, Input, Button } from "antd";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (groupName: string) => void;
}

export default function CreateGroupModal({ isOpen, onClose, onCreate }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState<string>("");

  const handleSubmit = () => {
    if (groupName.trim()) {
      onCreate(groupName);
      setGroupName("");
      onClose();
    }
  };

  return (
    <Modal 
      title="Tạo nhóm mới" 
      open={isOpen} 
      onCancel={onClose} 
      getContainer={false} 
      style={{ top: "50%", transform: "translateY(-50%)" }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Tạo
        </Button>,
      ]}
    >
      <Input
        placeholder="Nhập tên nhóm"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
    </Modal>

  );
}
