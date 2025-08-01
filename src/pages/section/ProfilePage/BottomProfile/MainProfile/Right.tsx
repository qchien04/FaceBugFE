import { Button, Card, Col, Empty, message, Row } from "antd";
import {  BarsOutlined, AppstoreOutlined,} from "@ant-design/icons"
import { useEffect, useState } from "react";
import "../../ProfilePage.css";
import PostService from "../../../../../services/postService";
import PostNewStatusBar from "../../../../../Components/PostNewStatusBar";
import Post from "../../../../../Components/Post";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { AxiosError } from "axios";
import { PaginatedResponse ,Post as PostDTO} from "../../../../../utils/type";

interface props{
    userId:number,
}

const Right:React.FC<props>=({userId})=>{
    const {user}=useSelector((state:RootState)=>state.auth);
    const [viewMode, setViewMode] = useState<"list" | "grid">("list");
    const [posts,setPosts]= useState<PostDTO[]>([])
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchPost = async (pageNum = 0) => {
      setLoading(true);
      const data: PaginatedResponse<PostDTO> = await PostService.get(userId, true, pageNum, 5);
      if (pageNum === 0) {
        setPosts(data.content || []);
      } else {
        setPosts(prev => [...prev, ...(data.content || [])]);
      }
      setHasMore(!data.last); // data.last = true nếu là trang cuối
      setLoading(false);
    };
    
    useEffect(()=>{
      fetchPost();
    },[userId])

    useEffect(() => {
      const handleScroll = () => {
        if (
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
          hasMore &&
          !loading
        ) {
          setPage(prev => prev + 1);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading]);

    useEffect(() => {
      fetchPost(page);
      // eslint-disable-next-line
    }, [page, userId]);

    useEffect(() => {
      setPage(0);
      setHasMore(true);
    }, [userId]);

    const deletePost=(id:number)=>{
      try{
        PostService.delete(id);
        const newPosts=posts.filter((item)=>item.id!=id);
        setPosts(newPosts);
        message.success("Xóa thành công")
      }
      catch (error) {
        const err = error as AxiosError<{ message: string }>;      
        if (err.response?.data?.message) {
          message.error(err.response.data.message);
        } else {
          message.error("Đã có lỗi xảy ra.");
        }
      }    
    }

    return(
      <>
        {/* Dang bai */}
        {user?.id==userId&&<Row style={{marginTop:20}}>
          <Col span={24}><PostNewStatusBar/></Col>
        </Row>}

        {/* Bo loc */}
        <Row>
          <Col span={24}>
            <Card className="filter" style={{ marginTop: "16px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <Row justify="space-between" align="middle" style={{ marginBottom: "16px" }}>
                <Col>
                  <h3 style={{ margin: 0, fontWeight: "bold" }}>Bài viết</h3>
                </Col>
                <Col>
                  {/* <Button className="button_manager_post" icon={<FilterOutlined />} style={{ marginRight: "8px"}}>
                    Bộ lọc
                  </Button>
                  <Button className="button_manager_post" icon={<SettingOutlined />} >Quản lý bài viết</Button> */}
                </Col>
              </Row>
              <Row justify="start" gutter={[16, 0]} style={{ borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                <Col>
                  <Button
                    type={viewMode === "list" ? "primary" : "text"}
                    icon={<BarsOutlined />}
                    onClick={() => setViewMode("list")}
                    style={{ padding: "0 16px" }}
                  >
                    Chế độ xem danh sách
                  </Button>
                </Col>
                <Col>
                  <Button
                    type={viewMode === "grid" ? "primary" : "text"}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode("grid")}
                    style={{ padding: "0 16px"}}
                  >
                    Chế độ xem lưới
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        
        {/* bai viet */}
        <div className={viewMode === "grid" ? "post-grid-view" : "post-list-view"}>
          {posts.length > 0 ? (
            posts.map((val) => (
              <Post 
                val={val} 
                key={val.id} 
                deletePost={deletePost}
              />
            ))
          ) : (
            <Empty style={{marginTop:10}} description={"Không có bài viết nào hiển thị"} />
          )}
        </div>

        {loading && <div style={{textAlign: "center", margin: 16}}>Đang tải...</div>}
      </>
    )
}

export default Right; 