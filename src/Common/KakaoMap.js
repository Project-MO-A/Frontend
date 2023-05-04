import React, { useState, useCallback, useEffect, useRef } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styled from "styled-components";

const Wrapper = styled.div`
  span {
    font-weight: 550;
  }
  .userAddress {
    color: #5d5fef;
    font-weight: 700;
  }
  width: 100%;
`;
const StyledMap = styled(Map)`
  min-width: 570px;
  height: 300px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
  margin-top: 10px;
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: row;
  input {
    flex: 1;
    align-items: center;
    box-shadow: 2px 1px 5px #bdbdbd;
    margin-bottom: 20px;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #707070;
    font-size: 16px;
    min-width: 500px;
    min-height: 15px;
  }
  button {
    width: 50px;
    height: 35px;
    padding: 8px;
    border: none;
    background-color: ${(props) => props.backgroundColor};
    font-weight: bold;
    color: black;
    font-size: 16px;
    margin-left: 10px;
    box-shadow: 2px 1px 5px #bdbdbd;
    &:hover {
      cursor: pointer;
    }
  }
`;

function KakaoMap({ handleUserLocation, data, type }) {
  const [isInput, setIsInput] = useState(true);
  const initial = { lat: 37.5662952, lng: 126.9779451 };
  const [state, setState] = useState({
    center: {
      lat: initial.lat,
      lng: initial.lng,
    },
    isPanto: true,
  });

  const [searchAddress, setSearchAddress] = useState("");
  const [markerPosition, setMarkerPosition] = useState({
    lat: null,
    lng: null,
  });
  const [userAddress, setUserAddress] = useState(null);
  const geocoder = useRef(new window.kakao.maps.services.Geocoder()).current;

  const geoFunction = useCallback(
    (lat, lng) => {
      geocoder.coord2Address(lat, lng, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setUserAddress(result[0].address.address_name);
        } else {
          console.log("error");
        }
      });
    },
    [geocoder]
  );

  useEffect(() => {
    if (data.lat !== null && data.lng !== null) {
      setState({
        center: {
          lat: data.lat,
          lng: data.lng,
        },
        isPanto: true,
      });
      setMarkerPosition({
        lat: data.lat,
        lng: data.lng,
      });
      geoFunction(data.lng, data.lng);
    }
  }, []);

  const handleMapClick = useCallback(
    (map, mouseEvent) => {
      const latlng = mouseEvent.latLng;
      setMarkerPosition({
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      });
      handleUserLocation({
        lat: latlng.getLat(),
        lng: latlng.getLng(),
      });
      const latLng = new window.kakao.maps.LatLng(
        latlng.getLat(),
        latlng.getLng()
      );
      geoFunction(latLng.getLng(), latLng.getLat());
    },
    [geocoder, handleUserLocation]
  );

  const SearchMap = useCallback(() => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    let callback = function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        const newSearch = result[0];
        setState((prevState) => ({
          ...prevState,
          center: { lat: newSearch.y, lng: newSearch.x },
        }));
      }
    };
    geocoder.addressSearch(searchAddress, callback);
  }, [searchAddress]);

  const handleSearchAddress = useCallback((e) => {
    setSearchAddress(e.target.value);
  }, []);

  useEffect(() => {
    if (markerPosition.lng && markerPosition.lat) {
      geocoder.coord2Address(
        markerPosition.lng,
        markerPosition.lat,
        (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            setUserAddress(result[0].address.address_name);
          } else {
            console.log("error");
          }
        }
      );
    }
  }, [geocoder, markerPosition]);

  return (
    <Wrapper>
      {type === false ? (
        <></>
      ) : (
        <SearchContainer>
          <input
            onChange={handleSearchAddress}
            onKeyPress={(e) => e.key === "Enter" && SearchMap()}
          />
          <button onClick={SearchMap}>검색</button>
        </SearchContainer>
      )}

      {userAddress === null ? (
        <span>선택된 지역이 없습니다</span>
      ) : (
        <span>
          현재 선택된 지역은 <span className="userAddress">{userAddress}</span>{" "}
          입니다.
        </span>
      )}

      <StyledMap
        center={{ lat: state.center.lat, lng: state.center.lng }}
        onClick={handleMapClick}
      >
        {markerPosition.lat && markerPosition.lng && (
          <MapMarker position={markerPosition} />
        )}
      </StyledMap>
    </Wrapper>
  );
}

export default React.memo(KakaoMap);
