import { Avatar, Col, Row, Button, Mentions } from "antd";
import { useState, useRef, useEffect } from "react";
import PostService from "../../services/postService";
import { Link } from "react-router-dom";
import {  DownCircleFilled, UpCircleFilled } from '@ant-design/icons';

import { getTimeAgo, linkify } from "../../utils/request";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import type { MentionsRef } from 'antd/es/mentions';
import { CommentDTO } from "../../utils/type";

const { Option } = Mentions;

interface Prop {
  comment: CommentDTO;
  level: number;
}

const Comment: React.FC<Prop> = ({ comment, level }) => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [currComment, setCurrComment] = useState<CommentDTO>(comment);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState<string>("");
  const [showReplyComments, setShowReplyComments] = useState<boolean>(false);
  const [replyComments, setReplyComments] = useState<CommentDTO[]>([]);

  const replyInputRef = useRef<MentionsRef>(null);

  useEffect(() => {
    if (showReplyBox) {
      setReplyContent(`@${currComment.authorName} `);
      // slight delay to ensure textarea is rendered
      setTimeout(() => replyInputRef.current?.focus(), 0);
    }
  }, [showReplyBox, currComment.authorName]);

  const handleReply = async () => {
    if (replyContent.trim()) {
      const newComment: CommentDTO = {
        authorAvatar: user!.avt,
        authorId: user!.id,
        authorName: user!.name,
        createdAt: new Date().toISOString(),
        id: -1,
        content: replyContent,
        replyCounter: null,
        postId: currComment.postId,
        parent: currComment.id,
      };

      const data = await PostService.addComment(newComment);

      setCurrComment({
        ...currComment,
        replyCounter:
          currComment.replyCounter == null
            ? 1
            : currComment.replyCounter + 1,
      });
      setReplyComments([data, ...replyComments]);
      setShowReplyBox(false);
      setReplyContent("");
    }
  };

  const handleShowReplyBox = () => {
    setShowReplyBox(true);
  };

  const handleCancelReply = () => {
    setShowReplyBox(false);
    setReplyContent("");
  };

  const toggleShowReplyComment = async () => {
    if (replyComments.length === 0) {
      const data = await PostService.getChildComment(currComment.id);
      setReplyComments(data);
    }
    setShowReplyComments(!showReplyComments);
  };

  return (
    <div style={{ paddingLeft: (level!=2&&level!=3) ? 0 : 20 ,marginBottom:5}}>
      <Row align="top" gutter={[1, 1]} wrap={false} style={{ display: "flex" }}>
        {/* Avatar */}
        <Col span={2} style={{ padding: 5 }}>
          <Link to={`/profile/${currComment.authorId}`}>
            <Avatar size={29} src={currComment.authorAvatar} />
          </Link>
        </Col>

        {/* Content */}
        <Col flex="auto">
          <div
            style={{
              display: "inline-block",
              minWidth: 120,
              border: "1px solid gray",
              borderRadius: 10,
              padding: 1,
              paddingLeft:5,
              wordBreak: "break-word",
              backgroundColor: "rgb(14, 14, 14)",
            }}
          >
            <Link to={`/profile/${currComment.authorId}`} className="profile-link">
              <p style={{ margin: 0 ,fontSize:14}}>
                {currComment.authorName}
              </p>
            </Link>
            <div>
              <p
                style={{
                  marginBottom: 1,
                  marginTop: 0,
                  whiteSpace: "pre-line",
                }}
              >
                {linkify(currComment.content)}
              </p>
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <p style={{ marginBottom: 0, marginTop: 1 }}>
              {getTimeAgo(currComment.createdAt)}
            </p>
            <Button type="link" size="small" onClick={handleShowReplyBox}>
              Trả lời
            </Button>
          </div>

          {showReplyBox && (
            <div style={{ marginTop: 5 }}>
              <Mentions
                ref={replyInputRef}
                rows={2}
                value={replyContent}
                onChange={(val) => setReplyContent(val)}
                placeholder="Viết phản hồi..."
                style={{ width: '100%' }}
              >
                <Option value={`@${currComment.authorName}`}>@{currComment.authorName}</Option>
              </Mentions>
              <Button
                type="primary"
                onClick={handleCancelReply}
                size="small"
                style={{ marginTop: 4 }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleReply}
                size="small"
                style={{ marginLeft: 10, marginTop: 4 }}
              >
                Gửi
              </Button>
            </div>
          )}

          {currComment.replyCounter && currComment.replyCounter > 0 && (
            <Button
              type="link"
              size="small"
              onClick={toggleShowReplyComment}
              style={{ paddingLeft: 10 }}
            >
               {showReplyComments ? <><UpCircleFilled/> Thu gọn</> : 
               <>{<DownCircleFilled/>} Xem tất cả {currComment.replyCounter} phản hồi</>}
            </Button>
          )}
        </Col>
      </Row>

      {/* Replies */}
      {showReplyComments && replyComments.length > 0 &&
        replyComments.map((reply) => (
          <Comment key={reply.id} comment={reply} level={level + 1} />
        ))}
    </div>
  );
};

export default Comment;
