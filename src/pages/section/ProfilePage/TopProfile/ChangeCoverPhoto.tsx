import { Button, message, Upload } from "antd"
import { Dispatch, SetStateAction, useState } from "react";
import {CameraFilled,} from "@ant-design/icons"
import { UploadChangeParam } from "antd/es/upload";
import userService from "../../../../services/accountInfoService";


interface props{
    setPreviewImage:Dispatch<SetStateAction<string | null>>,
}
const ChangeCoverPhoto:React.FC<props>=({setPreviewImage})=>{
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isChangeCoverPhoto,setIsChangeCoverPhoto]=useState<boolean>(false);
    const [file, setFile] = useState<File | null>(null);
    
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
        if (!file) return;
        if(file){
            formData.append("media", file);
            formData.append("mediaType", "IMAGE");
        } 
        try {
            const data=await userService.changeCoverPhoto(formData);
            setFile(null)
            setPreviewImage(data);
        } catch (error) {
            message.error("Lỗi!"+error);
        }finally {
            setFile(null);
            setIsChangeCoverPhoto(false); 
            setIsLoading(false); 
        }

    }

    const changeCoverphoto1=()=>{
        setIsChangeCoverPhoto(true);
      }
      const closeChangeCoverphoto1=()=>{
        setFile(null);
        setPreviewImage(null);
        setIsChangeCoverPhoto(false);
      }
    return (
        <>
        <div style={{position:"absolute",right:10,bottom:5,
                        display:"flex",justifyContent:"center",alignItems:"center"
                    }}
                onClick={changeCoverphoto1}
        >
        <Upload  
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleFileChange}
            style={{borderRadius:100}}
        > <Button icon={<CameraFilled/>} disabled={isLoading}>Chỉnh sửa</Button></Upload>
        </div>

        {isChangeCoverPhoto&&file&&<div style={{position:"absolute",right:10,top:5,
                        display:"flex",justifyContent:"center",alignItems:"center",gap:5
                    }}>            
            <Button onClick={closeChangeCoverphoto1} disabled={isLoading}>Hủy</Button>
            <Button onClick={handleUpload} loading={isLoading}>
                {isLoading ? "Đang lưu..." : "Lưu"}
            </Button>
        </div>}
        </>    
    )
}

export default ChangeCoverPhoto;