import React, { useState } from "react";
import styled from "styled-components";
import Dropdownbutton from "./Dropdownbutton";
import { ImCheckmark, ImCross } from "react-icons/im";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userStation } from "../../Recoil/atoms";
import KakaoMap from "../../Common/KakaoMap";
import ModalLocation from "./ModalLocation";

const NoticeListWrap = styled.div`
  width: 1045px;
  height: 143px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  margin-top: 32px;

  &.vote_done {
    background-color: #e9e9e9;
  }
`;

const NoticeListHeader = styled.div`
  padding: 10px;
  padding-left: 2%;
  display: flex;
  justify-content: space-between;
`;

const NoticeListDate = styled.span`
  color: #6c6b6b;
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  display: flex;
`;

const RecommendLoc = styled.span`
  margin-left: 25px;
`;

const NoticeDropdownDiv = styled.div`
  position: absolute;
  left: 1080px;
`;

const NoticeListContent = styled.div`
  padding: 10px;
  padding-left: 2%;
  font-family: "Inter";
  font-style: normal;
  font-size: 18px;
  height: 50px;
`;

const NoticeEditInput = styled.textarea`
  resize: none;
  width: 1000px;
  height: 50px;
`;

const NoticeEditBtn = styled.button`
  border: none;
  background-color: #fff;
  color: #707070;
  font-size: 12px;
`;

const VotingBtnDiv = styled.div`
  display: flex;
  justify-content: end;
  padding-right: 10px;
`;

const VotingPositive = styled.button`
  border: none;
  background: none;
  color: #63b730;
  cursor: pointer;
  margin-right: 5px;
`;

const VotingNegative = styled.button`
  border: none;
  background: none;
  color: #ff4242;
  cursor: pointer;
`;

const VoteFinishNotice = styled.p`
  position: relative;
  bottom: 13px;
  left: 5px;
`;

const LocationBtn = styled.button`
  border-radius: 5px;
  background-color: #f2fefd;
  border: none;
  font-weight: bold;
  padding: 3px 12px;
`;
const NoticeItem = ({
  newnotice,
  onNoticeDelete,
  onEditNotice,
  onVoteFinish,
  fetchAttend,
  author,
  fetchNonAttend,
  fetchUpdateAttend,
  fetchFinishVote,
}) => {
  const [date, setDate] = useState(newnotice.createdAt);
  const [isEdit, setIsEdit] = useState(false);
  const [isVote, setIsVote] = useState(true);
  const [curContent, setCurContent] = useState(newnotice.content);
  const { postId } = useParams();
  const Location = useRecoilValue(userStation);
  const [isModal, setIsModal] = useState(false);

  const AttendanceHandler = (noticeId) => {
    fetchAttend(noticeId);
  };

  const NoAttendanceHandler = (noticeId) => {
    fetchNonAttend(noticeId);
  };

  const isEditSetting = (EditValue) => {
    setIsEdit(EditValue);
  };

  const editNoticeHandler = (id, newContent) => {
    if (newContent.length === 0) {
      alert("수정할 내용을 입력해주세요!");
      setCurContent(newnotice.content);
      return;
    }
    onEditNotice(id, newContent);
    setIsEdit(!isEdit);
  };

  const voteFinishHandler = (id, votestate) => {
    onVoteFinish(id, votestate);
    setIsVote(!isVote);
  };

  return (
    <>
      {/* 글쓴이면 true / 글쓴이가 아니면 false 작용 */}
      {author ? (
        <>
          {/* 글쓴이인 경우 */}
          <NoticeListWrap
            // 투표마감버튼을 눌렀거나 혹은 공지글의 투표 마감값이(finishVote) true인 공지글일때
            className={!isVote || newnotice.finishVote ? "vote_done" : ""}
          >
            <NoticeListHeader>
              <div>
                <NoticeListDate>
                  {date}
                  {/* 투표마감버튼을 눌렀거나 혹은 공지글의 투표 마감값이(fisihsVote) true인 공지글일때 */}
                  {(!isVote || newnotice.finishVote) && (
                    <RecommendLoc>
                      <LocationBtn onClick={() => setIsModal(!isModal)}>
                        추천 지역
                      </LocationBtn>
                    </RecommendLoc>
                  )}
                </NoticeListDate>
              </div>
              <NoticeDropdownDiv>
                {/* 투표마감버튼을 누르지않은 상태, 현재 글쓴이인 경우로 author에 true를 전달 */}
                <Dropdownbutton
                  isVote={isVote}
                  author={true}
                  newnotice={newnotice}
                  onNoticeDelete={onNoticeDelete}
                  isEditSetting={isEditSetting}
                  voteFinishHandler={voteFinishHandler}
                  fetchUpdateAttend={fetchUpdateAttend}
                  fetchFinishVote={fetchFinishVote}
                />
              </NoticeDropdownDiv>
            </NoticeListHeader>
            {/* 수정 중이 아닐 때 */}
            {!isEdit ? (
              <>
                <NoticeListContent>{newnotice.content}</NoticeListContent>
              </>
            ) : (
              // 수정 중 일 때
              <NoticeListContent>
                <NoticeEditInput
                  value={curContent}
                  onChange={(e) => setCurContent(e.target.value)}
                />
                <NoticeEditBtn
                  onClick={() =>
                    editNoticeHandler(newnotice.noticeId, curContent)
                  }
                >
                  수정완료
                </NoticeEditBtn>
                <NoticeEditBtn onClick={() => setIsEdit(!isEdit)}>
                  취소
                </NoticeEditBtn>
              </NoticeListContent>
            )}
            {/* 투표기능이 있는글이고 수정중이 아니고 투표마감버튼 누르지않았고 공지글의 투표 마감값이(fisihsVote) false일때 */}
            {newnotice.checkVote &&
              !isEdit &&
              isVote &&
              !newnotice.finishVote && (
                <VotingBtnDiv>
                  <VotingPositive
                    onClick={() => AttendanceHandler(newnotice.noticeId)}
                  >
                    참여 <ImCheckmark />
                  </VotingPositive>
                  <VotingNegative
                    onClick={() => NoAttendanceHandler(newnotice.noticeId)}
                  >
                    불참여 <ImCross />
                  </VotingNegative>
                </VotingBtnDiv>
              )}
            {/* 투표마감버튼을 눌렀거나 공지글의 투표 마감값이(fisihsVote) true일때 */}
            {(!isVote || newnotice.finishVote) && (
              <VoteFinishNotice>투표가 마감되었습니다</VoteFinishNotice>
            )}
          </NoticeListWrap>
        </>
      ) : (
        <>
          {/* 글쓴이가 아닐 때 */}
          {/* 투표마감버튼을 눌렀거나 혹은 공지글의 투표 마감값이(finishVote) true인 공지글일때 */}
          <NoticeListWrap
            className={!isVote || newnotice.finishVote ? "vote_done" : ""}
          >
            <NoticeListHeader>
              <div>
                {/* 투표마감버튼을 눌렀거나 혹은 공지글의 투표 마감값이(finishVote) true인 공지글일때 */}
                <NoticeListDate>
                  {date}
                  {(!isVote || newnotice.finishVote) && (
                    <RecommendLoc>
                      <LocationBtn onClick={() => setIsModal(!isModal)}>
                        추천 지역
                      </LocationBtn>
                    </RecommendLoc>
                  )}
                </NoticeListDate>
              </div>
              <NoticeDropdownDiv>
                {/* 현재 글쓴이가 아니므로 author에 false를 전달 */}
                <Dropdownbutton
                  author={false}
                  newnotice={newnotice}
                  onNoticeDelete={onNoticeDelete}
                  isEditSetting={isEditSetting}
                  voteFinishHandler={voteFinishHandler}
                />
              </NoticeDropdownDiv>
            </NoticeListHeader>

            <>
              <NoticeListContent>{newnotice.content}</NoticeListContent>
            </>
            {/* 투표기능이 있는글이고 공지글의 투표 마감값이(fisihsVote) false일때  */}
            {newnotice.checkVote && !newnotice.finishVote && (
              <VotingBtnDiv>
                <VotingPositive
                  onClick={() => AttendanceHandler(newnotice.noticeId)}
                >
                  참여 <ImCheckmark />
                </VotingPositive>
                <VotingNegative
                  onClick={() => NoAttendanceHandler(newnotice.noticeId)}
                >
                  불참여 <ImCross />
                </VotingNegative>
              </VotingBtnDiv>
            )}
            {/* 투표마감버튼을 눌렀거나  공지글의 투표 마감값이(fisihsVote) true일때*/}
            {(!isVote || newnotice.finishVote) && (
              <VoteFinishNotice>투표가 마감되었습니다</VoteFinishNotice>
            )}
          </NoticeListWrap>
        </>
      )}

      <ModalLocation isModal={isModal} newnotice={newnotice} />
    </>
  );
};

export default NoticeItem;
