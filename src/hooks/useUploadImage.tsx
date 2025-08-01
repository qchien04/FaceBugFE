import { UploadChangeParam } from "antd/es/upload";
import { useState } from "react";

function useUploadImage() {
    const [file, setFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string|null>(null);
    
    const handleFileChange = (info: UploadChangeParam) => {
        const file = (info.file.originFileObj || info.file) as File; 
        if (!file) return;
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
    };


  return [file,previewImage,handleFileChange]
}

export default useUploadImage;