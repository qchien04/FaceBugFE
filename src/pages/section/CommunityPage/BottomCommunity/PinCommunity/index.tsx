
import { Row, Col } from "antd";
import Left from "./Left";
import { useOutletContext } from 'react-router-dom';
import IntroduceCommunity from "../IntroduceCommunity";
import { Community, CommunityRole } from "../../../../../utils/type";
interface CommunityContext {
  communityData:Community;
  role: CommunityRole;
}

const PinCommunity:React.FC= () => {
  const { communityData, role } = useOutletContext<CommunityContext>();
  console.log(communityData)
  console.log(role)
  return (
    <>
      {/* Bottom */}
      <Row justify={"center"} style={{width:"100%",maxWidth:1600}}>
        <Col xs={18} md={9}>
          <Left community={communityData} role={role}></Left>
        </Col>
        <Col xs={0} md={7}>
          <IntroduceCommunity community={communityData} role={role}></IntroduceCommunity>
        </Col>
      
      </Row>


    </>

    
  );
};

export default PinCommunity;


