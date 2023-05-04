import React, { useState } from "react";
import styled from "styled-components";
import { userInfo } from "../../../Recoil/atoms";
import { useRecoilValue } from "recoil";

const ReplyUserName = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 17px;
  line-height: 21px;
  margin-top: 10px;
`;

const ReplyTime = styled.li`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: #818181;
`;

const ReplyContent = styled.li`
  white-space: pre-line;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  margin: 10px 0;
`;

const ReplyEditBtn = styled.button`
  border: none;
  background-color: #fff;
  color: #707070;
  font-size: 12px;
`;

const ReplyEditInput = styled.textarea`
  resize: none;
  width: 896px;
  border-radius: 10px;
  height: 62px;
  padding: 10px;
  :focus {
    outline: none;
  }
`;

const PostReplyItem = ({ item, onDeleteReply, onEditReply }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [curContent, setCurContent] = useState(item.content);
  const info = useRecoilValue(userInfo);

  const editReplyHandelr = (id, curContent) => {
    if (curContent.length === 0) {
      alert("수정할 내용을 입력해주세요!");
      return setCurContent(item.content);
    } else {
      onEditReply(id, curContent);
      setIsEdit(!isEdit);
    }
  };
  return (
    <div>
      <ReplyUserName>{item.author}</ReplyUserName>
      <ReplyTime> {item.createdDate}</ReplyTime>
      {info.userId === item.userId ? (
        <>
          {" "}
          {isEdit ? (
            <>
              <ReplyEditBtn
                onClick={() => editReplyHandelr(item.replyId, curContent)}
              >
                수정완료
              </ReplyEditBtn>
              <ReplyEditBtn onClick={() => setIsEdit(!isEdit)}>
                취소
              </ReplyEditBtn>
            </>
          ) : (
            <>
              <ReplyEditBtn onClick={() => setIsEdit(!isEdit)}>
                수정
              </ReplyEditBtn>
              <ReplyEditBtn onClick={() => onDeleteReply(item.replyId)}>
                삭제
              </ReplyEditBtn>
            </>
          )}
          {!isEdit ? (
            <ReplyContent> {item.content} </ReplyContent>
          ) : (
            <ReplyContent>
              <ReplyEditInput
                value={curContent}
                onChange={(e) => setCurContent(e.target.value)}
              />
            </ReplyContent>
          )}
        </>
      ) : (
        <>
          {" "}
          <ReplyContent> {item.content} </ReplyContent>{" "}
        </>
      )}
    </div>
  );
};

export default PostReplyItem;
