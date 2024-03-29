import React, { useState } from "react";
import styled from "styled-components";
import PostTab from "./PostTab/PostTab";
import PostTitle from "./PostTitle";
import { useRecoilState } from "recoil";
import { myPostData, titleState, userInfo } from "../Recoil/atoms";
import { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PostDetailDiv = styled.div`
  padding-bottom: 5%;
`;

const PostDetail = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useRecoilState(myPostData);
  const [titles, setTitles] = useRecoilState(titleState);
  const [Info, setInfo] = useRecoilState(userInfo);
  const { postId } = useParams();
  const [user, setUser] = useState(post.userId);

  const fetchInfo = async () => {
    await axios
      .get(
        "http://13.210.190.114:8000/data/userData.json"
        // .get("http://13.125.111.131:8080/user/info/profile",
        // {
        //   headers: {
        //     Authorization: window.localStorage.getItem("Authorization"),

        //     AuthorizationRefresh: window.localStorage.getItem(
        //       "AuthorizationRefresh"
        //     ),
        //   },
        // })
      )
      .then((response) => {
        if (response.data) {
          const currentInfo = response.data.find(
            (item) => parseInt(item.userId) === parseInt(1)
          );
          setInfo(currentInfo);
        }
      });
  };

  useEffect(() => {
    axios
      .get(
        `http://13.210.190.114:8000/data/postDetail.json`
        // .get(`http://13.125.111.131:8080/recruitment/${postId}`,
        // {
        //   headers: {
        //     Authorization: window.localStorage.getItem("Authorization"),

        //     AuthorizationRefresh: window.localStorage.getItem(
        //       "AuthorizationRefresh"
        //     ),
        //   },
        // }
      )
      .then((response) => {
        if (response.data.detail) {
          const currentData = response.data.detail.find(
            (item) => parseInt(item.postId) === parseInt(postId)
          );

          setPost(currentData.recruitInfo);
          setIsLoading(false);
          setTitles(currentData.recruitInfo.state);
        }

        // setPost(response.data.recruitInfo);
        // setIsLoading(false);
        // setTitles(response.data.recruitInfo.state);
      });

    fetchInfo();
  }, [setPost, setTitles, postId]);

  return (
    <>
      {isLoading ? (
        ""
      ) : (
        <PostDetailDiv>
          <PostTitle />

          <PostTab />
        </PostDetailDiv>
      )}
    </>
  );
};

export default PostDetail;
