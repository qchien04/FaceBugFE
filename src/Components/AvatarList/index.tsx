import { Avatar, Tooltip } from 'antd';


interface props{
  avatarUrls:string[],
}
const AvatarOverlap:React.FC<props> = ({avatarUrls}) => (
  <Avatar.Group
    max={{ count: 10 }}          // nếu quá 20 sẽ thành "+n"
    size="large"
  >
    {avatarUrls.map((url, idx) => (
      <Tooltip title={`User ${idx + 1}`} key={idx}>
        <Avatar src={url} />
      </Tooltip>
    ))}
  </Avatar.Group>
);

export default AvatarOverlap;
