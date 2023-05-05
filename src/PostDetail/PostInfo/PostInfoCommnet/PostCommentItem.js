import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userInfo } from "../../../Recoil/atoms";

const CommentUserName = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 21px;
`;

const CommentTime = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #818181;
`;

const CommentEditBtn = styled.button`
  border: none;
  background-color: #fff;
  color: #707070;
  font-size: 12px;
`;

const CommentContent = styled.li`
  white-space: pre-line;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  margin: 10px 0;
`;

const CommentEditInput = styled.textarea`
  resize: none;
  width: 896px;
  border-radius: 10px;
  height: 62px;
  padding: 10px;
  :focus {
    outline: none;
  }
`;

const PostCommentItem = ({ item, onDeleteComment, onEditComment }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [curContent, setCurContent] = useState(item.content);
  const { postId } = useParams();
  const info = useRecoilValue(userInfo);
  console.log(info);

  const editCommentHandelr = (id, curContent) => {
    if (curContent.length === 0) {
      alert("수정할 내용을 입력해주세요!");
      return setCurContent(item.content);
    } else {
      onEditComment(id, curContent);
      setIsEdit(!isEdit);
    }
  };

  return (
    <div>
      <CommentUserName>{item.author}</CommentUserName>
      <CommentTime>{item.createdDate}</CommentTime>
      {info.userId === item.userId ? (
        <>
          {" "}
          {isEdit ? (
            <>
              <CommentEditBtn
                onClick={() => editCommentHandelr(item.replyId, curContent)}
              >
                수정완료
              </CommentEditBtn>
              <CommentEditBtn onClick={() => setIsEdit(!isEdit)}>
                취소
              </CommentEditBtn>
            </>
          ) : (
            <>
              <CommentEditBtn onClick={() => setIsEdit(!isEdit)}>
                수정
              </CommentEditBtn>
              <CommentEditBtn onClick={() => onDeleteComment(item.replyId)}>
                삭제
              </CommentEditBtn>
            </>
          )}
          {!isEdit ? (
            <CommentContent> {item.content} </CommentContent>
          ) : (
            <CommentContent>
              <CommentEditInput
                value={curContent}
                onChange={(e) => setCurContent(e.target.value)}
              />
            </CommentContent>
          )}
        </>
      ) : (
        <>
          <CommentContent> {item.content} </CommentContent>
        </>
      )}
    </div>
  );
};

export default PostCommentItem;
