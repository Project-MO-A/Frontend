import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostComponent from "../Common/PostComponent";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 800px;
`;

const EmptyPost = styled.div`
  display: flex;
  width: 650px;
  height: 300px;
  background: #e8e8e8;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 550;
`;

const ComponentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, calc((100% - 40px) / 3))
  );
  grid-gap: 10px;
`;

const MyPostList = () => {
  const [myPost, setMyPost] = useState([]);

  const getPostList = () => {
    axios
    .get("http://localhost:3000/data/userWriting.json", {
      //.get("http://13.125.111.131:8080/user/info/writing", {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },
      })
      .then((response) => {
        setMyPost(response.data.writing);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  useEffect(() => {
    getPostList();
  }, []);

  return (
    <Wrapper>
      <h3>내 작성글</h3>
      {myPost?.length < 1 ? (
        <EmptyPost>글을 작성해보세요!</EmptyPost>
      ) : (
        <ComponentWrapper>
          {myPost?.map((post, index) => (
            <PostComponent
              key={index}
              type="MyPost"
              id={post.id}
              title={post.title}
              author={post.author}
              category={post.category}
              tags={post.tags}
              recruitStatus={post.recruitStatus}
              date={post.createdDate}
              replyCount={post.replyCount}
              getPostList={getPostList}
            />
          ))}
        </ComponentWrapper>
      )}
    </Wrapper>
  );
};

export default MyPostList;