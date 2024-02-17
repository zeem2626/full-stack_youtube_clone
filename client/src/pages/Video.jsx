import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase/initialize.js";
import VideoDeleteConfirmation from "../components/VideoDeleteConfirmation.jsx";

// Icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Image from "../components/utilities/CircularIconImage";
import Comment from "../components/Comment";
import RecommendatioSection from "../components/RecommendatioSection";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import conf from "../../conf/conf.js";
import { format } from "timeago.js";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Container = styled.div`
  display: flex;
  /* margin: 1rem auto; */
  margin-top: 1rem;
  min-height: 100vh;
  padding-bottom: 2rem;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const VideoAndCommentSection = styled.div`
  width: 72%;
  /* margin: 0 2rem; */
  margin: auto;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;
const VideoWrapper = styled.div``;
const VideoDetailsWrapper = styled.div`
  @media only screen and (max-width: 600px) {
    width: 97%;
    margin: auto;
  }
`;
const Video = styled.video`
  width: 100%;
  border: none;
  border-radius: 3rem;

  @media only screen and (max-width: 600px) {
    border-radius: 0;
  }
`;
const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, subscribe }) =>
    subscribe ? theme.text : theme.bgLighter};
  color: ${({ theme, subscribe }) =>
    subscribe ? theme.bgLighter : theme.text};
  /* color: ${({ theme }) => theme.text}; */
  border: none;
  gap: 0.4rem;
  font-size: 1.4rem;
  padding: 0.5rem 0.8rem;
  border-radius: 2rem;
  cursor: pointer;

  @media only screen and (max-width: 600px) {

  }
`;

const PTextSoft = styled.div`
/* font-size: 1.4rem; */
  color: ${({ theme }) => theme.textSoft};
`;

const ChannelInfo = styled.div`
  font-size: 1.4rem;
  align-items: center;
  gap: 0.7rem;
  @media only screen and (max-width: 600px) {
    display: flex;
  }
`;
const ChannelInfoWrapper = styled.div`
  max-width: 30%;
  display: flex;
  align-items: center;
  font-size: 1rem;
  gap: 1rem;
  /* border: 2px solid red; */

  @media only screen and (max-width: 600px) {
    max-width: 100%;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
  padding: 1rem 0rem;
  gap: 3rem;
  /* justify-content: space-around; */

  /* border: 2px solid green; */

  justify-content: flex-end;
  @media only screen and (max-width: 600px) {
    justify-content: flex-start;
    overflow: scroll;
    /* flex-wrap: wrap; */
    gap: 1rem;
    /* width: 90%; */
    /* border: 1px solid red; */
  }
`;
const Wrapper1 = styled.div`
  display: flex;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const DescriptionContent = styled.div`
  padding-top: 1rem;
  line-height: 2.3rem;
  max-height: ${({ maxheight }) => (maxheight ? "5rem" : "")};
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Description = styled.div`
  /* width: 100%; */
  background-color: ${({ theme }) => theme.bgLighter};
  line-height: 2rem;
  font-size: 1.5rem;
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 1.5rem;
`;

const Videos = () => {
  const user = useSelector((state) => state.user.value);
  const location = useLocation();
  const [maxheight, setmaxheight] = useState(1);
  const [video, setVideo] = useState({});
  const [channel, setChannel] = useState({});
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  const videoId = location.pathname.split("/")[2];

  const loginAlert = () => {
    if (!user) {
      alert("Login to continue");
      throw "Unauthorized access";
    }
  };

  const getVideoAndChannel = async () => {
    try {
      const addView = await axios.get(`${conf.api}/video/view/${videoId}`);
      //  const addView = await axios.get(`/api/video/view/${videoId}`);
      const videoRes = await axios.get(`${conf.api}/video/get/${videoId}`);
      //  const videoRes = await axios.get(`/api/video/get/${videoId}`);
      setVideo(videoRes.data?.data);

      const channelRes = await axios.get(
        `${conf.api}/user/${videoRes.data.data?.userId}`
        // `/api/user/${videoRes.data.data?.userId}`
      );
      setChannel(channelRes.data?.data);
    } catch (error) {
      setVideo({});
      setChannel({});
      // alert(error?.response?.data?.message || error.message)
      console.log(error?.response?.data?.message || error.message);
      navigate(-1);
    }
  };

  const likeVideo = async () => {
    try {
      loginAlert();
      const res = await axios.get(`${conf.api}/user/like/${videoId}`, {
        withCredentials: true,
      });
      //  const res = await axios.get(`/api/user/like/${videoId}`);
      setVideo(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const dislikeVideo = async () => {
    try {
      loginAlert();
      const res = await axios.get(`${conf.api}/user/dislike/${videoId}`, {
        withCredentials: true,
      });
      //  const res = await axios.get(`/api/user/dislike/${videoId}`);
      setVideo(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeChannel = async () => {
    try {
      loginAlert();
      let res;
      if (channel.subscribers.includes(user?._id)) {
        res = await axios.get(`${conf.api}/user/unsubscribe/${channel._id}`, {
          withCredentials: true,
        });
        // res = await axios.get(`/api/user/unsubscribe/${channel._id}`);
      } else {
        res = await axios.get(`${conf.api}/user/subscribe/${channel._id}`, {
          withCredentials: true,
        });
        // res = await axios.get(`/api/user/subscribe/${channel._id}`);
      }

      setChannel(res.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVideo = async () => {
    try {
      if (video.videoUrl) {
        const arr = video.videoUrl.split("%2F");
        const fileName = arr[2].split("?")[0].replaceAll("%20", " ");
        const videoRef = ref(storage, `youtube-clone/video/${fileName}`);
        console.log(fileName);

        await deleteObject(videoRef)
          .then(() => {
            console.log("Firebase video deleted");
          })
          .catch((error) => {
            console.log("video");
            console.log(error);
            //  navigate(-1);
            //  alert("Video deleted successfully");
          });
      }
      if (video.thumbnail) {
        const arr = video.thumbnail.split("%2F");
        const fileName = arr[2].split("?")[0].replaceAll("%20", " ");
        const videoRef = ref(storage, `youtube-clone/thumbnail/${fileName}`);
        console.log(fileName);

        await deleteObject(videoRef)
          .then(() => {
            console.log("Firebase thumbnail deleted");
          })
          .catch((error) => {
            console.log("thumbnail");
            console.log(error);
            //  navigate(-1);
            //  alert("Video deleted successfully");
          });
      }

      const res = await axios.delete(`${conf.api}/video/${videoId}`, {
        //  const res = await axios.delete(`/api/video/${videoId}`, {
        withCredentials: true,
      });

      console.log(res);
      setDeleteConfirmation(false);
      navigate(-1);
    } catch (error) {
      setDeleteConfirmation(false);
      console.log(error);
      navigate(-1);
    }
  };

  useEffect(() => {
    getVideoAndChannel();
  }, [videoId]);

  return (
    <>
      {deleteConfirmation ? (
        <VideoDeleteConfirmation
          setDeleteConfirmation={setDeleteConfirmation}
          deleteVideo={deleteVideo}
        />
      ) : (
        ""
      )}
      <Container>
        <VideoAndCommentSection>
          <VideoWrapper>
            <Video
              //  width="100%"
              //  height="100%"
              src={video.videoUrl}
              autoPlay
              controls
            ></Video>
          </VideoWrapper>

          <VideoDetailsWrapper>
            <h2 style={{ padding: "1rem 0rem",fontSize: "1.8rem" }}>{video.title || "Title"}</h2>

            <Wrapper1>
              <ChannelInfoWrapper>
                <Image src={channel.avatar} size="3.5" />
                <ChannelInfo>
                  <h4>{channel.fullName || "Channel name"}</h4>
                  <PTextSoft>{channel.subscribers?.length} Subscribers</PTextSoft>
                </ChannelInfo>
                <Button subscribe={1} onClick={subscribeChannel}>
                  {channel.subscribers?.includes(user?._id)
                    ? "Unsubscribe"
                    : "Subscribe"}{" "}
                </Button>
              </ChannelInfoWrapper>

              <ButtonsContainer>
                {channel?._id == user?._id ? (
                  <Button onClick={() => setDeleteConfirmation(true)}>
                    <DeleteForeverIcon sx={{ fontSize: "2rem" }} />
                  </Button>
                ) : (
                  ""
                )}
                <Button onClick={likeVideo}>
                  {video.likes?.includes(user?._id) ? (
                    <ThumbUpIcon sx={{ fontSize: "2rem" }} />
                  ) : (
                    <ThumbUpOutlinedIcon sx={{ fontSize: "2rem" }} />
                  )}
                  {video.likes?.length}
                </Button>
                <Button onClick={dislikeVideo}>
                  {video.dislikes?.includes(user?._id) ? (
                    <ThumbDownAltIcon sx={{ fontSize: "2rem" }} />
                  ) : (
                    <ThumbDownOutlinedIcon sx={{ fontSize: "2rem" }} />
                  )}
                  {video.dislikes?.length}
                </Button>
                <Button>
                  <ReplyIcon sx={{ fontSize: "2rem" }} />
                  Share
                </Button>
                <Button>
                  <ScheduleIcon sx={{ fontSize: "2rem" }} /> Watch later
                </Button>
              </ButtonsContainer>
            </Wrapper1>

            <Description>
              <PTextSoft style={{fontWeight: "500"}}>
                {video.views} views . {format(video.createdAt)}
              </PTextSoft>
              <DescriptionContent maxheight={maxheight}>
                {video.description}
              </DescriptionContent>

              <button
                style={{
                  backgroundColor: "transparent",
                  color: "#aaa",
                  border: "none",
                  fontWeight: "600",
                  fontSize: "1.49rem",
                  paddingTop: "0.7rem ",
                }}
                onClick={() => setmaxheight(!maxheight)}
              >
                {maxheight ? "See More..." : "See Less"}
              </button>
            </Description>
            <Comment videoId={videoId} />
          </VideoDetailsWrapper>
        </VideoAndCommentSection>

        <RecommendatioSection
          key={video._id}
          videoId={videoId}
          videoTags={video.tags}
          size="3.2"
        />
      </Container>
    </>
  );
};

export default Videos;
