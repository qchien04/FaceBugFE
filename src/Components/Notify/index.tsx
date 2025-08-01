import { BellOutlined } from '@ant-design/icons';
import { Avatar, Badge, Button, Dropdown, Empty } from 'antd';
import "./Notify.css";
import notifyService, { NotificationAction, NotificationResponse, NotificationType } from '../../services/notifyService';

import axiosClient from '../../config/axiosconfig';
import { Link } from 'react-router-dom';
import WithModalNoitify from './WithModalNoitify';
import { getTimeAgo } from '../../utils/request';
import { useNotification } from '../../hooks/useNotification';
function Notify(){
    const {deleteAction,markAllNotification,notifications,checkUnReadNoitify}= useNotification();

    const ActionHandle = async (action: NotificationAction,item:NotificationResponse) => {
        if(action.method=="POST"){
            try{    
                await axiosClient.post(`${action.action}`)
                deleteAction(item.id);
            }
            catch (error){
                console.log(error);
            }
           
        }
    };
    const notificationItems = notifications?.map((item) => ({
        key: item.id,
        label: (<>
            {item.type==NotificationType.FRIEND_REQUEST||item.type==NotificationType.INVITE_COMMUNITY||item.type==NotificationType.NORMAL?
                <>
                    <Link to={item.link}>
                        <div className="notify__item">
                            <div><Avatar src={item.avt} size={50}/></div>
                            <div className="notify__content">
                                <div className="notify__message">{item.message} </div>
                                <div className="notify__time">{getTimeAgo(item.createdAt)}</div>
                                {item.actions?.map((action) => (
                                <Button style={{marginRight:5,zIndex:3}} key={action.label} type="primary" size="small" onClick={() => ActionHandle(action,item)}>
                                    {action.label}
                                </Button>
                            ))}
                            </div>
                        </div>
                    </Link>
                </>:

                <>
                    <WithModalNoitify key={item.id} item={item}></WithModalNoitify>
                </>
            }
            
        </>
            
        ),
    }));
    notificationItems?.push({
        key: -1,
        label: <Empty style={{}} description="Hết thông báo rồi!" />,
    })
    
    const handleClickNotify=async()=>{
        await notifyService.markAllNotification();
        markAllNotification();
    }
    return(
        <>
            <Dropdown menu={{items:notificationItems}} 
                trigger={["click"]}
                onOpenChange={handleClickNotify}
                dropdownRender={(menu)=>(
                    <>
                        <div className='notify__dropdown'>
                            <div className='notify__header'>
                                <div className='notify__header-title'>
                                    <BellOutlined style={{fontSize:20}}></BellOutlined>
                                    <strong>Thông báo</strong>
                                </div>
                            </div>
                            <div className='notify__body'>
                                {menu}
                            </div>
                            
                        </div>
                    </>
                )}
                >
                <Badge dot={checkUnReadNoitify()}>
                    <Button type='text' icon={<BellOutlined style={{ fontSize: '20px', color: 'blue' }}/>}></Button>
                </Badge>
            </Dropdown>
        </>
    );
}

export default Notify