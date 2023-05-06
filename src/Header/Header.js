import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Modal from "../LogIn/Modal";
import SignInForm from "../LogIn/SignInForm";
import axios from "axios";

const Nav = styled.nav`
  background-color: white;
  color: black;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 50px;
  margin-bottom: 10px;
`;

const Logo = styled.h1`
  margin: 0px;
  margin-left: 50px;
  font-size: 30px;
  color: #5d5fef;
  a {
    text-decoration: none;
    border-bottom: none;
    &.visited,
    &:visited {
      text-decoration: none;
      border-bottom: none;
      color: #5d5fef;
    }
  }
`;

const NavList = styled.ul`
  display: flex;
  justify-content: flex-end;
  list-style: none;
  margin: 0;
  margin-right: 50px;
  font-weight: 600;
  font-size: 17px;
  height: 50px;
  align-items: center;
 
  .name{
    color: #5d5fef;
  }
`;

const NavItem = styled.li`
  cursor: pointer;
  margin-left: 15px;
  font-weight: 600px;
  a {
    color: inherit;
    text-decoration: none;
  }
  &:hover{
    border-bottom: 2px solid #5d5fef;
  }
`;

const Header = () => {
  const [signInModal, setSignInModal] = useState(false);
  const [userLogIn, setUserLogIn] = useState(true);//mock data사용으로 기본 값 true (로그인상태)로 변경
  const [username, setUsername] = useState("");
  useEffect(() => {
    const authorization = window.localStorage.getItem("Authorization");
    const authorizationRefresh = window.localStorage.getItem(
      "AuthorizationRefresh"
    );

    if (authorization && authorizationRefresh) {
      setUserLogIn(true);
    }

    axios
    .get(`http://13.210.190.114:8000/data/userData.json`, {
     // .get(`http://13.125.111.131:8080/user/info/profile`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
        }
      })
      .then((response) => {
        setUsername(response.data[0].name);
      });
  }, [username]);

  const onClickSignout = () => {
    window.localStorage.removeItem("Authorization");
    window.localStorage.removeItem("AuthorizationRefresh");
    setUserLogIn(false);
    window.location.href = "/";
  };

  return (
    <>
      <Nav>
        <Logo>
          <Link to="/">MO:A</Link>
        </Logo>
        {userLogIn ? (
          <NavList>
            <span className="name">{username}</span><span>님</span>
            <NavItem>
              <Link to="/post">새 글쓰기</Link>
            </NavItem>
            <NavItem>
              <Link to="/mypage">마이페이지</Link>
            </NavItem>
            <NavItem onClick={onClickSignout}>로그아웃</NavItem>
          </NavList>
        ) : (
          <NavList>
            <NavItem onClick={() => setSignInModal(true)}>로그인</NavItem>
            <NavItem>
              <Link to="/signup">회원가입</Link>
            </NavItem>
          </NavList>
        )}
      </Nav>
      {signInModal && (
        <Modal onClose={() => setSignInModal(false)}>
          <SignInForm />
        </Modal>
      )}
    </>
  );
};

export default Header;
