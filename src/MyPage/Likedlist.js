import React, { useState, useEffect } from "react";
import styled from "styled-components";
import PostComponent from "../component/PostComponent";

const Wrapper = styled.div`
  height: 92vh;
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  h3{
    font-size:23px;
  }
`;

const EmptyPost = styled.div`
  display: flex;
  width: 650px;
  height: 300px;
  background: #E8E8E8;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  margin-left: 30px;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 550;
`;

const ComponentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > * {
    width: calc((100 - 2 * 10px) / 3); 
    margin: 10px; 
  }
`;

const Likedlist = () => {
  const [likedPost, setLikedPost] = useState([]);

  useEffect(() => {
    fetch("http://13.125.111.131:8080/user/info/concern", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
      }
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setLikedPost(data.writing);
    })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <Wrapper>
      <Content>
        <h3>내 관심글</h3>
        {likedPost?.length < 1 ? <EmptyPost>관심글을 등록해보세요!</EmptyPost> :
            <ComponentWrapper>
              {likedPost?.map((post, index)=> (
              <PostComponent key={index} 
              type="MyLike"
              title={post.title}
              author={post.author} category={post.category} tags={post.tags} recruitStatus={post.recruitStatus} date={post.createdDate}replyCount={post.replyCount}
              />
            ))}
            </ComponentWrapper>
        }
        
      </Content>
    </Wrapper>
  );
};

export default Likedlist;