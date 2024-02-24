import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchSuccess, fetchFailure } from "../redux/videosSlice";
import axios from "axios";
import conf from "../../conf/conf";

// Icons
// import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
// import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import HistoryIcon from "@mui/icons-material/History";
import SlideshowIcon from "@mui/icons-material/Slideshow";
// import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
// import ScheduleIcon from "@mui/icons-material/Schedule";
// import ContentCutIcon from "@mui/icons-material/ContentCut";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
// import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
// import LocalMallIcon from "@mui/icons-material/LocalMall";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
// import MovieIcon from "@mui/icons-material/Movie";
// import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
// import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
// import NewspaperIcon from "@mui/icons-material/Newspaper";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
// import LightbulbIcon from "@mui/icons-material/Lightbulb";
// import DryCleaningIcon from "@mui/icons-material/DryCleaning";
// import PodcastsIcon from "@mui/icons-material/Podcasts";
// import SettingsIcon from "@mui/icons-material/Settings";
import LightModeIcon from "@mui/icons-material/LightMode";

const Container = styled.div`
   background-color: ${({ theme }) => theme.bg};
   /* width: 15%; */
   /* flex-grow: 1; */
   max-width: 20rem;
   /* min-width: 15%; */
   /* z-index: 2; */

   height: 90vh;
   /* max-height: 50rem; */
   position: sticky;
   //   top: 6rem;

   @media only screen and (max-width: 600px) {
      height: 100vh;
      max-width: none;
      width: 100%;
      display: ${({ display }) => (display ? "inline-block" : "none")};
      background-color: ${({ theme }) => theme.bg};
      opacity: 95%;
      position: fixed;
      z-index: 2;
      /* top: 55px; */
      /* position: absolute; */
   }
`;

const Img = styled.img`
   height: 5.5rem;
`;

const Item = styled.div`
   display: flex;
   /* display: ${({ display }) => (display ? "flex" : "none")}; */
   flex-direction: ${({ display }) => (display ? "row" : "column")};
   color: ${({ theme }) => theme.text};
   align-itemsArray: center;
   gap: ${({ display }) => (display ? "2.5rem" : "0.5rem")};
   padding: 1rem 1rem;
   border-radius: 0.8rem;
   font-size: 1.4rem;
   /* width: 100%; */

   &:hover {
      background-color: ${({ theme }) => theme.bgLighter};
   }

   @media only screen and (max-width: 600px) {
   }
`;

const Hr = styled.div`
   height: 1px;
   background-color: ${({ theme }) => theme.bgLighter};
   /* max-width: 90%; */
   margin: 1.5rem auto;
`;

const Button = styled.div`
   display: flex;
   font-size: 1.4rem;
   justify-content: center;
   align-itemsArray: center;
   background-color: ${({ theme }) => theme.soft};
   color: ${({ theme }) => theme.bg};
   cursor: pointer;
   border-radius: 2rem;
   padding: 0.2rem 0;
   gap: 0.4rem;
   margin: 1rem ;
   width: 50%;
   /* padding: 0rem 0.6rem; */
   /* min-width: 4rem; */

   &:hover {
      background-color: ${({ theme }) => `${theme.soft}9`};
   }
`;

const SignMenuSection = styled.div`
   padding-left: 1rem;
   font-size: 1.5rem;
   /* font-weight: 500; */
   max-width: 20rem;
`;

const Menu = ({ darkMode, setDarkMode, display, setDisplay }) => {
   const user = useSelector((state) => state.user.value);
   const dispatch = useDispatch();
   const location = useLocation();
   const pathVideo = location.pathname.split("/")[1];
   // const user = true;
   // console.log(user);

   const RenderItems = (itemsArray) => {
      return itemsArray?.map((Icon, index) => {
         if (Icon.icon == "h") {
            return (
               <Item display={display} key={index}>
                  <h5>{Icon.name}</h5>
               </Item>
            );
         } else if (Icon.icon == Hr) return <Hr key={index} />;
         else if (Icon.icon == SignMenu) return <SignMenu key={index} />;
         else
            return (
               <Link
                  to={Icon.path}
                  style={{ textDecoration: "none", fontSize: "1.4rem" }}
                  key={index}
               >
                  <Item display={display} key={index} onClick={Icon.onClick}>
                     <Icon.icon sx={{ "font-size": "2.7rem" }} />
                     <p style={{ whiteSpace: "nowrap" }}>{Icon.name}</p>
                  </Item>
               </Link>
            );
      });
   };

   const SignMenu = () => (
      <SignMenuSection>
         <p>Sign in to like videos, comment and subscribe.</p>

         <Link
            to="auth"
            style={{ textDecoration: "none", width: "100%", height: "100%" }}
         >
            <Button>
               {" "}
               <PermIdentityIcon sx={{ "font-size": "2.2rem" }} /> Sign in
            </Button>
         </Link>

         <Hr />
      </SignMenuSection>
   );

   const getHomeVideos = async () => {
      try {
         const res = await axios.get(`${conf.api}/video/random`);
         //  const res = await axios.get("/api/video/random");
         dispatch(fetchSuccess(res.data?.data));
      } catch (error) {
         dispatch(fetchFailure());
         console.log(error);
      }
   };
   const getTrendingVideos = async () => {
      try {
         const res = await axios.get(`${conf.api}/video/trend`);
         //  const res = await axios.get("/api/video/trend");
         dispatch(fetchSuccess(res.data?.data));
      } catch (error) {
         dispatch(fetchFailure());
         console.log(error);
      }
   };
   const getSubscriptionVideos = async () => {
      try {
         const res = await axios.get(`${conf.api}/video/subscribed`, {
            //  const res = await axios.get("/api/video/subscribed", {
            withCredentials: true,
         });
         dispatch(fetchSuccess(res.data?.data));
      } catch (error) {
         dispatch(fetchFailure());
         console.log(error);
      }
   };

   const closeMenu = ()=>{setDisplay(!display)}

   const closedHomeItems = [
      { icon: HomeIcon, name: "Home", path: "/" },
      { icon: LocalFireDepartmentIcon, name: "Tren..", path: "/trending" },
      // { icon: PlayCircleOutlineIcon, name: "Shorts", path: "/shorts" },
      { icon: VideoLibraryIcon, name: "Subs..", path: "/subscribed" },
      { icon: Hr, name: "" },
      { icon: SlideshowIcon, name: "You", path: "/profile" },
   ];

   const homeItems = [
      { icon: HomeIcon, name: "Home", path: "/", onClick: closeMenu},
      // { icon: PlayCircleOutlineIcon, name: "Shorts", path: "/shorts" },
      {
         icon: LocalFireDepartmentIcon,
         name: "Trending",
         path: "/trending",
         onClick: closeMenu
      },
      {
         icon: VideoLibraryIcon,
         name: "Subscription",
         path: "/subscribed",
         onClick: closeMenu
      },
      // { icon: SettingsIcon, name: "Test", path: "/test" },
      { icon: Hr, name: "" },
   ];

   const loginItems = [
      { icon: "h", name: "You" },
      { icon: PermIdentityIcon, name: "Your channel", path: "/profile", onClick: closeMenu },
      // { icon: HistoryIcon, name: "History" },
      { icon: SlideshowIcon, name: "Your Videos", path: "/profile" , onClick: closeMenu},
      // { icon: LightbulbCircleIcon, name: "Your Courses" },
      // { icon: ScheduleIcon, name: "Watch later" },
      // { icon: ContentCutIcon, name: "Your clips" },
      // { icon: ThumbUpOffAltIcon, name: "Liked videos" },
      // { icon: PlaylistPlayIcon, name: "Playlist" },
      // { icon: Hr, name: "" },

      // { icon: "h", name: "Subscription" },
      // { icon: PermIdentityIcon, name: "Code With Harry" },
      // { icon: PermIdentityIcon, name: "Harshit Vashisht" },
      // { icon: PermIdentityIcon, name: "free code camp" },
      // { icon: PermIdentityIcon, name: "chai aur code" },
      // { icon: PermIdentityIcon, name: "youtube" },
      // { icon: PermIdentityIcon, name: "striver" },
      // { icon: PermIdentityIcon, name: "pep coding" },
      { icon: Hr, name: "" },
   ];

   const logoutItems = [
      { icon: SlideshowIcon, name: "You" },
      { icon: HistoryIcon, name: "History" },
      { icon: Hr, name: "" },
      { icon: SignMenu, name: "" },
   ];

   const exploreItems = [
      { icon: "h", name: "Settings" },
      // { icon: "h", name: "Explore" },

      // { icon: LocalFireDepartmentIcon, name: "Trending", path: "/trending" },
      // {icon: LocalMallIcon, name: "Shopping" },
      // {icon: MusicNoteIcon, name: "Music" },
      // {icon: MovieIcon, name: "Movies" },
      // {icon: OnlinePredictionIcon, name: "Live" },
      // {icon: SportsEsportsIcon, name: "Gaming" },
      // {icon: NewspaperIcon, name: "News" },
      // {icon: EmojiEventsIcon, name: "Sports" },
      // {icon: LightbulbIcon, name: "Learning" },
      // {icon: DryCleaningIcon, name: "Fashion & Beauty" },
      // {icon: PodcastsIcon, name: "Podcasts" },
      // { icon: SettingsIcon, name: "Settings" }
   ];

   // const darkModeItem = [{
   //   icon: LightModeIcon, name: (darkMode) ? "Dark Mode" : "Light Mode",
   //   onClick: () => (darkMode == 1) ? setDarkMode(0) : setDarkMode(1),
   //   path: null
   // }]

   return (
      <Container display={display}>
         {!display && pathVideo != "video" ? RenderItems(closedHomeItems) : ""}
         {display ? RenderItems(homeItems) : ""}
         {display && user ? RenderItems(loginItems) : ""}
         {display && !user ? RenderItems(logoutItems) : ""}
         {display ? RenderItems(exploreItems) : ""}
         {/* {(display) ? RenderItems(darkModeItem) : ""} */}
         {display ? (
            <Item
               display={display}
               onClick={() => (darkMode == 1 ? setDarkMode(0) : setDarkMode(1))}
            >
               <LightModeIcon sx={{ "font-size": "2.7rem" }} />
               <p>{darkMode ? "Dark Mode" : "Light Mode"}</p>
            </Item>
         ) : (
            ""
         )}
      </Container>
   );
};

export default Menu;
