import React from "react";
import KakaoMap from "../../Common/KakaoMap";
import styled from "styled-components";

const ModalWrapper = styled.div`
  width: 600px;
  height: 400px;
  margin-top: 30px;
  margin-bottom: -40px;
`;

const ModalLocation = ({ isModal, newnotice }) => {
  return (
    <>
      {isModal && (
        <ModalWrapper>
          <KakaoMap
            data={{
              lat: newnotice.recommendLocationX,
              lng: newnotice.recommendLocationY,
            }}
            type={false}
          />
        </ModalWrapper>
      )}
    </>
  );
};

export default ModalLocation;
