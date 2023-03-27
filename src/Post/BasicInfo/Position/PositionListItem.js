import React, { useState, useCallback } from "react";
import styled from "styled-components";

const Block = styled.div`
  color: black;
`;

const InputText = styled.input`
  margin-left: 5px;
  padding: 2px 5px;
  font-size: inherit;
  text-align: center;
  line-height: inherit;
  height: 23px;
  width: 70%;
  border: 1px solid black;
  border-radius: 4px;
  color: inherit;
  display: inline-flex;
  align-items: center;
  background-color: transparent;
`;
const Button = styled.button`
  margin: 10px;
  border: none;
  display: inline;
  & + & {
    margin: 10px;
  }
`;

const PositionListItem = ({ position }) => {
  const [num, setNum] = useState(1);
  const [positionName, setPositionName] = useState("");

  const onChange = useCallback((e) => {
    setPositionName(e.target.value);
  }, [position.id, num, ]);
  

  const addPeople = (event) => {
    event.preventDefault();
    setNum((prevNum) => {
      if(prevNum < 8){ // 최대 8명까지
        const newNum = prevNum + 1;
        
        return newNum;
      }
      else return 8;
    });
  };

  const removePeople = (event) => {
    event.preventDefault();

    setNum((prevNum) => {
      if(prevNum > 1){ //최소 1명
        const newNum = prevNum - 1;
        return newNum;
      }
      else return 1;
    });
    
  };

  return (
    <>
      <Block>
        <InputText
          placeholder="ex. 프론트엔드"
          value={positionName}
          onChange={onChange}
        />
        <Button onClick={removePeople}> - </Button> {num}
        <Button onClick={addPeople}> + </Button>
      </Block>
    </>
  );
};

export default PositionListItem;
