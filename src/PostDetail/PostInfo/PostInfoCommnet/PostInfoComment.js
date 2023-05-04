import React, { useState } from "react";
import styled from "styled-components";
import PageCommentInput from "./PostCommentInput";
import PostInfoReply from "./PostInfoReply";
import PostCommentItem from "./PostCommentItem";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const HrCommentLine = styled.hr`
  background: #d9d9d9;
  height: 1px;
  border: 0;
  margin-top: 25px;
`;

const CommentUl = styled.ul`
  list-style: none;
  margin-bottom: 20px;
  width: 1080px;
`;

const PostInfoComment = () => {
  const [comment, setComment] = useState("");
  const { postId } = useParams();
  const [newComment, setNewComment] = useState([]);
  const [comment_count, setComment_count] = useState(0);

  const fetchComment = async () => {
    await axios
      .get(`http://13.125.111.131:8080/recruitment/${postId}`, {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },
      })
      .then((response) => {
        setNewComment(response.data.repliesInfo.info);
        setComment_count(response.data.repliesInfo.count);
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchComment();
  }, []);

  const onCommentChange = (e) => {
    e.preventDefault();
    setComment(e.target.value);
  };

  const onCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.length === 0) {
      alert("댓글 내용을 입력해주세요!");
    } else {
      const params = {
        content: comment,
      };

      const response = await axios.post(
        `http://13.125.111.131:8080/recruitment/${postId}/reply`,
        null,

        {
          responseType: "json",
          headers: {
            // 로그인 후 받아오는 인증토큰값
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },

          params,
        }
      );
      fetchComment();
      setComment("");
    }
  };

  const onEditComment = (id, newContent) => {
    axios.put(
      `http://13.125.111.131:8080/recruitment/${postId}/reply/${id}`,
      {
        content: newContent,
      },

      {
        headers: {
          // 로그인 후 받아오는 인증토큰값
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },
      }
    );

    setNewComment(
      newComment.map((item) =>
        item.replyId === id ? { ...item, content: newContent } : item
      )
    );
  };

  const onDeleteComment = async (id) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      await axios.delete(
        `http://13.125.111.131:8080/recruitment/${postId}/reply/${id}`,

        {
          headers: {
            // 로그인 후 받아오는 인증토큰값
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
        }
      );
      fetchComment();
    }

    // setNewComment(newComment.filter((item) => item.replyId !== id));
  };

  const onReplySubmit = async (reply, id) => {
    const params = {
      content: reply,
      parent: id,
    };

    const response = await axios.post(
      `http://13.125.111.131:8080/recruitment/${postId}/reply`,
      null,

      {
        responseType: "json",
        headers: {
          // 로그인 후 받아오는 인증토큰값
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },

        params,
      }
    );
    fetchComment();
  };

  return (
    <div>
      <h1>{comment_count}개의 댓글</h1>

      <PageCommentInput
        onCommentSubmit={onCommentSubmit}
        comment={comment}
        onCommentChange={onCommentChange}
      />

      {newComment?.map((item) => (
        <CommentUl key={item.replyId}>
          <PostCommentItem
            item={item}
            onDeleteComment={onDeleteComment}
            onEditComment={onEditComment}
          />

          <PostInfoReply
            item={item}
            fetchComment={fetchComment}
            onReplySubmit={onReplySubmit}
            value={item.subReplies}
          />

          <HrCommentLine />
        </CommentUl>
      ))}
    </div>
  );
};

export default PostInfoComment;
