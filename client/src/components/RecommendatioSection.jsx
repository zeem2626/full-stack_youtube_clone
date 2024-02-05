import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import axios from "axios";
import { Link } from "react-router-dom";

const Container = styled.div`
   max-width: 25%;
`;
const Wrapper = styled.div`
   display: flex;
   /* max-width: 40rem; */
   padding: 0.4rem 0 0.4rem 2rem;
   color: ${({ theme }) => theme.text};
`;
const Img = styled.img`
   width: 100%;
   height: 100%;
`;

const Image = styled.div`
   width: ${({ size }) => (size / 3) * 16}rem;
   height: ${({ size }) => (size / 3) * 9}rem;
   border-radius: 1rem;
   overflow: hidden;
`;

const Details = styled.div`
   line-height: 2.2rem;
   height: 8rem;
   font-size: 1.43rem;
   max-width: 55%;
   padding-left: 1rem;
`;

const RecommendatioCard = ({
   userId,
   thumbnail,
   title,
   views,
   createdAt,
   size,
}) => {
   const [channel, setChannel] = useState([]);

   const getChannel = async () => {
      try {
         const res = await axios.get(`/api/user/${userId}`);
         //  console.log(res.data?.data);
         setChannel(res.data?.data);
      } catch (error) {
         console.log(error);
         setChannel([]);
      }
   };
   useEffect(() => {
      getChannel();
      console.log("Recommendation");
   }, []);

   return (
      <Wrapper>
         <Image size={size}>
            <Img src={thumbnail} />
         </Image>

         <Details>
            <div
               style={{
                  lineHeight: "2rem",
                  height: "4rem",
                  overflow: "hidden",
                  fontWeight: "600",
                  textOverflow: "ellipsis",
               }}
            >
               {title}
            </div>
            <p style={{ color: "#999" }}>{channel?.fullName}</p>
            <p style={{ color: "#999" }}>
               {views} views . {format(createdAt)}
            </p>
         </Details>
      </Wrapper>
   );
};
const RecommendatioSection = ({ videoId, videoTags, size }) => {
   const [recommendationVideos, setRecommendationVideos] = useState([]);

   const getRecommendation = async () => {
      if (videoTags) {
         const qTags = videoTags.join();
         const res = await axios.get(`/api/video/tags?tags=${qTags}`);

         //  console.log(res.data?.data);
         setRecommendationVideos(res.data?.data);
      }
   };

   useEffect(() => {
      getRecommendation();
   }, [videoId]);

   return (
      <Container>
         {recommendationVideos.map((elem) => (
            <Link to={`/video/${elem._id}`} style={{ textDecoration: "none" }}>
               <RecommendatioCard
                  userId={elem.userId}
                  thumbnail={elem.thumbnail}
                  title={elem.title}
                  views={elem.views}
                  createdAt={elem.createdAt}
                  size={size}
                  key={elem._id}
               />
            </Link>
         ))}
      </Container>
   );
};

export default RecommendatioSection;
