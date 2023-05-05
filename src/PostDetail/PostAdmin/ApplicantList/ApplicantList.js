import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ApplicantListItem from "./ApplicantListItem";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { myPostData, userActivity } from "../../../Recoil/atoms";

const ApplicantListDiv = styled.div`
  margin-bottom: 70px;
`;

const ApplicantListBox = styled.div`
  margin-left: 30px;
`;

const ApplicantNull = styled.div`
  background-color: #e8e8e8;
  width: 1000px;
  padding: 30px 0;
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
`;

const ApplicantDiv = styled.div`
  background-color: #e8e8e8;
  width: 1000px;
  display: flex;
  padding: 30px 0;
  flex-wrap: wrap;
  gap: 50px 0;
`;

const AppliCantWrap = styled.div`
  margin: 0 auto;
  display: flex;
  border: 1px solid gray;
  border-radius: 5px;
  width: 800px;
`;
const ApplycantPosition = styled.h4`
  padding-left: 40px;
  p {
    font-size: 20px;
    font-weight: 650;
  }
`;

const ApplycantItemDiv = styled.div`
  padding-bottom: 20px;
  margin-left: 100px;
`;

const ApplicantList = () => {
  const [toggle, setToggle] = useState(false);
  const { postId } = useParams();
  const [applyMember, setApplyMember] = useState([]);
  const [members, setMembers] = useRecoilState(userActivity);
  const [post, setPost] = useRecoilState(myPostData);

  useEffect(() => {
    fetchApplicant();
  }, []);

  const fetchApplicant = async () => {
    const params = {
      statusCode: 1,
    };

    await axios
      .get(
        `http://localhost:3000/data/postApplicant.json`
        // .get(`http://13.125.111.131:8080/recruitment/${postId}/apply/members`,
        //  {
        //   headers: {
        //     // 로그인 후 받아오는 인증토큰값
        //     Authorization: window.localStorage.getItem("Authorization"),

        //     AuthorizationRefresh: window.localStorage.getItem(
        //       "AuthorizationRefresh"
        //     ),
        //   },
        //   params,
        // })
      )
      .then((response) => {
        if (response.data.list) {
          const currentData = response.data.list.find(
            (item) => parseInt(item.postId) === parseInt(postId)
          );

          setApplyMember(currentData.applyInfo);
        }
        // setApplyMember(response.data.value);
      });
  };

  const fetchMember = async () => {
    await axios
      .get(
        `http://13.125.111.131:8080/recruitment/${postId}/approved/members`,
        {
          headers: {
            // 로그인 후 받아오는 인증토큰값
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
        }
      )
      .then((response) => {
        setMembers(response.data);
        console.log(response.data);
      });
  };

  const fetchPost = async () => {
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
        setPost(response.data.recruitInfo);

        console.log(response.data);
      });
  };

  const fetchApproved = async (applyId) => {
    const params = {
      statusCode: 2,
    };
    if (window.confirm("지원요청을 수락하시겠습니까?")) {
      await axios.post(
        `http://13.125.111.131:8080/recruitment/${postId}/apply/${applyId}`,
        null,
        {
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
      fetchApplicant();
      fetchMember();
      fetchPost();
    }
  };

  const fetchRefuse = async (applyId) => {
    const params = {
      statusCode: 3,
    };
    if (window.confirm("지원요청을 거부하시겠습니까?")) {
      await axios.post(
        `http://13.125.111.131:8080/recruitment/${postId}/apply/${applyId}`,
        null,
        {
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
      fetchApplicant();
    }
  };

  return (
    <ApplicantListDiv>
      <h1>지원자 현황</h1>

      <ApplicantListBox>
        <ApplicantDiv>
          {applyMember.length >= 1 ? (
            <AppliCantWrap>
              <ApplycantPosition>
                {applyMember.map((item, index) => (
                  <React.Fragment key={index}>
                    <p> {item.recruitField}</p>

                    <ApplycantItemDiv>
                      <ApplicantListItem
                        item={item}
                        fetchApproved={fetchApproved}
                        fetchRefuse={fetchRefuse}
                      />
                    </ApplycantItemDiv>
                  </React.Fragment>
                ))}
              </ApplycantPosition>
            </AppliCantWrap>
          ) : (
            <ApplicantNull>현재 지원자가 없습니다</ApplicantNull>
          )}
        </ApplicantDiv>
      </ApplicantListBox>
    </ApplicantListDiv>
  );
};

export default ApplicantList;
