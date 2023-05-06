import React, { useState, useEffect, lazy, Suspense } from "react";
import styled from "styled-components";
import profileImg from "../Common/profileImg.png";
import UserPopularity from "../Common/UserPopularity";

const Profile = lazy(() => import("./Profile"));
const Likedlist = lazy(() => import("./Likedlist"));
const MyActivity = lazy(() => import("./MyActivity"));
const MyPost = lazy(() => import("./MyPostList"));
const Setting = lazy(() => import("./Setting"));

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.8fr;
`;

const SidebarContainer = styled.div`
  flex: 1;
  align-self: start;
  height: 100%;
`;

const ContentContainer = styled.div`
  flex: 2;
  align-self: end;
  margin-left: 50px;
  margin-top: 10px;
  h3 {
    font-size: 23px;
  }
`;

const SidebarTab = styled.div`
  display: flex;
  border-right: 1.5px solid #e0e0e0;
  box-shadow: 2.5px 0 5px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
  width: 230px;
  height: 100%;
  padding-bottom: 100px;
  flex-direction: column;
  align-content: center;
  align-items: center;
  padding: 16px;
  font-weight: 650;
  font-size: 19px;
  a,
  a:visited {
    text-decoration: none;
    color: #292929;
  }
  h3 {
    display: flex;
    margin: 0px;
    font-size: 20px;
  }
`;
const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 100%;
  margin-bottom: 10px;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
  width: 200px;
  flex-direction: column;
  color: #292929;
  .active {
    color: #5d5fef;
    text-decoration: underline;
  }
  p {
    margin-bottom: 18px;
    margin-top: 18px;
    cursor: pointer;
  }
`;

const TabList = styled.div`
  width: 137px;
  height: 55px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b2b2b2;
  font-size: 22px;
  font-weight: 600;
  cursor: pointer;
  &.active {
    font-weight: 650;
    z-index: 1;
  }
`;
const PopularityContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MyPage = () => {
  const [popularity, setPopularity] = useState(0);
  const [getProfileImg, setProfileImg] = useState(profileImg);

  useEffect(() => {
    fetch(`http://localhost:3000/data/userData.json`, {
    //fetch(`http://13.125.111.131:8080/user/info/profile`, {
      method: "GET",
      /*
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
      }*/
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setPopularity(data[0].popularity.rate.toFixed(1));
        if(data.image !== null) {
          //setProfileImg("data:image/jpeg;base64," + data?.image);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const [activeTab, setActiveTab] = useState(0);
  const onClickTab = (tabId) => {
    setActiveTab(tabId);
  };
  const Sidebar = [
    {
      Title: <div onClick={() => onClickTab(0)}>프로필</div>,
      Content: (
        <Suspense>
            <Profile />
        </Suspense>
      )
    },
    {
      Title: <div onClick={() => onClickTab(1)}>내 활동</div>,
      Content: (
        <Suspense>
          <MyActivity />
        </Suspense>
      )
    },
    {
      Title: <div onClick={() => onClickTab(2)}>작성한 글</div>,
      Content: (
        <Suspense>
          <MyPost />
        </Suspense>
      )
    },
    {
      Title: <div onClick={() => onClickTab(3)}>관심글</div>,
      Content: (
        <Suspense>
          <Likedlist />
        </Suspense>
      )
    },
    {
      Title: <div onClick={() => onClickTab(4)}>정보설정</div>,
      Content: (
        <Suspense>
          <Setting />
        </Suspense>
      )
    }
  ];
  const onClickWithdraw = () => {
    const result = window.confirm("정말 탈퇴하시겠습니까?");
    if (result) {
      fetch(`http://13.125.111.131:8080/user/withdraw`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
        }
      }).then((response) => {
        response.status === 200
          ? alert("회원 탈퇴가 되었습니다!")
          : alert("회원 탈퇴에 실패하였습니다")
        }
      );
      window.localStorage.removeItem("Authorization");
      window.localStorage.removeItem("AuthorizationRefresh");
      window.location.href = "/";
    }
  };
  return (
    <Wrapper>
      <SidebarContainer>
        <SidebarTab>
          <Avatar src={profileImg} alt="프로필사진"></Avatar>
          <PopularityContainer>
            <UserPopularity rate={popularity} />
          </PopularityContainer>
          <Menu>
            {Sidebar.map((tab, index) => {
              return (
                <TabList
                  className={activeTab === index ? "active" : ""}
                  key={index}
                >
                  {tab.Title}
                </TabList>
              );
            })}
            <TabList onClick={onClickWithdraw}>회원탈퇴</TabList>
          </Menu>
        </SidebarTab>
      </SidebarContainer>

      <ContentContainer>{Sidebar[activeTab].Content}</ContentContainer>
    </Wrapper>
  );
};

export default MyPage;
