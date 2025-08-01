import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Modal, Upload, message } from "antd";
import { useState } from "react";
import chatService from "../../services/chatService";
import { UploadChangeParam } from "antd/es/upload";
import { ChatBoxFrame } from "../../utils/type";
interface prop{
  chatBoxFrame:ChatBoxFrame,
}
const ChangeGroupAvatar: React.FC<prop> = ({chatBoxFrame}) => {

  const [file, setFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(chatBoxFrame?.conversationAvt || "");
  const [open, setOpen] = useState<boolean>(false);

  // Xử lý chọn ảnh nhóm
  const handleFileChange = (info:UploadChangeParam) => {
    const selectedFile = info.file.originFileObj;
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewImage(objectUrl);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => setPreviewImage(e.target?.result as string);
    reader.readAsDataURL(selectedFile);
  };

  // Gửi ảnh lên server
  const handleUpload = async () => {
    if (!file) {
      message.warning("Vui lòng chọn ảnh trước!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const request = {
      conversationId: chatBoxFrame!.conversationId,
      members: chatBoxFrame.members!.map((m) => m.memberId),
    };

    formData.append("request", JSON.stringify(request));


    try {
      await chatService.changeAvtGroup(formData);
      message.success("Ảnh nhóm đã được cập nhật!");
      setOpen(false); // Đóng modal sau khi đổi ảnh
    } catch (error) {
      console.error("Lỗi khi đổi ảnh nhóm:", error);
      message.error("Đổi ảnh thất bại!");
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} style={{ fontSize: 15, cursor: "pointer" ,marginTop:5}}>Đổi ảnh nhóm</Button>
      <Modal title="Cập nhật ảnh nhóm" 
        open={open} 
        footer={null} 
        onCancel={() => setOpen(false)}
        >
        <Avatar src={previewImage} size={100} style={{ display: "block", margin: "auto", marginBottom: 20 }} />

        <Upload showUploadList={false} onChange={handleFileChange}>
          <Button icon={<UploadOutlined />}>Chọn ảnh nhóm</Button>
        </Upload>

        <Button type="primary" onClick={handleUpload} style={{ marginTop: 10, display: "block", width: "100%" }}>
          Cập nhật ảnh nhóm
        </Button>
      </Modal>
    </>
  );
};

export default ChangeGroupAvatar;
