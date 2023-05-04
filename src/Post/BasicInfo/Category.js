import React, { useEffect, useState } from "react";
import styled from "styled-components";

const CategoryBlock = styled.div`
  text-align: left;
  display: flex;
  margin-left: 45px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  align-items: center;
  margin-top: 3px;
  font-size: 19px;
`;

export const Select = styled.select`
  margin-left: 32px;
  display: block;
  width: 312px;
  height: 30px;
  padding: 2px 5px;
  font-size: inherit;
  text-align: center;
  line-height: inherit;
  border: 1px solid;
  border-radius: 4px;
  color: inherit;
  background-color: transparent;
  box-shadow: 2px 1px 5px #bdbdbd;
`;

export default function Category({ handleCategoriesChange, isEdit, Editdata }) {
  const [selected, setSelected] = useState("");
  const categoryOptions = [
    { value: "PROGRAMMING", label: "프로그래밍" },
    { value: "EXAMINATION", label: "고시" },
    { value: "INTERVIEW", label: "면접" },
    { value: "LANGUAGE", label: "어학" },
    { value: "CERTIFICATE", label: "자격증" },
    { value: "AUTONOMY", label: "자율" },
    { value: "HOBBY", label: "취미" },
    { value: "EMPLOYMENT", label: "취업" },
    { value: "ETC", label: "기타" },
  ];

  useEffect(() => {
    if (isEdit) {
      const editDataMap = {
        어학: "LANGUAGE",
        프로그래밍: "PROGRAMMING",
        취업: "EMPLOYMENT",
        취미: "HOBBY",
        자격증: "CERTIFICATE",
        고시: "EXAMINATION",
        면접: "INTERVIEW",
        자율: "AUTONOMY",
        기타: "ETC",
      };
      setSelected(editDataMap[Editdata]);
    }
    else {
      setSelected("PROGRAMMING");
    }
  }, []);

  const handleCategory = (event) => {
    if (event.target.value !== undefined) {
      setSelected(event.target.value);
      handleCategoriesChange(event.target.value);
    }
  };

  return (
    <CategoryBlock>
    <Label htmlFor="category"> 카테고리 </Label>
    {
      selected === "" ? "" : 
        <Select
          name="select-category"
          id="category"
          defaultValue={ isEdit ? selected : "PROGRAMMING"}
          onChange={handleCategory}
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
    }
    </CategoryBlock>
  );
}
