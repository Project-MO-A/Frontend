import React, { useEffect } from "react";
import styled from "styled-components";
import { useRecoilValue } from "recoil";
import { myPostData, titleState } from "../Recoil/atoms";
import { useState } from "react";
import TransAddress from "./UserInfo/TransAddress";
import axios from "axios";

const PostTitlewrap = styled.div`
  margin-top: 34px;
`;

const PostTitleHeader = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  text-align: center;
`;

const PostRecruitwrap = styled.div`
  margin-top: 25px;
  margin-bottom: 35px;
  text-align: center;
`;

const RecruitPart = styled.span`
  color: #818181;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
`;

const RecruitState = styled.span`
  margin-left: 15px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 20px;

  &.recruiting {
    ::after {
      content: "모집 중";
    }
    color: #63b730;
  }

  &.recruitDone {
    color: red;
    ::after {
      content: "모집 완료";
    }
  }

  &.projectDone {
    color: blue;
    ::after {
      content: "프로젝트 완료";
    }
  }
`;

const PostTagsDiv = styled.div`
  margin: 10px 0 auto;
`;

const PostTags = styled.span`
  margin-right: 15px;
  color: gray;
`;

const PreferLoc = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;

const PostTitle = () => {
  const data = useRecoilValue(myPostData);
  const titles = useRecoilValue(titleState);
  const [user, setUser] = useState(data.postUser);
  const [Author, setAuthor] = useState(0);

  useEffect(() => {
    fetchPostUserInfo();
  }, []);

  const fetchPostUserInfo = async () => {
    // const params = {
    //   userId: user.userId,
    // };
    await axios
      .get(
        "http://localhost:3000/data/userData.json"
        // .get("http://13.125.111.131:8080/user/info/profile",
        // {
        //   headers: {
        //     Authorization: window.localStorage.getItem("Authorization"),

        //     AuthorizationRefresh: window.localStorage.getItem(
        //       "AuthorizationRefresh"
        //     ),
        //   },
        //
        // params
      )
      .then((response) => {
        if (response.data) {
          const currentAuthor = response.data.map(
            (item) => parseInt(item.userId) === parseInt(user.userId)
          );
          setAuthor(currentAuthor);
        }

        // setAuthor(response.data);
      });
  };

  return (
    <div>
      <PostTitlewrap>
        <PostTitleHeader>{data.title}</PostTitleHeader>
      </PostTitlewrap>
      <PostRecruitwrap>
        <RecruitPart>{user.nickname}</RecruitPart>
        <RecruitState
          className={
            (titles === 1 && "recruiting") ||
            (titles === 2 && "recruitDone") ||
            (titles === 3 && "projectDone")
          }
        ></RecruitState>
        <PostTagsDiv>
          {data.tags.map((item, index) => (
            <PostTags key={index}>#{item}</PostTags>
          ))}
        </PostTagsDiv>
        <PreferLoc>
          선호지역 :
          <TransAddress
            lat={Author.locationLatitude}
            lng={Author.locationLongitude}
          />
        </PreferLoc>
      </PostRecruitwrap>
    </div>
  );
};

export default PostTitle;
