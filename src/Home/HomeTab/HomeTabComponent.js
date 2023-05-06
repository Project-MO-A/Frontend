import styled from "styled-components";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import PostComponent from "../../Common/PostComponent";

const PostContainerWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(300px, calc((100% - 40px) / 3))
  );
  grid-gap: 10px;
  width: 150%;
  align-items: center;
  justify-items: center;
`;

const EmptyContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  text-align: center;
  height: 100px;
  width: 800px;
  font-size: 20px;
  font-weight: 650;
  line-height: 2;
`;

const HomeTabComponent = ({
  type,
  onClickCategory,
  onClickTag,
  searchData,
}) => {
  const [postData, setPostData] = useState([]);
  const [comment, setComment] = useState(null);
  const [count, setCount] = useState(6);
  const [target, setTarget] = useState("");

  const checkIntersect = useCallback(
    ([entry], observer) => {
      if (entry.isIntersecting) {
        setCount((value) => {
          if (postData.length >= value + 1) return value + 3;
          else return value;
        });
      }
    },
    [postData.length]
  );

  useEffect(() => {
    let observer;
    if (target) {
      observer = new IntersectionObserver(checkIntersect, Option);
      observer.observe(target);
    }
    return () => observer && observer.disconnect();
  }, [target, checkIntersect]);

  useEffect(() => {
    if (searchData) {
      setPostData(searchData);
      if (searchData.length === 0) {
        setComment(
          <p>
            검색 결과가 없습니다
            <br />
            새로운 글을 등록해보세요!
          </p>
        );
      }
    } else {
      let headers = {};
      let url = "";
      switch (type) {
        case "new":
          setComment(
            <p>
              현재 새로운 글이 없습니다 <br />
              새로운 글을 등록해보세요!
            </p>
          );
          url = `/recruitment/search/slice?size=200&sort=createdDate,desc`;
          break;
        case "recruiting":
          setComment(
            <>
              <p>
                현재 모집 중인 글이 없습니다
                <br />
                새로운 글을 등록해보세요!
              </p>
            </>
          );
          url = `/recruitment/search/page?&size=200&stateCode=1`;
          break;
        case "recommend":
          setComment(<p>추천 글은 관심 태그 등록 후 이용할 수 있습니다!</p>);
          headers = {
            Authorization: localStorage.getItem("Authorization"),
            AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
          };
          url = "/home/recruitment/recommend";
          break;
        case "popular":
          setComment(
            <p>
              현재 인기글이 없습니다 <br />
              새로운 글을 등록해보세요!
            </p>
          );
          url = "/home/recruitment/popular";
          break;
        default:
          break;
      }

      axios
        .get('http://localhost:3000/data/postDetail.json', { headers })
        //.get("http://13.125.111.131:8080" + url, { headers })
        .then((response) => {
          //날짜 순 정렬
          setPostData(response.data.detail.sort((a, b) => new Date(b.recruitInfo.createdDate) - new Date(a.recruitInfo.createdDate)));
        })
        .catch((error) => {
          setPostData([]);
          console.log(error);
        });
    }
  }, [type, searchData, count]);

  return (
    <>
      {postData.length > 0 ? (
        <PostContainerWrapper>
          {postData.slice(0, count).map((post, index) => (
            <PostComponent
              key={index}
              type="main"
              id={post.postId}
              title={post.recruitInfo.title}
              author={post.recruitInfo.postUser.nickname}
              category={post.recruitInfo.category}
              tags={post.recruitInfo.tags}
              recruitStatus={post.recruitInfo.state}
              date={post.recruitInfo.createdDate}
              replyCount={post.repliesInfo.count || 0}
              onClickCategory={onClickCategory}
              onClickTag={onClickTag}
            />
          ))}
          <div ref={setTarget}></div>
        </PostContainerWrapper>
      ) : (
        <EmptyContent>{comment}</EmptyContent>
      )}
    </>
  );
};

export default HomeTabComponent;
