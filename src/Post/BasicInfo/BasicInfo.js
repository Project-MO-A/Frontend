import Category from "./Category";
import Postion from "./Position/Position";
import styled from "styled-components";
import TagBox from "./TagBox";

const ProjectIntro = styled.h2`
  text-align: left;
  margin-left: 15px;
  margin-bottom: 5px;
`;

const Line = styled.hr`
  width: 95%;
  margin: 16px 15px;
  border: 1px solid #ddd;
`;

const BasicInfo = () => {

    return (
        <>
            <ProjectIntro>프로젝트 기본 정보</ProjectIntro>
            <Line />

            <Category />
            <Postion />
            <TagBox />

            
        </>
    )
    

}

export default BasicInfo;