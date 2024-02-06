import { React, useState, useEffect, useMemo } from "react";
import axios from "axios";
import conf from "../../conf/conf";
import styled from "styled-components";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { fetchFailure, fetchSuccess } from "../redux/videosSlice";

const Container = styled.div`
   display: flex;
   flex-wrap: wrap;
   /* justify-content: space-evenly; */
   width: 100%;
   min-height: 100vh;
   padding: 3rem 0rem 5rem 2rem;
   gap: 4rem 1.5rem;
   z-index: -1;
`;

const Home = ({ type }) => {
   let user = useSelector((state) => state.user.value);
   let loading = useSelector((state) => state.loading.status);
   const videos = useSelector((state) => state.videos.value);
   const dispatch = useDispatch();

   const getVideos = async () => {
      try {
         let res;
          if (type == "profile") {
             res = await axios.get(`${conf.api}/video/get/my/${user?._id}`, {
            //  res = await axios.get(`/api/video/get/my/${user?._id}`, {
              withCredentials: true,
            });
          } else {
             res = await axios.get(`${conf.api}/video/${type}`, {
            //  res = await axios.get(`/api/video/${type}`, {
                withCredentials: true,
             });
          }
         dispatch(fetchSuccess(res.data?.data));
      } catch (error) {
         dispatch(fetchFailure());
         console.log(error);
         // alert(error?.response?.data?.message || error.message)
      }
   };

   useEffect(() => {
      // if (videos.length <= 0) getVideos();
      getVideos();

      console.log("Home");
   }, [type]);

   return (
      <Container>
         {videos?.length <= 0 ? (
            <h1>No videos available </h1>
         ) : (
            videos?.map((elem, i) => (
               <Card
                  key={elem._id}
                  videoId={elem._id}
                  userId={elem.userId}
                  thumbnail={elem.thumbnail}
                  videoUrl={elem.videoUrl}
                  title={elem.title}
                  views={elem.views}
                  creationTime={elem.createdAt}
               />
            ))
         )}
      </Container>
   );
};

export default Home;
