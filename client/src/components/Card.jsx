import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { format } from "timeago.js";
import axios from "axios";
import conf from "../../conf/conf";
import Image from "./utilities/CircularIconImage";

const Container = styled.div`
  color: ${({ theme }) => theme.textSoft};
  width: 23.5%;
  height: 100%;
  cursor: pointer;
  transition: padding-top 0.25s;
  /* padding-top: 0.2rem; */

  &:hover {
    padding-top: 0;
    filter: brightness(80%);
  }

  @media only screen and (max-width: 600px) {
    width: 100%;

    /* padding: 0rem; */
    /* transition: none; */
    &:hover {
      filter: brightness(100%);
    }
  }
`;
const Img = styled.img`
  width: 100%;
  height: 20rem;
  border-radius: 1rem;
  /* height: 12vw; */
  /* @media only screen and (max-width: 600px) {
     height: 50vw;
    } */
  @media only screen and (max-width: 600px) {
    border-radius: 0;
  }
`;
const ChannelImgWrapper = styled.div`
  width: 10%;
`;

const Details = styled.div`
  margin-left: 0.7rem;
  max-width: 85%;
`;
const Wrapper = styled.div`
  display: flex;
  /* border: 2px solid yellow; */
  padding: 0.4rem 0.2rem 0 0.4rem ;
`;
const Title = styled.div`
  color: ${({ theme }) => theme.text};
  font-weight: 500;
  text-decoration: none;
  font-size: 1.4rem;
  margin-bottom: 0.2rem;
  line-height: 1.8rem;
  max-height: 3.6rem;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const VideoInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.textSoft};
  font-size: 1.4rem;
  gap: 0.1rem;

  @media only screen and (max-width: 600px) {
    flex-direction: row;
    gap: 0.6rem;
  }
`;

const Card = ({
  videoId,
  userId,
  videoUrl,
  thumbnail,
  title,
  views,
  creationTime,
}) => {
  const [channelInfo, setChannelInfo] = useState([]);

  // console.log(thumbnail);
  const getChannel = async () => {
    // if(userId){
    const res = await axios.get(`${conf.api}/user/${userId}`);
    // const res = await axios.get(`/api/user/${userId}`);
    // console.log(userId);
    setChannelInfo(res.data.data);
    // }
  };

  useEffect(() => {
    getChannel();
    console.log("Card");
  }, []);

  return (
    <Container>
      <Link
        to={`/video/${videoId}`}
        style={{
          display: "block",
          textDecoration: "none",
          height: "100%",
          width: "100%",
          // fontSize: "1.8rem"
        }}
      >
        <Img src={thumbnail} />

        <Wrapper>
          <ChannelImgWrapper>
            {/* <ChannelImg src={channelInfo.avatar} /> */}
            <Image src={channelInfo.avatar} size="3.2" />
          </ChannelImgWrapper>

          <Details>
            <Title> {title} </Title>
            <VideoInfo>
              {/* <p>{channelInfo.userName}</p> */}
              <p>{channelInfo.fullName}</p>
              <p>
                {views} views . {format(creationTime)}
              </p>
            </VideoInfo>
          </Details>
        </Wrapper>
      </Link>
    </Container>
  );
};

export default Card;
