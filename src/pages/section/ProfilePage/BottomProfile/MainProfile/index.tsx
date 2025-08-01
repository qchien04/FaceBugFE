
import { Row, Col } from "antd";
import Left from "./Left";
import Right from "./Right";
import { useOutletContext } from "react-router-dom";
import { Profile } from "../../../../../utils/type";

interface ProfileContext{
  profile:Profile;
}

const MainProfile:React.FC= () => {
  const { profile } = useOutletContext<ProfileContext>();
  return (
    <>
   

      {/* Bottom */}
      <Row justify={"center"} style={{width:"100%",maxWidth:1600}}>
        <Col xs={0} md={7} >
            <Left profile={profile}></Left>
        </Col>
        <Col xs={18} md={9} >
          <Right userId={profile.id}></Right>
        </Col>
        
      
      </Row>


    </>



    
  );
};

export default MainProfile;
