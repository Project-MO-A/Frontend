import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PostReplyItem from "./PostReplyItem";
import axios from "axios";
import { useParams } from "react-router-dom";

const ReplyBtnDiv = styled.div`
  padding-left: 1%;
`;

const ReplyBtn = styled.button`
  background-color: #d9d9d9;
  width: 54px;
  border: none;
  border-radius: 10px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
`;

const ReplyForm = styled.form`
  padding-left: 1%;
  margin-top: 10px;
`;

const ReplyInput = styled.textarea`
  resize: none;
  width: 500px;
  height: 50px;
  padding: 10px;
  border-radius: 10px;
  border: 3px solid #d9d9d9;
  :focus {
    outline: none;
  }
`;

const ReplyAddBtnWrap = styled.div`
  width: 520px;
  display: flex;
  justify-content: end;
`;

const ReplyAddBtn = styled.button`
  margin-top: 7px;
  background-color: #d9d9d9;
  width: 54px;
  border: none;
  border-radius: 10px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
`;

const ReplyUl = styled.ul`
  list-style: none;
`;

const PostInfoReply = ({ item, onReplySubmit, value, fetchComment }) => {
  const [reply, setReply] = useState("");
  const { postId } = useParams();
  const [newReply, setNewReply] = useState([]);
  const [replyToggle, setReplyToggle] = useState(false);

  useEffect(() => {
    setNewReply(value);
  }, [value]);

  const replySubmitHandle = async (e) => {
    e.preventDefault();
    if (reply.length === 0) {
      alert("답글 내용을 입력해주세요!");
    } else {
      await onReplySubmit(reply, item.replyId);
      setReply("");
    }
  };

  const onReplyToggle = () => {
    setReplyToggle(!replyToggle);
  };

  const onDeleteReply = async (id) => {
    if (window.confirm("답글을 삭제하시겠습니까?")) {
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

    setNewReply(newReply.filter((it) => it.replyId !== id));
  };

  const onEditReply = (id, newContent) => {
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
    setNewReply(
      newReply.map((item) =>
        item.replyId === id ? { ...item, content: newContent } : item
      )
    );
  };

  return (
    <div>
      <ReplyBtnDiv>
        <ReplyBtn onClick={onReplyToggle}>답글</ReplyBtn>
      </ReplyBtnDiv>
      {replyToggle && (
        <ReplyForm onSubmit={replySubmitHandle}>
          <ReplyInput
            placeholder="답글을 입력해주세요"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <ReplyAddBtnWrap>
            <ReplyAddBtn>확인</ReplyAddBtn>
          </ReplyAddBtnWrap>
        </ReplyForm>
      )}

      {newReply?.map((item) => (
        <ReplyUl key={item.replyId}>
          <PostReplyItem
            item={item}
            onDeleteReply={onDeleteReply}
            onEditReply={onEditReply}
          />
        </ReplyUl>
      ))}
    </div>
  );
};

export default PostInfoReply;
