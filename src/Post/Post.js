import React, { useState, useCallback, useEffect} from "react";
import styled from "styled-components";
import BasicInfo from "./BasicInfo/BasicInfo";
import Editor from "./Editor/Editor";
import WriteActionButton from "./WriteButton";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;
`;

const Post = ({ isEdit }) => {
  const [categoryName, setCategoryName] = useState("PROGRAMMING");
  const [memberFields, setMemberFields] = useState([]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState(null);
  const [editData, setEditData] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  console.log(memberFields);
  useEffect(()=>{
    if(isEdit){
      axios
      .get(
        `http://localhost:3000/data/postDetail.json`,
        //`http://13.125.111.131:8080/recruitment/${postId}`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
          },
        }
      )
      .then((response) => {
        const currData = response.data.detail[postId-1];
        setEditData(currData.recruitInfo);
        setCategoryName(currData.recruitInfo?.category);
        setMemberFields(currData.recruitInfo.members);
        setTags(currData.recruitInfo.tags)
        setTitle(currData.recruitInfo.title)
        setContent(currData.recruitInfo.content);
        setState(currData.recruitInfo.state);
        /*
        setEdit(response.data.recruitInfo);
        setCategoryName(response.data.recruitInfo?.category);
        setMemberFields(response.data.recruitInfo.members);
        setTags(response.data.recruitInfo.tags)
        setTitle(response.data.recruitInfo.title)
        setContent(response.data.recruitInfo.content);
        setState(response.data.recruitInfo.state);
        */
      });
    }
    else{
      setEditData("not Edit Mode");
    }
  },[postId, isEdit]);

  useEffect(() => {
    if (editData !== null) {
      const editDataMap = {
        어학: "LANGUAGE",
        프로그래밍: "PROGRAMMING",
        취업: "EMPLOYMENT",
        취미: "HOBBY",
        자격증: "CERTIFICATE",
        고시: "EXAMINATION",
        면접: "INTERVIEW",
        자율: "AUTONOMY",
        기타: "ETC"
      };
      setCategoryName(editDataMap[editData.category]);
    }
  }, [editData]);
  
  const handleCategoriesChange = (category) => {
    setCategoryName(category);
  };

  const handleFieldsChange = useCallback((updatedFields) => {
   // setMemberFields(updatedFields.map(({ id, ...rest }) => rest));
    console.log(updatedFields);
    setMemberFields(updatedFields);
  }, []);

  const handleTagsChange = (tagslist) => {
    setTags(tagslist);
  };

  const handleTitleChange = (title) => {
    if(isEdit){
      setTitle(title);
    }
    else{
      setTitle(title.target.value);
    }
  };

  const handleContentChange = (event) => {
    setContent(event);
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    if (content.trim() === "") {
      alert("프로젝트 소개를 입력해주세요!");
      return;
    }

    if (tags.length === 0) {
      alert("태그를 적어도 하나 추가해주세요!");
      return;
    }
    if (!isEdit) {
      let members = [];
      memberFields.map((member) => {
        members.push({
          "field": member.recruitField,
          "total": member.totalCount
        })
      });
      if(categoryName === undefined) setCategoryName("PROGRAMMING");
      axios
        .post(
          "http://13.125.111.131:8080/recruitment",
          {
            "title": title,
            "content": content,
            "memberFields": members,
            "categoryName": categoryName,
            "tags": tags,
          },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
              AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
            },
          }
        )
        .then((response) => {
          console.log(response.data.value);
          navigate(`/detail/${response.data.value}`);
        });
    } else {
      let members = [];
      memberFields.map((member) => {
        console.log(member.recruitMemberId)
        members.push({
          "recruitMemberId": member.recruitMemberId < 8 ?  null : member.recruitMemberId,
          "field": member.recruitField,
          "total": member.totalCount
        })
      });
      console.log(members);
      
         axios
           .patch(
             `http://13.125.111.131:8080/recruitment/${postId}`,
             {
              title: title,
              content: content,
              state: state,
              memberFields: members,
              categoryName: categoryName,
              tags: tags,
            },
            {
              headers: {
                Authorization: localStorage.getItem("Authorization"),
                AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
              },
            }
          )
          .then((response) => {
            response.status === 200 ? navigate(`/detail/${response.data.value}`): alert("글 수정에 실패하였습니다");
          }
      );
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        {editData && (
        <>
        <BasicInfo
          handleCategoriesChange={handleCategoriesChange}
          handleFieldsChange={handleFieldsChange}
          handleTagsChange={handleTagsChange}
          isEdit={isEdit}
          Editdata={editData}
        />

        <Editor
          handleTitleChange={handleTitleChange}
          handleContentChange={handleContentChange}
          isEdit={isEdit}
          Editdata={editData}
        />
        </>)
        }
        <WriteActionButton isEdit={isEdit} />
      </form>
    </Wrapper>
  );
};

export default Post;
