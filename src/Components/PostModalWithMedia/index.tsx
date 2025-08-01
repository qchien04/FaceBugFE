import {Image ,Typography } from "antd";
import React, { useState } from "react";

const { Text } = Typography;
import previewImage from '../../assets/images/previewImage.png';

import { MediaType, Post } from "../../utils/type";
import PostModal from "../PostModal";
interface prop{
    post:Post,
}
const PostModalWithMedia=React.memo(({post}:prop)=>{
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    return(
    <>
        <Image src={post.mediaType===MediaType.IMAGE?post.media:previewImage}
            style={{objectFit: 'cover',width:100,height:100,cursor:"pointer"}}
            className="picture_element"
            preview={false}
            onClick={()=>setIsModalOpen(true)}
        />
        <Text
            ellipsis
            style={{
                fontSize: 10,
                marginLeft:10,
                display: 'block',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth:80,
            }}
        >
            {post.title}
        </Text>

        <PostModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} post={post}></PostModal>
        
    </>
    )
})
export default PostModalWithMedia;