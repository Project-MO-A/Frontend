import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

import styled from "styled-components";

const InfoDetailDiv = styled.div`
  width: 700px;
  height: 850px;
  z-index: 999;
  position: absolute;
  left: 50%;
  transform: translate(0, -40%);
  background-color: #fff;
  border: 1px solid black;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
  margin-top: 30px;
`;

const Table = styled.table`
  border-collapse: collapse;
  margin-top: 30px;
  width: 600px;
  height: 40px;
  font-weight: 550;
  margin-bottom: 20px;
  box-shadow: 2px 1px 5px #bdbdbd;

  td {
    text-align: center;
    border: 1px solid #bbb9b9;
  }
  td:nth-child(odd) {
    background-color: #e2e3ff;
  }
  td:first-child {
    width: 20%;
  }
  td:nth-child(2) {
    width: 30%;
  }
  td:nth-child(3) {
    width: 20%;
  }
  td:last-child {
    width: 30%;
  }
`;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: solid #bbb9b9;
  border-radius: 4px;
  width: 500px;
  min-height: 200px;
  margin-left: 20px;
  margin-bottom: 25px;
  padding-left: 20px;
  padding-top: 10px;
`;

const Container = styled.div`
  display: inline-block;
  flex-direction: row;
  border-bottom: 1px solid #bbb9b9;
  width: 450px;
  margin-left: 20px;
  margin-bottom: 25px;
  padding-left: 20px;
  padding-bottom: 5px;
  align-items: center;
  font-size: 17px;
  font-weight: 550;
  a {
    color: blue;
    text-decoration: none;
  }
  a:visited {
    color: gray;
  }
`;

const ButtonContaienr = styled.div`
  display: flex;
  flex-direction: row;
  width: 600px;
  justify-content: center;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100px;
  padding: 8px;
  border: none;
  background-color: ${(props) => props.backgroundColor};
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
  margin-left: 10px;
  margin-top: 30px;
`;

const LinkList = React.memo(({ links }) => (
  <>
    {links.map((link) => (
      <LinkItem key={link} link={link} />
    ))}
  </>
));

const LinkItem = React.memo(({ link }) => (
  <Container>
    <a href={`http://${link}`} target="_blank" rel="noreferrer">
      {link}
    </a>
  </Container>
));

const InfoDetail = ({ isOpen, handlecloseInfo }) => {
  const [applicant, setApplicant] = useState("user1");
  const [applyPosition, setApplyPosition] = useState("프론트엔드");
  const [introDetail, setIntroDetail] = useState("지원자 상세 소개");
  const [links, setLinks] = useState(["naver.com", "github.com"]);
  const [location, setLocation] = useState("지하철역");

  const infoRef = useRef();

  useEffect(() => {
    let infoClose = (e) => {
      if (!infoRef.current.contains(e.target)) {
        handlecloseInfo();
      }
    };
    document.addEventListener("mousedown", infoClose);

    return () => {
      document.removeEventListener("mousedown", infoClose);
    };
  });

  return (
    <InfoDetailDiv ref={infoRef}>
      <Wrapper>
        <CloseBtn onClick={handlecloseInfo}>X</CloseBtn>
        <Table>
          <tbody>
            <tr>
              <td>지원자</td>
              <td>{applicant}</td>
              <td>지원 포지션</td>
              <td>{applyPosition}</td>
            </tr>
          </tbody>
        </Table>
        <h3>지원자 상세 소개</h3>
        <IntroContainer>{introDetail}</IntroContainer>
        <h3>링크</h3>
        <LinkList links={links} />

        <h3>선호지역</h3>
        <Container>{location}</Container>
        <ButtonContaienr>
          <Button backgroundColor={"#63B730"}>수락하기</Button>
          <Button backgroundColor={"#FF5E5E"}>거절하기</Button>
        </ButtonContaienr>
      </Wrapper>
    </InfoDetailDiv>
  );
};

export default InfoDetail;
