import { Avatar, Button, Col, Input, message, Modal, Progress, Row, Typography, Upload } from "antd";
import React, { Dispatch, SetStateAction, useState } from "react";
import { CloseOutlined, PictureFilled, VideoCameraOutlined } from "@ant-design/icons"
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./PostNewStatusBar.css";
import { UploadChangeParam } from "antd/es/upload";
import PostService from "../../services/postService";
import { Spin } from "antd";
import { AxiosProgressEvent } from "axios";
import { MediaType } from "../../utils/type";

const { Title, Text } = Typography;

interface prop {
    visible: boolean,
    mediaArena: boolean,
    communityId?:number,
    anonymous?:boolean,
    setMediaArena: Dispatch<SetStateAction<boolean>>,
    setVisible: Dispatch<SetStateAction<boolean>>;
}
const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB chunks
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const CreatePostModal: React.FC<prop> = ({ mediaArena, setMediaArena, visible, setVisible,communityId, anonymous }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [videoInfo, setVideoInfo] = useState<{ duration: number; size: number } | null>(null);
    const [fileAcceptType, setFileAcceptType] = useState<"image" | "video">("image");

    const { user } = useSelector((state: RootState) => state.auth);

    const handleOk = async () => {
        setLoading(true);
        const formData = new FormData();
        if (file) {
            
            if (file.type.startsWith("image/")) {
                formData.append("media", file);
                formData.append("mediaType", MediaType.IMAGE);
            } else if (file.type.startsWith("video/")) {
                formData.append("mediaType", MediaType.VIDEO);
            }
        } else {
            formData.append("mediaType", MediaType.NONE);
        }
        formData.append("title", title);

        if(communityId&&communityId>=1){
            formData.append("communityId", communityId.toString());
            
            if(anonymous!=undefined&&anonymous==true){
                formData.append("anonymous", "true");
            }
            else{
                formData.append("anonymous", "false");
            }
        }
        
        try {
            let newPost;
            if(communityId&&communityId>=1){
                newPost=await PostService.createPostCommunity(formData);
            }
            else{
                newPost = await PostService.create(formData);
            }
            if(file&&file.type.startsWith("video/")){
                await handleVideoUpload(file,newPost.media.substring(9,12));
            }
            message.success("Thành công!");
            setVisible(false);
        } catch (error) {
            message.error("Lỗi!" + error);
        } finally {
            setLoading(false);
        }
    };

    const validateFile = (file: File): boolean => {
        if (file.size > MAX_FILE_SIZE) {
            message.error('File không được vượt quá 2GB');
            return false;
        }
        return true;
    };

    const handleFileChange = (info: UploadChangeParam) => {
        const file = (info.file.originFileObj || info.file) as File;
        if (!file) return;

        if (!validateFile(file)) {
            return;
        }

        setFile(file);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
            setPreviewVideo(null);
        } else if (file.type.startsWith('video/')) {
            setPreviewVideo(URL.createObjectURL(file));
            setPreviewImage(null);
            
            // Get video info
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                setVideoInfo({
                    duration: video.duration,
                    size: file.size
                });
            };
            video.src = URL.createObjectURL(file);
        }
    };

    const handleVideoUpload = async (file: File,media:string): Promise<void> => {
        setIsUploading(true);
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        
        for (let chunk = 0; chunk < totalChunks; chunk++) {
            const start = chunk * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const blob = file.slice(start, end);
            
            const formData = new FormData();
            formData.append('chunk', blob);
            formData.append('chunkIndex', chunk.toString());
            formData.append('totalChunks', totalChunks.toString());
            formData.append('fileName', media);
            
            try {
                await uploadWithRetry(formData, chunk);
                const progress = ((chunk + 1) / totalChunks) * 100;
                setUploadProgress(progress);
            } catch (error) {
                throw new Error(`Failed to upload chunk ${chunk}: ${error}`);
            }
        }
        setIsUploading(false);
    };

    const uploadWithRetry = async (formData: FormData, chunkIndex: number, maxRetries = 3): Promise<void> => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const config={
                    onUploadProgress: (progressEvent:AxiosProgressEvent) => {
                        if (progressEvent.total) {
                            const chunkProgress = (progressEvent.loaded * 100) / progressEvent.total;
                            const totalProgress = ((chunkIndex * 100 + chunkProgress) / Math.ceil((file?.size || 0) / CHUNK_SIZE));
                            setUploadProgress(totalProgress);
                        }
                    }
                }
                await PostService.uploadVideo(formData, config);
                return;
            } catch (error) {
                if (attempt === maxRetries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    };

    return (
        <Modal
            title={<div style={{ textAlign: "center", width: "100%", fontSize: 23, fontWeight: 700 }}>Tạo bài viết mới</div>}
            open={visible}
            footer={null}
            onCancel={() => setVisible(false)}
        >
            <div style={{ position: "relative" }}>
                {loading && (
                    <div style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: "flex", justifyContent: "center", alignItems: "center",
                        zIndex: 10
                    }}>
                        <Spin size="large" />
                    </div>
                )}

                {/* Nội dung modal */}
                <div style={{ opacity: loading ? 0.5 : 1 }}>
                    <Row>
                        <Col span={3}>
                            <Avatar
                                style={{ marginLeft: 5 }}
                                size={50}  
                                src={anonymous?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7BUrdRYjK--KE51atND6fsf2PBqIPM0-byw&s":user!.avt}
                            />
                        </Col>
                        <Col span={20}>
                            <Title ellipsis={{ tooltip: true }} level={5} style={{ margin: 0 }}>{anonymous?"Người dùng ẩn danh":user!.name}</Title>
                            <Text ellipsis type="secondary">Công khai</Text>
                        </Col>
                    </Row>

                    <div className="inner-content-modal" style={{ maxHeight: 350, overflowY: 'auto' }}>
                        <Row style={{ marginTop: 10, width: "100%" }}>
                            <Col span={24}>
                                <Input.TextArea
                                    placeholder="Bạn đang nghĩ gì?"
                                    autoSize={{ minRows: 1, maxRows: 10000 }}
                                    onChange={(e) => setTitle(e.target.value)}
                                    style={{
                                        border: "none",
                                        outline: "none",
                                        boxShadow: "none",
                                        fontSize: 25,
                                    }}
                                />
                            </Col>
                        </Row>

                        {mediaArena && (
                            <div style={{ marginTop: 10, width: "100%", position: "relative" }} className="preview-upload">
                                <div style={{ position: 'absolute', right: 5, top: 5 }}>
                                    <div style={{ float: 'right' }}>
                                        <Button
                                            icon={<CloseOutlined />}
                                            shape="circle"
                                            onClick={() => { setMediaArena(false); setFile(null); setPreviewImage(null); setPreviewVideo(null); }}
                                            style={{ zIndex: 32 }}
                                        />
                                    </div>
                                </div>

                                <Upload
                                    className="upload-post"
                                    showUploadList={false}
                                    beforeUpload={() => false}
                                    onChange={handleFileChange}
                                    accept={fileAcceptType === "image" ? "image/*" : "video/*"} 
                                >
                                    <div style={{ flex: 1 }}>
                                        {!file ? (
                                            <div style={{
                                                flex: 1, display: "flex", height: "100%",
                                                flexDirection: "column", justifyContent: "center", alignItems: "center"
                                            }}>
                                                <div>
                                                <Button
                                                    style={{ fontSize: 20, marginTop: 20 }}
                                                    icon={<PictureFilled />}
                                                    shape="circle"
                                                    onClick={() => setFileAcceptType("image")}
                                                />
                                                <Button
                                                    style={{ fontSize: 20, marginTop: 20, marginLeft: 10 }}
                                                    icon={<VideoCameraOutlined />}
                                                    shape="circle"
                                                    onClick={() => setFileAcceptType("video")}
                                                />
                                                </div>
                                                <div style={{ fontSize: 20, marginBottom: 15 }}>
                                                    Thêm ảnh hoặc video
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {previewImage ? (
                                                    <img style={{ zIndex: 2, width: "100%", borderRadius: 10 }} src={previewImage} alt="Preview" />
                                                ) : 
                                                previewVideo &&(
                                                    <div>
                                                        <video style={{ zIndex: 2, width: "100%", borderRadius: 10 }} controls>
                                                            <source src={previewVideo} type="video/mp4" />
                                                            Your browser does not support the video tag.
                                                        </video>
                                                        {videoInfo && (
                                                                <div style={{ marginTop: 10 }}>
                                                                    <Text>Thời lượng: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toFixed(0)}</Text>
                                                                    <br />
                                                                    <Text>Kích thước: {(videoInfo.size / (1024 * 1024)).toFixed(2)} MB</Text>
                                                                </div>
                                                            )}

                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </Upload>
                            </div>
                        )}
                    </div>

                    <Row style={{ marginTop: 10, width: "100%" }}>
                        <Col span={24}>
                            <Row style={{ border: "1px solid gray", borderRadius: 10, width: "100%" }}>
                                <Col span={12}>
                                    <p style={{ marginLeft: 10, fontSize: 20 }}>Thêm bài viết của bạn</p>
                                </Col>
                                <Col span={12} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Button style={{ fontSize: 20, color: "green" }} icon={<PictureFilled />} onClick={() => setMediaArena(true)}></Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {isUploading && (
                        <div style={{ marginTop: 10 }}>
                            <Progress percent={Math.round(uploadProgress)} />
                            <Text>Đang tải lên: {Math.round(uploadProgress)}%</Text>
                        </div>
                    )}

                    <div style={{ textAlign: "center", width: "100%", marginTop: 10 }}>
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleOk}
                            style={{ fontSize: 16, width: "100%" }}
                            disabled={loading}
                        >
                            Đăng bài
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePostModal;