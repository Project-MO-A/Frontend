import React, { useEffect, useState } from "react";
import styled from "styled-components";
import profile from "./profileImg.png";
import { AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import axios from "axios";

const Wrapper = styled.div`
  height: 350px;
  width: 300px;
  display: flex;
  flex-direction: column;
  border: 2px solid #5d5fef;
  border-radius: 20px;
  justify-content: left;
  position: relative;

  h3 {
    font-size: 19px;
    margin-right: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  > * {
    margin: 10px 20px 0 25px;
  }
  &:hover {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 20px 5px 25px;
  svg {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 20px;
    width: 20px;
    margin-left: 20px;
    color: #d2d2d2;
    &:hover {
      cursor: pointer;
    }
  }
`;

const CatergoryBlock = styled.div`
  display: inline-flex;
  margin: 10px 0px 3px 0px;
  font-size: 17px;
`;

const LikeIcon = styled(AiFillHeart)`
  position: absolute;
  top: 20px;
  right: 30px;
  height: 20px;
  width: 20px;
  margin-left: 20px;
  color: #d2d2d2;
  &.liked {
    fill: red;
  }
`;

const Date = styled.div`
  display: inline;
  color: black;
  font-size: 15px;
`;

const Bottom = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  margin-left: 20px;
  margin-right: 20px;
`;

const Line = styled.hr`
  position: absolute;
  bottom: 70px;
  width: 250px;
  border: 1px solid #ddd;
  align-items: center;
`;

const Profile = styled.div`
  display: flex;
  color: gray;
  margin-left: 10px;
  p {
    margin: 8px;
  }
`;

const UserImg = styled.img`
  display: flex;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin: 0px;
`;

const CommentIcon = styled(AiOutlineComment)`
  flex: auto;
  height: 25px;
  width: 25px;
  color: gray;
  margin-right: 5px;
`;

const CommentBox = styled.div`
  display: inline-flex;
  position: absolute;
  top: 5px;
  left: 200px;
  align-items: center;
  color: gray;
  cursor: pointer;
  p {
    margin: 8px;
  }
`;

const TagListBlock = styled.div`
  display: flex;
  margin-top: 8px;
  margin-left: 25px;
  margin-right: 0.2rem;
  font-size: 17px;
  flex-wrap: wrap;
  align-content: flex-start;
`;

const Tag = styled.div`
  display: flex;
  margin-right: 8px;
  margin-bottom: 0.5rem;
  font-size: 15px;
  border: none;
  border-radius: 10px;
  padding: 3px 7px 3px 7px;
  background-color: ${(props) => props.backgroundColor || "#FFD700"};
  color: ${(props) => props.color || "black"};
  font-weight: 520;
  align-items: center;
`;
const MenuList = styled.ul`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 3px;
  top: 10%;
  right: -18%;
  list-style: none;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  width: 50px;
  height: 50px;
  z-index: 1;
  font-size: 16px;
`;

const MenuItem = styled.li`
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  display: inline-block;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const PostComponent = ({
  id,
  type,
  title,
  author,
  category,
  tags,
  recruitStatus,
  date,
  profileImg,
  replyCount,
  onClickCategory,
  onClickTag,
  getPostList,
}) => {
  const [isMypost, setIsMypost] = useState(false);
  const [isMyLiked, setIsMyLiked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isMain, setIsMain] = useState(false);

  if (tags?.length > 5) {
    tags = tags.slice(0, 5);
  }
  if (title.length > 50) {
    title = title.slice(0, 47) + "...";
  } 

  useEffect(() => {
    if (type === "MyPost") setIsMypost(true);
    else if (type === "MyLike") setIsMyLiked(true);
    else {
      setIsMain(true);
    }
    if ((type === "MyLike" || type === "main" ) && localStorage.getItem("Authorization")) {
      axios
        .get(`http://13.125.111.131:8080/user/info/concern`, {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
          },
        })
        .then((response) => {
          response.data.writing.map((post) => {
            if (post.id === id) {
              setIsMyLiked(true);
            }
          });
        });
    }
  }, []);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setIsMyLiked(!isMyLiked);
    if (isMyLiked === false) {
      axios
        .post(
          `http://13.125.111.131:8080/recruitment/${id}/concern`,
          {
            value: id,
          },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
              AuthorizationRefresh: localStorage.getItem(
                "AuthorizationRefresh"
              ),
            },
          }
        )
        .catch((error) => {
          if (error.response.status === 403) {
            alert("관심글은 로그인 후 등록할 수 있습니다!");
            setIsMyLiked(false);
          }
        });
    } else if (isMyLiked === true) {
      axios.delete(`http://13.125.111.131:8080/recruitment/${id}/concern`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
        },
      });
    }
  };

  const handleMenuClick = () => {
    setShowMenu((prevState) => !prevState);
  };

  const linkToDetail = () => {
    window.open(`../detail/${id}`);
  };

  const handleEditClick = () => {
    window.open(`/edit/${id}`);
  };

  const handleDeleteClick = async () => {
    const result = window.confirm("글을 정말 삭제할까요?");
    if (result) {
      axios
        .delete(`http://13.125.111.131:8080/recruitment/${id}`, {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
            AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
          },
        })
        .then((response) => {
          if (response.status === 200 ){
            alert("글이 삭제되었습니다!");
            getPostList();
          }
          else{
            alert("글 삭제에 실패하였습니다");
          }
        });
    }
  };

  const handleCategoryClick = () => {
    onClickCategory(category);
  };

  const handleTagClick = (searchTag) => {
    onClickTag(searchTag);
  };

  return (
    <Wrapper>
      {showMenu && (
        <MenuList>
          <MenuItem onClick={handleEditClick}>글 수정</MenuItem>
          <MenuItem onClick={handleDeleteClick}>글 삭제</MenuItem>
        </MenuList>
      )}
      <Top>
        <CatergoryBlock>
          <Tag
            backgroundColor="#EAEAEA"
            color="#5D5FEF"
            style={isMain ? { cursor: "pointer" } : null}
            onClick={isMain ? handleCategoryClick : undefined}
          >
            {category}
          </Tag>
          <Tag color="black">{parseInt(recruitStatus) === 1 ? "모집중" : (parseInt(recruitStatus) === 2 ? "모집 완료" : "프로젝트 완료")}
          </Tag>
        </CatergoryBlock>
        {isMypost ? (
          <>
            <CiMenuKebab onClick={handleMenuClick} />{" "}
          </>
        ) : (
          <LikeIcon
            onClick={handleLikeClick}
            className={isMyLiked ? "liked" : ""}
          />
        )}
        <Date>게시일 | {date}</Date>
      </Top>

      <h3 onClick={linkToDetail}>{title}</h3>
      <TagListBlock>
        {tags.map((tag) => (
          <Tag
            key={tag}
            style={isMain ? { cursor: "pointer" } : null}
            onClick={isMain ? () => handleTagClick(tag) : null}
          >
            #{tag}
          </Tag>
        ))}
      </TagListBlock>

      <Line />
      <Bottom>
        <Profile>
          <UserImg src={ profileImg || profile} alt="프로필 사진" />
          <p>{author}</p>
        </Profile>
        <CommentBox onClick={linkToDetail}>
          <CommentIcon />
          {replyCount}
        </CommentBox>
      </Bottom>
    </Wrapper>
  );
};

export default PostComponent;
