import { Avatar, Button, message, Modal, Upload } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import {CameraFilled,} from "@ant-design/icons"
import { UploadChangeParam } from "antd/es/upload";
import userService from "../../../../services/accountInfoService";


interface props{
    avt:string,
    setAvt:Dispatch<SetStateAction<string>>,
}
const ChangeAvt:React.FC<props>=({avt,setAvt})=>{
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string|null>(avt);

    const handleFileChange = (info: UploadChangeParam) => {
        const file = (info.file.originFileObj || info.file) as File; 
        if (!file) return;
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleUpload=async()=>{
        setIsLoading(true);
        const formData = new FormData();
        if (!file) {
            setIsLoading(false);
            return;
        }
        if(file){
            formData.append("media", file);
            formData.append("mediaType", "IMAGE");
        } 
        try {
            const data=await userService.changeAvt(formData);
            setFile(null)
            setPreviewImage(null);
            setAvt(data)
        } catch (error) {
            message.error("Lỗi!"+error);
        }finally {
            setFile(null);
            setIsOpen(false); 
            setIsLoading(false); 
        }

    }
    const SkullIcon = () => (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="9" cy="10" r="2" />
          <circle cx="15" cy="10" r="2" />
          <path d="M8 15c1.5 2 6 2 8 0" />
        </svg>
      );
    return (
        <>
            <Button style={{position:"absolute",left:95,bottom:5,fontSize:20,height:30,width:30,
                        display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"50%",opacity:0.8,
                        zIndex:100,
                }}
                    onClick={()=>setIsOpen(true)}
            >
                <CameraFilled/>
            </Button>

            <Modal title={<div style={{ textAlign: "center", width: "100%" ,fontSize:23,fontWeight:700}}>Đổi ảnh đại diện</div>}
                open={isOpen}
                footer={null}
                onCancel={() => setIsOpen(false)}
            >
            <Avatar
                src={previewImage || avt}
                size={100}
                style={{
                    display: "block",
                    margin: "auto",
                    marginBottom: 20,
                    border: "3px solid #fff",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // Hiệu ứng bóng
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                }}
            />
            <Upload  
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleFileChange}
            >
                <Button icon={<SkullIcon />} loading={isLoading}>Đổi ảnh đại diện</Button>
            </Upload>

            <Button type="primary" onClick={handleUpload} style={{ marginTop: 10, display: "block", width: "100%" }} loading={isLoading} disabled={!file}>
                Cập nhật
            </Button>
            </Modal>
        </>
    )
}

export default ChangeAvt;