import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CurrentPosition from "./CurrentPosition";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  FinActivity,
  etcActivity,
  myPostData,
  userActivity,
} from "../../Recoil/atoms";
import axios from "axios";
import { useParams } from "react-router-dom";

const CurrentPartTitle = styled.div`
  margin-top: 32px;
  margin-bottom: 23px;
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 30px;
  display: flex;
`;

const HrLine = styled.hr`
  color: #dbdbdb;
  margin-top: 25px;
`;

const ApplyComment = styled.p`
  margin-left: 30px;
  font-size: 13px;
  color: blue;
`;

const NonApplyComment = styled.p`
  margin-left: 30px;
  font-size: 13px;
  color: red;
`;

const PostInfoCurrent = () => {
  const data = useRecoilValue(myPostData);
  const [author, setAuthor] = useState(data.postUser);
  const [activity, setActivity] = useRecoilState(userActivity);
  const [finProject, setFinProject] = useRecoilState(FinActivity);
  const [etcProject, setEtcProject] = useRecoilState(etcActivity);
  const [isLoading, setIsLoading] = useState(true);

  const { postId } = useParams();

  const member = data.members.filter((item) => item.recruitField !== "LEADER");

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    await axios
      .get(
        `http://13.210.190.114:8000/data/userActivity.json`
        // .get(`http://13.125.111.131:8080/user/info/activity`,

        //   {
        //     headers: {
        //       // 로그인 후 받아오는 인증토큰값
        //       Authorization: window.localStorage.getItem("Authorization"),

        //       AuthorizationRefresh: window.localStorage.getItem(
        //         "AuthorizationRefresh"
        //       ),
        //     },
        //   }
      )
      .then((response) => {
        setActivity(response.data.approvedProjects.CONCURRENT);
        setFinProject(response.data.approvedProjects.FINISH);
        setEtcProject(response.data.etcProjects);
        setIsLoading(false);
      });
  };

  const userInfoArr = activity.find(
    (item) => parseInt(item.recruitmentId) === parseInt(postId)
  );

  const etcArr = etcProject.find(
    (item) => parseInt(item.recruitmentId) === parseInt(postId)
  );

  const fetchApply = async (id, applyToggle) => {
    const params = {
      position: id,
    };
    if (!applyToggle) {
      await axios.post(
        `http://13.125.111.131:8080/recruitment/${postId}/apply`,
        null,

        {
          responseType: "json",
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },

          params,
        }
      );
    }
    fetchList();
  };

  return (
    <div>
      {isLoading ? (
        ""
      ) : (
        <>
          <CurrentPartTitle>
            모집 현황
            {(etcArr?.status === "대기중" || etcArr?.status === "승인") && (
              <ApplyComment>* 지원완료된 프로젝트입니다</ApplyComment>
            )}
            {(etcArr?.status === "거절" || etcArr?.status === "강퇴") && (
              <NonApplyComment>* 지원할 수 없는 프로젝트입니다</NonApplyComment>
            )}
          </CurrentPartTitle>

          {member.map((item, index) => {
            return (
              <CurrentPosition
                author={author}
                key={index}
                item={item}
                userInfoArr={userInfoArr}
                fetchApply={fetchApply}
                etcArr={etcArr}
              />
            );
          })}

          <HrLine />
        </>
      )}
    </div>
  );
};

export default PostInfoCurrent;
