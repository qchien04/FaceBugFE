
import {  Col, Divider, Image, Menu, Row, Typography } from "antd";
import CreateCommunityForm from "./CreateCommunityForm";
import { useNavigate } from "react-router-dom";
import { Community } from "../../../utils/type";

const { Text } = Typography;

const LeftSider:React.FC<{communities:Community[]}>=({communities})=>{
  const navigate = useNavigate();
  console.log(communities);
  

  return(
    <div>
        <div style={{textAlign: "center",width:"100%",paddingTop:0, position:"sticky", top:0,backgroundColor:"#343536",zIndex:1000}}>
          <div style={{paddingTop:20}}>
            <CreateCommunityForm/>
          </div>
          <Divider style={{ margin: "16px 0", width: "100%" }} />
        </div>
        
        <div>
          <h1 style={{ fontSize: 19,textAlign: "center" }}>
            Nhóm của bạn
          </h1>
        </div>
        

        <Menu style={{ width: "100%",borderRight:"none",background:"#1f1f1f" }}
          mode="inline"
          items={communities.map(c => ({
            key: c.communityId.toString(),
            label: (
              <Row align="middle" gutter={8} onClick={() => navigate(`/community/${c.communityId}`, { state: { community: c ,communities:communities} })}>
                <Col>
                <Image
                  src={c.coverPhoto}
                  preview={true}
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: 'cover',
                    borderRadius: 10,
                  }}
                />
                </Col>
                <Col style={{ maxWidth: 200, flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <Text
                      ellipsis
                      style={{
                        fontSize: 20,
                        fontWeight: 500,
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {c.communityName}
                    </Text>
                    <Text
                      ellipsis
                      style={{
                        fontSize: 10,
                        display: 'block',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                   
                      {c.communityDescription!=null?c.communityDescription.replace(/\\n/g, '\n'):""}
                    </Text>
                  </div>
                </Col>
              </Row>
            ),
            style: {
              height: 80,
              padding: '8px 16px',
            },
        }))}
        />
      </div>
  )
}

export default LeftSider;