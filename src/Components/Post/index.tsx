import { Card, Row, Col, Avatar, Typography, Image, Button, Dropdown, Modal, message } from "antd";
import "./Post.css"
import PostService from "../../services/postService";
import { Link, useNavigate } from "react-router-dom";
import { getTimeAgo, linkify } from "../../utils/request";
import PostModal from "../PostModal";
import { useEffect, useState } from "react";
import { CloseOutlined, CloseSquareTwoTone, CommentOutlined, DeleteOutlined, EllipsisOutlined, PushpinFilled, PushpinOutlined } from "@ant-design/icons";

import Like from "../Like";
import EditPost from "../EditPost";
import CommunityService from "../../services/communityService";
import VideoPlayerHLS from "../VideoPlayerHLS";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
const { Title, Text } = Typography;

import { useRef } from "react";
import { Community, CommunityRole,MediaType,Post as PostDTO  } from "../../utils/type";

interface prop{
  val:PostDTO;
  community?:Community;
  role?:CommunityRole;
  deletePost:(id:number)=>void;
}

const Post:React.FC<prop> = ({val,deletePost,community,role}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [community1,setCommunity1]=useState<Community|undefined>(community);
  const [post,setPost]=useState<PostDTO>(val);
  const [isHide,setIsHide]= useState<boolean>(false);
  const [pin,setPin]= useState<boolean>(val.isPinned);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const postRef = useRef<HTMLDivElement | null>(null);
  

  const fetchCommunity=async()=>{
    if(val.communityId){
      const data=await CommunityService.get(post.communityId);
      setCommunity1(data);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          fetchCommunity();
          PostService.decreaseRenderTime([post.id]);
        }
      },
      {
        threshold: 0.5, 
      }
    );
  
    if (postRef.current) {
      observer.observe(postRef.current);
    }
  
    return () => {
      if (postRef.current) {
        observer.unobserve(postRef.current);
      }
    };
  }, [post.id]);
  


  const pinPostHandle= async (pin:boolean) => {    
    try {
      await PostService.pinPost(post.id,pin)
      message.success("Thành công")
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: "Bạn có chắc chắn muốn xóa bài viết này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk() {
        deletePostHandle();
      },
    });
  };

  const confirmPin = () => {
    Modal.confirm({
      title: "Xác nhận",
      content: !pin?"Bạn có chắc chắn muốn ghim viết này không?":"Hủy ghim viết này?",
      okText: "Đồng ý",
      cancelText: "Hủy",
      okType: "primary",
      onOk() {
        pinPostHandle(!pin);
        setPin(!pin)
      },
    });
  };

  const deletePostHandle=()=>{
    deletePost(post.id);
  }

  const getItems=()=>{
    if(role===CommunityRole.ADMIN){
      return [
        { key: '2', label: <Button type="link" onClick={confirmDelete}>Xóa</Button>},
      ]
    }
    else{
      if(post.communityId==null){
        return [
          { key: '1', label:<EditPost post={post} setPost={setPost} /> },
          { key: '2', label: <Button type="link" onClick={confirmDelete}>Xóa</Button>},
        ]
      }
      else{
        return [
          { key: '2', label: <Button type="link" onClick={confirmDelete} icon={<DeleteOutlined/>}>Xóa</Button>},
        ]
      }
    }
  }

  return (
    <Card
      ref={postRef}
      style={{
        borderRadius: "8px",
        padding: "16px",
        marginBottom:"20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
      }}
      bordered={false}
    >
      {!isHide?<>
        <div style={{position:"absolute",right:10,top:30}}>
        {(user!.id==post.authorId||role===CommunityRole.ADMIN)&&<Dropdown menu={{ items:getItems() }} trigger={['click']}>
          <Button icon={<EllipsisOutlined />} type="link" style={{ fontSize: 22, fontWeight: 800 }} />
        </Dropdown>}
        {role===CommunityRole.ADMIN&&<Button icon={pin?<PushpinFilled/>:<PushpinOutlined/>} type="link" style={{fontSize:22,fontWeight:800}} onClick={confirmPin}></Button>}
        <Button icon={<CloseOutlined/>} type="link" style={{fontSize:22,fontWeight:800}} onClick={()=>setIsHide(true)}></Button>
      </div>
      <Row align="middle" gutter={[16, 16]}>
        {community1?<>
          <Col>
          <div>
            <div style={{width:40,position:"relative"}}>
              <Image
                className="full-width-image"
                src={community1.coverPhoto}
                style={{
                  width: "100%",
                  height: 40, 
                  objectFit: "cover",
                  borderRadius:10
                }}
                preview={false}
                onClick={()=>navigate(`/community/${community1.communityId}`)}
              />
              <Avatar 
                onClick={()=>{if(!post.anonymous) navigate(`/profile/${post.authorId}`)}} 
                style={{position:"absolute",bottom:-8,right:-8,cursor:"pointer"}} 
                size={30} 
                src={!post.anonymous?post.authorAvatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7BUrdRYjK--KE51atND6fsf2PBqIPM0-byw&s"} />
            </div>
          </div>
        </Col>
        <Col>
          <Link to={!post.anonymous?`/community/${community1.communityId}`:"#"} className="profile-link">
            <Title level={4} style={{ margin: 0 }}>
              {community1.communityName}
            </Title>
          </Link>
          <Text type="secondary"><Link to={!post.anonymous?`/profile/${post.authorId}`:"#"}>{!post.anonymous?post.authorName:"Người dùng ẩn danh"}</Link> - {getTimeAgo(post.createdAt)}</Text>
        </Col>
        
        </>:<>
          <Col>
            <Link to={!post.anonymous?`/profile/${post.authorId}`:"#"}>
              <Avatar size={48} src={!post.anonymous?post.authorAvatar:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7BUrdRYjK--KE51atND6fsf2PBqIPM0-byw&s"} />
            </Link>
          </Col>
          <Col>
            <Link to={!post.anonymous?`/profile/${post.authorId}`:"#"} className="profile-link">
              <Title level={5} style={{ margin: 0 }}>
                {!post.anonymous?post.authorName:"Người dùng ẩn danh"}
              </Title>
            </Link>
            <Text type="secondary">{getTimeAgo(post.createdAt)}</Text>
          </Col>
        </>
        }
      </Row>

      {/* Nội dung bài đăng */}
      <Row style={{ marginTop: "16px" }}>
        <Col span={24}>
          <Text>
            {linkify(post.title)}
          </Text>
        </Col>
      </Row>

      {post.mediaType===MediaType.IMAGE&&<Row style={{ width: "100%", marginTop: "16px" }}>
        <Col span={24}>
          <Image
            className="full-width-image"
            src={post.media}
            style={{
              width: "100%",
              height: "auto", 
              maxHeight: "500px",
              objectFit: "contain",
            }}
            preview={true}
          />
        </Col>
      </Row>}
      {post.mediaType===MediaType.VIDEO&&<Row style={{ width: "100%", marginTop: "16px" }}>
        <Col span={24}>
          <VideoPlayerHLS src={post.media}></VideoPlayerHLS>
        </Col>
      </Row>}
      

      <Row
        justify="space-between"
        align="middle"
        style={{
        marginTop: "16px",
        borderTop: "1px solid rgb(164, 158, 158)",
        paddingTop: "8px",
        }}
      >
        <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <Like postId={post.id}></Like>
        </Col>
        <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="text" icon={<CommentOutlined />} onClick={()=>setIsModalOpen(true)}>
              Bình luận
          </Button>
        </Col>
      </Row>
    </>
      :<>
      <div style={{display:"flex", justifyContent:"space-between "}}>
        <div style={{fontSize:18,fontWeight:700}}>
          <CloseSquareTwoTone/> Đã ẩn
        </div>
        
        <Button onClick={()=>setIsHide(false)} style={{fontSize:18,fontWeight:700}}>
          Hoàn tác
        </Button>
      </div>
      </>}

      <PostModal post={post} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}></PostModal>

    </Card>

    
  );
};

export default Post;