import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import { TiStar } from "react-icons/ti";
import styled from "styled-components";
import TransAddress from "./TransAddress";

const InfoDetailDiv = styled.div`
  width: 700px;
  height: 880px;
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
  right: 15px;
  top: 20px;
  cursor: pointer;
  font-size: 22px;
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

const RateContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  h3 {
    width: 100px;
    margin-right: 10px;
  }
  span {
    font-size: 17px;
    font-weight: 500;
    margin-left: 10px;
  }
`;

const StarContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 10px;
`;

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
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
    {links.map((link, index) => (
      <LinkItem key={index} link={link} />
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

const RatingStar = styled(TiStar)`
  cursor: pointer;
  &.inactive_rating {
    color: gray;
  }
  &.active_rating {
    color: #f8a400;
  }
`;
const InfoDetail = ({
  handlecloseInfo,
  item,
  apporvedHandler,
  refuseHandler,
}) => {
  const [applicant, setApplicant] = useState("");
  const [popularityCnt, setPopularityCnt] = useState({}); //평가 받은 프로젝트 수
  const [applyPosition, setApplyPosition] = useState(item.recruitField);
  const [introDetail, setIntroDetail] = useState("");
  const [links, setLinks] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const starArray = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const params = { userId: item.userId };
    await axios
      .get(
        "http://localhost:3000/data/userData.json",
        //"http://13.125.111.131:8080/user/info/profile",

        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
          params,
        }
      )
      .then((response) => {
        if (response.data) {
          const currentUser = response.data.find(
            (it) => parseInt(it.userId) === parseInt(item.userId)
          );
          setApplicant(currentUser.nickname);
          setPopularityCnt(currentUser.popularity);
          setIntroDetail(currentUser.details);
          setLinks(currentUser.link);
          setLat(currentUser.locationLatitude);
          setLng(currentUser.locationLongitude);
        }

        // setApplicant(response.data.nickname);
        // setPopularityCnt(response.data.popularity);
        // setIntroDetail(response.data.details);
        // setLinks(response.data.link);
        // setLat(response.data.locationLatitude);
        // setLng(response.data.locationLongitude);
      });
  };

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
        <CloseBtn onClick={handlecloseInfo}>
          <IoClose />
        </CloseBtn>

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
        <RateContainer>
          <h3>지원자 별점</h3>
          <span>
            총 {popularityCnt.count}개의 평가 중</span>
            <StarContainer>
            {starArray.map((array, index) => (
              <RatingStar
                size={20}
                key={index}
                value={popularityCnt.rate}
                className={
                  array <= popularityCnt.rate
                    ? "active_rating"
                    : "inactive_rating"
                }
              />
            ))}
          </StarContainer>
          <span>{popularityCnt.rate && popularityCnt.rate.toFixed(1)}</span>
        </RateContainer>
        <h3>지원자 상세 소개</h3>
        <IntroContainer
          dangerouslySetInnerHTML={{ __html: introDetail }}
        ></IntroContainer>
        <h3>링크</h3>
        <LinkList links={links} />
        <h3>선호지역</h3>
        <Container>
          <TransAddress lat={lat} lng={lng} />
        </Container>
        <ButtonContaienr>
          <Button
            backgroundColor={"#63B730"}
            onClick={() => apporvedHandler(item.applyId)}
          >
            수락하기
          </Button>
          <Button
            backgroundColor={"#FF5E5E"}
            onClick={() => refuseHandler(item.applyId)}
          >
            거절하기
          </Button>
        </ButtonContaienr>
      </Wrapper>
    </InfoDetailDiv>
  );
};

export default InfoDetail;
