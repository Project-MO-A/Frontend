import React from "react";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { myPostData } from "../../Recoil/atoms";

const IntroductionDiv = styled.div`
  white-space: pre-wrap;
  padding-left: 3%;
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 24px;
`;

const HrLine = styled.hr`
  color: #dbdbdb;
  margin-top: 25px;
`;

const PostInfoAbout = () => {
  const data = useRecoilValue(myPostData);

  return (
    <div>
      <h1>프로젝트 소개</h1>
      <div>
        <IntroductionDiv dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
      <HrLine />
    </div>
  );
};

export default PostInfoAbout;
