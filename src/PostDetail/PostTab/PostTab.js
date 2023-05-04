import React, { useState } from "react";
import styled from "styled-components";
import Notice from "../Notice/Notice";
import Schedule from "../Schedule/Schedule";
import PostInfo from "../PostInfo/PostInfo";
import PostAdmin from "../PostAdmin/PostAdmin";
import { useRecoilValue } from "recoil";
import {
  FinActivity,
  myPostData,
  userActivity,
  userInfo,
} from "../../Recoil/atoms";
import { useParams } from "react-router-dom";
import { BiLock } from "react-icons/bi";

const Tabwrap = styled.div`
  border-left: none;
  border-right: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const TabList = styled.div`
  width: 25%;
  line-height: 50px;
  text-align: center;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  border-right: 1px solid #d9d9d9;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  color: #000;

  &:last-child {
    border-right: none;
  }

  &.active_tab {
    border-bottom: none;
    background-color: #5d5fef;
    color: #fff;
  }
`;

const PostTabContent = styled.div`
  padding: 0 5%;
`;

const PostTab = () => {
  const [activeTabId, setActiveTabId] = useState(0);
  const info = useRecoilValue(userInfo);
  const data = useRecoilValue(myPostData);
  const activity = useRecoilValue(userActivity);
  const finProject = useRecoilValue(FinActivity);
  const { postId } = useParams();
  const userInfoArr = activity.find(
    (item) => parseInt(item.recruitmentId) === parseInt(postId)
  );
  const finInfoArr = finProject.find(
    (item) => parseInt(item.recruitmentId) === parseInt(postId)
  );

  const [user, setUser] = useState(data.postUser);
  const tabArr = [
    {
      tabTitle: <div onClick={() => onClickTab(0)}>정보</div>,
      tabContent: (
        <div>
          <PostInfo />
        </div>
      ),
    },
    {
      tabTitle: (
        <>
          {user.userId === info.userId ||
          parseInt(userInfoArr?.recruitmentId) === parseInt(postId) ? (
            <div onClick={() => onClickTab(1)}>회의시간 조사</div>
          ) : (
            <div>
              <BiLock />
              회의시간 조사
            </div>
          )}
        </>
      ),
      tabContent: <Schedule />,
    },
    {
      tabTitle: (
        <>
          {user.userId === info.userId ||
          parseInt(userInfoArr?.recruitmentId) === parseInt(postId) ||
          parseInt(finInfoArr?.recruitmentId) === parseInt(postId) ? (
            <div onClick={() => onClickTab(2)}>공지사항</div>
          ) : (
            <div>
              <BiLock />
              공지사항
            </div>
          )}
        </>
      ),
      tabContent: <Notice />,
    },
    {
      tabTitle: (
        <>
          {user.userId === info.userId ? (
            <div onClick={() => onClickTab(3)}>관리자</div>
          ) : (
            <div>
              {" "}
              <BiLock />
              관리자
            </div>
          )}
        </>
      ),
      tabContent: <PostAdmin />,
    },
  ];

  const onClickTab = (tabId) => {
    setActiveTabId(tabId);
  };
  return (
    <div>
      <Tabwrap>
        {tabArr.map((tab, index) => {
          return (
            <TabList
              key={index}
              className={activeTabId === index && "active_tab"}
            >
              {tab.tabTitle}
            </TabList>
          );
        })}
      </Tabwrap>
      <PostTabContent>{tabArr[activeTabId].tabContent}</PostTabContent>
    </div>
  );
};

export default PostTab;
