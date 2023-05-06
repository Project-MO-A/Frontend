import React from "react";
import styled from "styled-components";
import HomeTab from "./HomeTab/HomeTab";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Home = () => {
  return (
    <Wrapper>
      <p style={{ color: 'red', textAlign:"center" }}>현재 백엔드 API 유실로 인해 모든 데이터를 MockData로 대체하여 Tab과 검색과 같은 일부 기능들이 작동하지 않습니다</p>
      <HomeTab />
    </Wrapper>
  );
};

export default Home;
