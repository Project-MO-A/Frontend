import React from "react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { titleState, userInfo } from "../../Recoil/atoms";
const CurrentPartWrap = styled.div`
  padding-left: 3%;
  display: flex;
  align-items: center;
  height: 35px;
`;

const PartSection = styled.p`
  width: 130px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
`;

const PartSectionCount = styled.p`
  width: 37px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
`;

const PartApply = styled.button`
  width: 120px;
  height: 28px;

  margin-left: 25px;
  border: none;
  border-radius: 2px;
  color: #fff;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  background-color: #66b933;
  cursor: pointer;
  &::after {
    content: "지원하기";
  }

  &.applying {
    cursor: no-drop;
    background-color: gray;
    &::after {
      content: "지원완료";
    }
  }

  &.applyDone {
    cursor: no-drop;
    background-color: #ff5e5e;
    &::after {
      content: "모집완료";
    }
  }
`;

const CurrentPosition = ({
  item,
  index,
  userInfoArr,
  author,
  fetchApply,
  etcArr,
}) => {
  const [applyToggle, setApplyToggle] = useState(false);
  const info = useRecoilValue(userInfo);
  const title = useRecoilValue(titleState);

  const applyHandler = (recruitField) => {
    setApplyToggle(!applyToggle);
    fetchApply(recruitField, applyToggle);
  };

  return (
    <CurrentPartWrap key={index}>
      {/* 모집글 작성자의 id와 현재 로그인한 유저의 id가 일치할때
          즉, 작성자 본인일 때  -> 지원하기 버튼 비활성화*/}
      {author.userId === info.userId ? (
        <>
          <PartSection>{item.recruitField}</PartSection>
          <PartSectionCount>
            {item.currentCount}/{item.totalCount}
          </PartSectionCount>
          <PartApply
            className={item.currentCount === item.totalCount && "applyDone"}
            disabled={item.currentCount === item.totalCount && true}
          />
        </>
      ) : (
        <>
          {/* 해당 프로젝트 지원현황이 승인 또는 대기중 일때  
              -> 지원하기 버튼 비활성화 및 지원중인 포지션의 버튼을 지원완료로 전환*/}
          {etcArr?.status === "승인" || etcArr?.status === "대기중" ? (
            <>
              {" "}
              <PartSection>{item.recruitField}</PartSection>
              <PartSectionCount>
                {item.currentCount}/{item.totalCount}
              </PartSectionCount>
              <PartApply
                className={
                  (item.recruitField === etcArr?.field && "applying") ||
                  (item.currentCount === item.totalCount && "applyDone")
                }
                disabled={true}
              />
            </>
          ) : (
            // 해당 프로젝트 지원 현황이 거절 또는 강퇴
            // 또는 해당 프로젝트 포지션 이름과 유저가 활동중인 프로젝트의 포지션이름이 일치할 때
            // 또는 현재 모집글 상태가 모집완료(2) 또는 프로젝트완료(3) 일때
            // -> 지원하기 버튼 삭제
            <>
              {etcArr?.status === "거절" ||
              etcArr?.status === "강퇴" ||
              item.recruitField === userInfoArr?.field ||
              title === 2 ||
              title === 3 ? (
                <>
                  {" "}
                  <PartSection>{item.recruitField}</PartSection>
                  <PartSectionCount>
                    {item.currentCount}/{item.totalCount}
                  </PartSectionCount>
                </>
              ) : (
                <>
                  {/* 해당 사항 없을 때 
                      -> 지원하기 버튼 활성화 및 지원가능 */}
                  <PartSection>{item.recruitField}</PartSection>
                  <PartSectionCount>
                    {item.currentCount}/{item.totalCount}
                  </PartSectionCount>
                  <PartApply
                    onClick={() => {
                      applyHandler(item.recruitField);
                    }}
                    className={
                      applyToggle
                        ? "applying"
                        : "" || item.currentCount === item.totalCount
                        ? "applyDone"
                        : ""
                    }
                    disabled={item.currentCount === item.totalCount && true}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </CurrentPartWrap>
  );
};

export default CurrentPosition;
