
import { Typography, Empty, Divider } from "antd";
// import friendshipService from "../../../../services/friendshipService";
// import { ProfileSummary } from "../../../../utils/type";

const { Title } = Typography;


const SuggestFriendPage: React.FC = () => {
//   const [friends, setFriends] = useState<ProfileSummary[]>([]);
  
//   const fetchFriend = async () => {
//       const data = await friendshipService.getRequest();
//       setFriends(data);
//   };
  
//   const updateView=(id:number)=>{
//     const newList=friends.filter(item=>item.id!=id)
//     setFriends(newList);
//   }

//   const refuseRequestHandle=async(userId:number)=>{
//     const data=await friendshipService.refuseRequestMakeFriend(userId);
//     if(data){
//       updateView(userId)
//     }
//     else{
//       message.error("Có lỗi xảy ra!")
//     }
//   }
//   const acceptRequestHandle=async(userId:number)=>{
//       const data=await friendshipService.acceptRequestMakeFriend(userId);
//       if(data){
//         message.success("Kết bạn thành công!")
//         updateView(userId)
//       }
//       else{
//         message.error("Có lỗi xảy ra!")
//       }
//   }

//   useEffect(() => {
//       fetchFriend();
//   }, []);


  return (
    <div style={{ padding: 24, minHeight: "100vh" ,display:"flex",flexDirection:"column",alignItems:"center",width:"100%"}}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={3} style={{ color: "#fff" }}>Gợi ý cho bạn</Title>
      </div>

      <Divider></Divider>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Empty description={"Chức năng đang phát triển vui lòng quay lại sau"}/>
      </div>
    </div>
  );
};

export default SuggestFriendPage;
