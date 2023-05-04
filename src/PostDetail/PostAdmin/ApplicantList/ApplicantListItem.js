import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import InfoDetail from "../../UserInfo/InfoDetail";
import { useState } from "react";

const ApplicantItemDiv = styled.div`
  display: flex;
  width: 550px;
  padding-bottom: 10px;
  margin: 20px 0;
  border-bottom: 1px solid gray;
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  font-weight: 600;
`;

const ApplicantBtnDiv = styled.div`
  margin-left: 300px;
`;

const ApplicantBtn = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 10px;
  font-family: "Inter";
  font-style: normal;
  font-size: 16px;
  font-weight: 600;
`;

const ApplicantListItem = ({ item, fetchApproved, fetchRefuse }) => {
  const [openInfo, setOpenInfo] = useState(false);
  const handlecloseInfo = () => {
    setOpenInfo(false);
  };
  const { postId } = useParams();

  const apporvedHandler = (applyId) => {
    fetchApproved(applyId);
    setOpenInfo(false);
  };

  const refuseHandler = (applyId) => {
    fetchRefuse(applyId);
    setOpenInfo(false);
  };

  return (
    <>
      <ApplicantItemDiv>
        <div>{item.nickname}</div>
        <ApplicantBtnDiv>
          <ApplicantBtn onClick={() => setOpenInfo(!openInfo)}>
            정보보기
          </ApplicantBtn>

          <ApplicantBtn onClick={() => apporvedHandler(item.applyId)}>
            수락
          </ApplicantBtn>
          <ApplicantBtn onClick={() => refuseHandler(item.applyId)}>
            거부
          </ApplicantBtn>
        </ApplicantBtnDiv>
      </ApplicantItemDiv>
      {openInfo && (
        <InfoDetail
          handlecloseInfo={handlecloseInfo}
          item={item}
          apporvedHandler={apporvedHandler}
          refuseHandler={refuseHandler}
        />
      )}
    </>
  );
};

export default ApplicantListItem;
