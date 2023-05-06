import React, { useState, useEffect } from "react";
import styled from "styled-components";
import profile from "../Common/profileImg.png";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 680px;
  min-width: 500px;
  border: 0.5px solid #a2a2a2;
  padding: 20px;
  border-radius: 20px;
  padding-top: 15px;
  margin-right: 100px;
  margin-bottom: 100px;
  box-shadow: 1px 1px 5px 1px #c0c0c0;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  position: relative;
  h3 {
    text-decoration: underline;
  }
`;

const ProfileImgContainer = styled.div`
  display: flex;
  position: relative;
`;

const EditIcon = styled.label`
  position: absolute;
  right: 0px;
  bottom: 10px;
  z-index: 1;
  cursor: pointer;
`;

const Avatar = styled.img`
  margin-top: 15px;
  display: flex;
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const InputContainer = styled.div`
  align-items: left;
  font-weight: bold;
  flex-direction: column;
  display: flex;
  h4 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
  }
`;

const inputStyle = `
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  font-size: 16px;
  width: 400px;
  border: 1px solid #A2A2A2;
`;

const PwdInput = styled.input`
  ${inputStyle}
  margin-bottom: 5px;
  margin-top: 5px;
`;

const Input = styled.input`
  ${inputStyle}
  margin-bottom: 16px;
`;

const EmailInput = styled.input`
  align-items: center;
  padding: 8px;
  font-size: 16px;
  width: 400px;
  border: none;
  color: black;
  background-color: #d1d1d1;
  margin-bottom: 5px;
  pointer-events: none;
`;

const SaveButton = styled.button`
  width: 100px;
  padding: 8px;
  border: none;
  background-color: ${(props) => props.backgroundColor};
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 40px;
  margin-top: 30px;
  &:hover {
    cursor: pointer;
  }
`;

const EditIcons = styled(AiOutlineEdit)`
  display: flex;
  position: absolute;
  height: 20px;
  width: 20px;
  bottom: 23.5px;
  right: -20px;
`;

function Setting() {
  const [user, setUser] = useState({
    email: "",
    name: "",
    nickname: "",
    password: "",
  });
  const [file, setFile] = useState("");
  const [profileImg, setProfileImg] = useState(profile);
  const [nicknameInput, setNicknameInput] = useState(user.nickname);
  const [usernameInput, setUsernameInput] = useState(user.name);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [newPwdConfirm, setPwdConfirm] = useState("");
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetch(`http://localhost:3000/data/userData.json`, {
    //fetch(`http://13.125.111.131:8080/user/info/profile`, {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
      },
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setUser({
          email: data[0].email,
          name: data[0].name,
          nickname: data[0].nickname,
        });
        setNicknameInput(data[0].nickname);
        setUsernameInput(data[0].name);
        if (data.image !== null) {
          setProfileImg("data:image/jpeg;base64," + data.image);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleNicknameChange = (event) => {
    event.preventDefault();
    setNicknameInput(event.target.value);
  };

  const handleUsernameChange = (event) => {
    event.preventDefault();
    setUsernameInput(event.target.value);
  };

  const handlePwdChange = (event) => {
    event.preventDefault();
    setCurrentPwd(event.target.value);
  };

  const handleNewPwdChange = (event) => {
    event.preventDefault();
    setNewPwd(event.target.value);
  };

  const handleNewPwdConfirmChange = (event) => {
    event.preventDefault();
    setPwdConfirm(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(() => event.target.files[0]);

    const reader = new FileReader();

    reader.onloadend = () => {
      const profileImgDataUrl = reader.result;
      setProfileImg(profileImgDataUrl);
    };

    reader.readAsDataURL(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", profileImg);

    if (newPwd.trim() !== "" && currentPwd.trim() === "") {
      //현재 비밀번호를 입력하지 않고 새 비밀번호 입력시
      alert("현재 비밀번호를 입력해주세요!");
      return;
    }
    if (newPwd !== "" && newPwd.length < 8) {
      alert("새 비밀번호는 8자리 이상 입력해주세요!");
    }
    if (newPwd !== newPwdConfirm) {
      //새 비밀번호와 비밀번호 확인이 다르면 리턴
      alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다!");
      return;
    }
    const userData = {
      name: usernameInput,
      nickname: nicknameInput,
      currentPassword: currentPwd,
      newPassword: newPwd,
    };
    formData.append(
      "request",
      new Blob([JSON.stringify(userData)], { type: "application/json" })
    );

    axios
      .patch("http://13.125.111.131:8080/user/info/basic", formData, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
          AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh"),
        },
      })
      .then((response) => {
        // 요청 성공 시 실행할 코드 작성
        console.log(response.data);
        if (response.status === 200) {
          alert("프로필을 성공적으로 변경하였습니다");
          setIsEditing(false);
          setUsernameInput(usernameInput);
          setUserData({ ...userData });
          window.location.reload();
        } else if (response.status === 400) {
          alert("현재 비밀번호를 다시 확인해주세요!");
        } else {
          alert("프로필 변경에 실패하였습니다");
        }
      })
      .catch((error) => {
        // 요청 실패 시 실행할 코드 작성
        console.log(error);
      });
  };
  return (
    <Wrapper>
      <ProfileImgContainer>
        <Avatar src={profile} alt="프로필 사진" />
        <EditIcon htmlFor="profile-image-upload">
          <AiOutlineEdit />
          <input
            type="file"
            id="profile-image-upload"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </EditIcon>
      </ProfileImgContainer>
      <Profile>
        {isEditing ? (
          <Input
            type="text"
            value={usernameInput}
            onChange={handleUsernameChange}
          />
        ) : (
          <>
            <h3 onClick={handleEditClick}>{usernameInput}</h3>
            <EditIcons onClick={handleEditClick} />
          </>
        )}
      </Profile>

      <InputContainer>
        <h4>E-mail</h4>
        <EmailInput
          type="email"
          name="email"
          placeholder="이메일"
          value={user.email}
          disabled
        />
      </InputContainer>

      <Form onSubmit={handleSubmit}>
        <InputContainer>
          <h4>닉네임 변경</h4>
          <Input
            type="text"
            name="name"
            placeholder="닉네임 변경하기"
            value={nicknameInput}
            onChange={handleNicknameChange}
          />
        </InputContainer>

        <InputContainer>
          <h4>비밀번호 변경</h4>
          <Input
            type="password"
            name="Currentpassword"
            placeholder="현재 비밀번호"
            value={currentPwd}
            onChange={handlePwdChange}
          />
          <PwdInput
            type="password"
            name="Newpassword"
            placeholder="새 비밀번호"
            value={newPwd}
            onChange={handleNewPwdChange}
          />
          <PwdInput
            type="password"
            name="NewpasswordConfirm"
            placeholder="새 비밀번호 확인"
            value={newPwdConfirm}
            onChange={handleNewPwdConfirmChange}
          />
        </InputContainer>
        <SaveButton type="submit" backgroundColor={"black"}>
          저장하기
        </SaveButton>
      </Form>
    </Wrapper>
  );
}

export default Setting;
