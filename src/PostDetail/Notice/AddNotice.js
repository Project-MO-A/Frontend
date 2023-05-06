import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NoticeItem from "./NoticeItem";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { myPostData, userInfo, userStation } from "../../Recoil/atoms";

const NoticeWrap = styled.div`
  width: 1025px;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 10px;
`;

const NoticeInput = styled.textarea`
  resize: none;
  width: 1025px;
  height: 143px;
  border: none;

  :focus {
    outline: none;
  }
`;

const VotingCheckDiv = styled.div`
  display: flex;
  justify-content: end;
`;

const NoticeAddBtnDiv = styled.div`
  width: 1045px;
  display: flex;
  justify-content: end;
`;

const NoticeAddBtn = styled.button`
  margin-top: 14px;
  border-radius: 10px;
  background-color: black;
  color: #fff;
  font-weight: 600;
  width: 87px;
  height: 28px;
`;

const AddNotice = () => {
  const [notice, setNotice] = useState("");
  const { postId } = useParams();
  const [newNotice, setNewNotice] = useState([]);
  const [isChecked, setisChecked] = useState(false);
  const info = useRecoilValue(userInfo);
  const data = useRecoilValue(myPostData);
  const [user, setUser] = useState(data.postUser);
  const [station, setStation] = useRecoilState(userStation);

  useEffect(() => {
    fetchNotice();
  }, []);

  const fetchNotice = async () => {
    await axios
      .get(
        `http://13.210.190.114:8000/data/postNotice.json`
        // .get(`http://13.125.111.131:8080/recruitment/${postId}/notice`,
        //  {
        //   headers: {
        //     Authorization: window.localStorage.getItem("Authorization"),

        //     AuthorizationRefresh: window.localStorage.getItem(
        //       "AuthorizationRefresh"
        //     ),
        //   },
        // })
      )
      .then((response) => {
        if (response.data) {
          const currentNotice = response.data.find(
            (item) => parseInt(postId) === parseInt(item.postId)
          );
          setNewNotice(currentNotice.notices);
        }
      });
  };

  const onSubmitNotice = async (e) => {
    e.preventDefault();
    if (notice.length === 0) {
      alert("공지사항 내용을 입력해주세요!");
      return;
    }

    await axios.post(
      `http://13.125.111.131:8080/recruitment/${postId}/notice`,
      {
        content: notice,
        checkVote: isChecked,
      },
      {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },
      },
      { responseType: "json" }
    );
    fetchNotice();
    setNotice("");
    setisChecked(false);
  };

  const onNoticeDelete = async (id) => {
    axios.delete(
      `http://13.125.111.131:8080/recruitment/${postId}/notice/${id}`,

      {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },
      }
    );
    setNewNotice(newNotice.filter((item) => item.noticeId !== id));
  };

  const onEditNotice = async (id, newContent) => {
    await axios.patch(
      `http://13.125.111.131:8080/recruitment/${postId}/notice/${id}`,
      {
        content: newContent,
        checkVote: "",
      },
      {
        headers: {
          Authorization: window.localStorage.getItem("Authorization"),

          AuthorizationRefresh: window.localStorage.getItem(
            "AuthorizationRefresh"
          ),
        },
      }
    );

    setNewNotice(
      newNotice.map((item) =>
        item.noticeId === id ? { ...item, content: newContent } : item
      )
    );
  };
  const onVoteFinish = (id, votestate) => {
    setisChecked(votestate);
    setNewNotice(
      newNotice.map((item) =>
        item.noticeId === id ? { ...item, check: isChecked } : item
      )
    );
    fetchFinishVote(id);
  };

  const fetchAttend = async (noticeId) => {
    axios
      .post(
        `http://13.125.111.131:8080/recruitment/${postId}/notice/${noticeId}/vote/ATTENDANCE`,
        null,
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
        }
      )
      .then(() => {
        fetchNotice();
      });
  };

  const fetchNonAttend = async (noticeId) => {
    await axios
      .post(
        `http://13.125.111.131:8080/recruitment/${postId}/notice/${noticeId}/vote/NONATTENDANCE`,
        null,
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
        }
      )
      .then(() => {
        fetchNotice();
      });
  };

  const fetchUpdateAttend = async (attendMemberId, status) => {
    const params = {
      attendName: status,
    };
    await axios
      .put(
        `http://13.125.111.131:8080/recruitment/${postId}/attend/${attendMemberId}`,
        null,
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
          params,
        }
      )
      .then(() => {
        fetchNotice();
      });
  };

  const fetchFinishVote = async (noticeId) => {
    await axios
      .post(
        `http://13.125.111.131:8080/recruitment/${postId}/notice/${noticeId}/vote`,
        null,
        {
          headers: {
            Authorization: window.localStorage.getItem("Authorization"),

            AuthorizationRefresh: window.localStorage.getItem(
              "AuthorizationRefresh"
            ),
          },
        }
      )
      .then((response) => {
        setStation(response.data.value);
        fetchNotice();
      });
  };

  return (
    <div>
      {/* 현재 모집글의 글쓴이id와 현재 로그인한 유저의 id가 일치하는가?
          즉 글쓴이인지 확인 */}
      {user.userId === info.userId ? (
        <>
          <h1>공지사항 추가</h1>
          <div>
            <form>
              <NoticeWrap>
                <NoticeInput
                  placeholder="공지사항을 입력하세요"
                  value={notice}
                  onChange={(e) => setNotice(e.target.value)}
                />
                <VotingCheckDiv>
                  <label>
                    투표기능 포함
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => setisChecked(e.target.checked)}
                    />
                  </label>
                </VotingCheckDiv>
              </NoticeWrap>
              <NoticeAddBtnDiv>
                <NoticeAddBtn onClick={onSubmitNotice}> 등록하기</NoticeAddBtn>
              </NoticeAddBtnDiv>
            </form>
          </div>
          {/* 글쓴이인 경우로 author값에 true를 전달 */}
          {newNotice?.map((newnotice) => (
            <div key={newnotice.noticeId}>
              <NoticeItem
                author={true}
                newnotice={newnotice}
                onNoticeDelete={onNoticeDelete}
                onEditNotice={onEditNotice}
                onVoteFinish={onVoteFinish}
                fetchAttend={fetchAttend}
                fetchNonAttend={fetchNonAttend}
                fetchUpdateAttend={fetchUpdateAttend}
                fetchFinishVote={fetchFinishVote}
              />
            </div>
          ))}
        </>
      ) : (
        <>
          {/* 글쓴이가 아닌 경우
            author값에 false를 전달 */}
          <h1>공지사항</h1>

          {newNotice?.map((newnotice) => (
            <div key={newnotice.noticeId}>
              <NoticeItem
                author={false}
                newnotice={newnotice}
                onNoticeDelete={onNoticeDelete}
                onEditNotice={onEditNotice}
                onVoteFinish={onVoteFinish}
                fetchAttend={fetchAttend}
                fetchNonAttend={fetchNonAttend}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AddNotice;
