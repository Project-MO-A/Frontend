import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ProfileLink from "./MyPageComponent/ProfileLink";
import ProfileTag from "./MyPageComponent/ProfileTag";
import KakaoMap from "../Common/KakaoMap";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 450px;
  h3 {
    margin-bottom: 20px;
    font-size: 22px;
  }
`;

const EditorWrapper = styled.div`
  border-radius: 4px;
  padding: 8px;
  border: 1px solid #707070;
  padding-top: 0;
  font-size: 30px;
  min-height: 300px;
  min-width: 570px;
  margin-right: 150px;
  box-shadow: 2px 1px 5px #bdbdbd;
  .ql-container {
    border: none !important;
  }
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
  &:hover {
    cursor: pointer;
  }
`;

const SaveButtonContainer = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  min-width: 570px;
  margin-right: 150px;
  margin-top: 30px;
`;

const MapWrapper = styled.div`
  display: flex;
  min-width: 570px;
  margin-right: 150px;
  margin-bottom: 20px;
`;

const Profile = () => {
  const [data, setData] = useState({
    details: "",
    locationLatitude: null,
    locationLongitude: null,
    interests: [],
    link: []
  });
  const [introduce, setIntroduce] = useState(data.details);
  const [location, setLocation] = useState(null);
  const [tags, setTags] = useState([]);
  const [UpdateTags, setUpdatedTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [UpdateLinkss, setUpdatedLinks] = useState([]);
  const [userProfileData, setUserProfileData] = useState({});

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    await axios
      .get(`http://localhost:3000/data/userData.json`, {
      //.get(`http://13.125.111.131:8080/user/info/profile`, {
        /*headers: {
          Authorization: localStorage.getItem("Authorization"),
          AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
        }*/
      })
      .then((response) => {
        console.log(response.data.image);
        setData(response.data);
        setTags(response.data.interests);
        setLinks(response.data.link);
        setIntroduce(response.data.details);
        setLocation({
          lat: data.locationLatitude || null,
          lng: data.locationLongitude || null
        })
      });
  };

  const handleUserLocation = useCallback((address) => {
    setLocation(address);
  }, []);

  const handleContentChange = useCallback((value) => {
    setIntroduce(value);
  }, []);

  const handleUserTags = useCallback((value) => {
    setUpdatedTags(value);
  }, []);

  const handleUserLinks = useCallback((value) => {
    setUpdatedLinks(value);
  }, []);

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      fetch("http://13.125.111.131:8080/user/info/profile", {
        method: "PATCH",
        body: JSON.stringify({
          locationLatitude: location.lat,
          locationLongitude: location.lng,
          links: UpdateLinkss,
          tags: UpdateTags,
          details: introduce
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorization"),
          AuthorizationRefresh: localStorage.getItem("AuthorizationRefresh")
        }
      })
      .then((response) => {
        if (response.status === 200) {
          alert("프로필을 성공적으로 변경하였습니다");
          setUserProfileData({ ...userProfileData });
        } else {
          alert("프로필 변경에 실패하였습니다");
        }
      })
      .catch((error) => {
        console.log(error);
      });
    },
    [location, UpdateLinkss, UpdateTags, introduce, userProfileData]
  );

  const modules = {
    toolbar: false
  };
  return (
    <Wrapper>
        <h3>선호 지역</h3>
        <MapWrapper>
          {location && (
            <KakaoMap
              handleUserLocation={handleUserLocation}
              data={{
                lat: data.locationLatitude,
                lng: data.locationLongitude
              }}
            />
          )}
      </MapWrapper>

        <h3>링크</h3>
        <ProfileLink data={links} handleUserLinks={handleUserLinks} />

        <h3>관심 태그</h3>
        <ProfileTag data={tags} handleUserTags={handleUserTags} />

        <h3>상세 소개</h3>
        <EditorWrapper>
          <ReactQuill
            value={introduce}
            onChange={handleContentChange}
            modules={modules}
            theme="snow"
          />
        </EditorWrapper>

        <SaveButtonContainer>
          <SaveButton
            type="submit"
            backgroundColor={"black"}
            onClick={onSubmit}
          >
            저장하기
          </SaveButton>
        </SaveButtonContainer>
    </Wrapper>
  );
};

export default Profile;
