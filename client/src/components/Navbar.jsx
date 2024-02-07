import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import conf from "../../conf/conf";
import { loginFailure } from "../redux/userSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/initialize";
import UploadVideo from "./UploadVideo";
import youtubeLogo from "/youtubeLogo.png";
// Icons
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { fetchSuccess } from "../redux/videosSlice";

const Container = styled.div`
   display: flex;
   justify-content: space-between;
   background-color: ${({ theme }) => theme.bg};
   align-items: center;
   position: sticky;
   top: 0px;
   z-index: 2;
`;

const Img = styled.img`
   height: 3rem;
   /* padding: 1rem; */
   margin-left: 1rem;
`;

const HamburgerLogoWrapper = styled.div`
   display: flex;
   align-items: center;
   font-size: 1.8rem;
   padding: 0rem 1.5rem;
`;
const Button = styled.div`
   display: flex;
   font-size: 0.9rem;
   justify-content: center;
   align-items: center;
   /* border: 1px solid ${({ theme }) => theme.soft}; */
   background-color: ${({ theme }) => theme.soft};
   color: ${({ theme }) => theme.bg};
   cursor: pointer;
   border-radius: 2rem;
   gap: 0.4rem;
   margin-right: 1rem;
   padding: 0rem 0.6rem;
   min-width: 4rem;
   height: 4rem;

   &:hover {
      background-color: ${({ theme }) => `${theme.soft}9`};
   }
`;
const Input = styled.input`
   width: 100%;
   border: none;
   font-size: 1.6rem;
   background-color: transparent;
   color: #ddd;
   outline: none;
   padding-left: 2rem;
`;
const Search = styled.form`
   display: flex;
   border: 1.5px solid #393939;
   width: 35%;
   border-radius: 2rem;
`;
const Icon = styled.button`
   background-color: ${({ theme }) => theme.bgLighter};
   color: ${({ theme }) => theme.text};
   border: none;
   border-radius: 0 2rem 2rem 0;
   width: 12%;
   cursor: pointer;
   font-size: 2rem;

   &:hover {
      font-size: 2.2rem;
   }
`;

const Navbar = ({ display, setDisplay }) => {
  //  const youtubeLogo = "";
   const [openUploadVideo, setOpenUploadVideo] = useState(false);
   const [q, setQ] = useState("");
   const user = useSelector((state) => state.user.value);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const signout = async () => {
      signOut(auth)
         .then(() => {
            console.log("Sign-out successful.");
            // dispatch(loginFailure());
         })
         .catch((error) => {
            console.log(error);
         });
      await axios.get(`${conf.api}/user/auth/logout`, { withCredentials: true });
      // await axios.get("/api/user/auth/logout", { withCredentials: true });
      dispatch(loginFailure());
      // navigate(-1);
   };

   const searchVideos = async (e) => {
      e.preventDefault();
      if (q.trim() == "") {
         alert("Enter something");
         return;
      }

      let searchedVideos = [];
      let uniqueVideoId = [];

      let res = await axios.get(`${conf.api}/video/search?q=${q}`);
      // let res = await axios.get(`/api/video/search?q=${q}`);
      res.data?.data?.forEach((elem) => {
         searchedVideos.push(elem);
         //  if (!uniqueVideoId.includes(elem._id)) searchedVideos.push(elem);
         uniqueVideoId.push(elem._id);
      });
      // let searchedVideos = new Set(res);

      const qTags = q.replaceAll(" ", ",");
      res = await axios.get(`${conf.api}/video/tags?tags=${qTags}`);
      // res = await axios.get(`/api/video/tags?tags=${qTags}`);
      res.data?.data?.forEach((elem) => {
         if (!uniqueVideoId.includes(elem._id)) searchedVideos.push(elem);
      });

      dispatch(fetchSuccess(searchedVideos));
   };

   return (
      <>
         {openUploadVideo ? (
            <UploadVideo setOpenUploadVideo={setOpenUploadVideo} />
         ) : (
            ""
         )}
         <Container>
            <HamburgerLogoWrapper display={display}>
               <MenuIcon
                  sx={{ "font-size": "2.6rem", cursor: "pointer" }}
                  onClick={() => (display == 0 ? setDisplay(1) : setDisplay(0))}
               />
               <Img src={youtubeLogo} />
               <h3>YouTube</h3>
            </HamburgerLogoWrapper>

            <Search>
               <Input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => setQ(e.target.value)}
               />

               <Icon onClick={(e) => searchVideos(e)}>
                  <SearchIcon
                     sx={{
                        width: "45%",
                        height: "100%",
                     }}
                  />
               </Icon>
            </Search>

            {user ? (
               <div style={{ display: "flex", gap: "1rem" }}>
                  <Link to="profile">
                     {user.avatar ? (
                        <img
                           style={{
                              width: "4rem",
                              height: "4rem",
                              borderRadius: "50%",
                           }}
                           src={user?.avatar}
                           alt=""
                        />
                     ) : (
                        <Button>
                           <AccountCircleIcon sx={{ "font-size": "2.2rem" }} />
                        </Button>
                     )}
                  </Link>
                  <Button onClick={() => setOpenUploadVideo(!openUploadVideo)}>
                     <VideoCallIcon sx={{ "font-size": "2.5rem" }} />
                  </Button>
                  <Button onClick={signout}>
                     <LogoutIcon />
                  </Button>
               </div>
            ) : (
               <Link to="auth" style={{ textDecoration: "none" }}>
                  <Button>
                     <PermIdentityIcon sx={{ "font-size": "2rem" }} /> Sign in
                  </Button>
               </Link>
            )}
         </Container>
      </>
   );
};

export default Navbar;
