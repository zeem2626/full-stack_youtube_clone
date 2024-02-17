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
import { refresh } from "../redux/loadingSlice";
import Image from "./utilities/CircularIconImage";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.bg};
  align-items: center;
  position: sticky;
  top: 0rem;
  padding: 1rem;
  z-index: 2;

  @media only screen and (max-width: 600px) {
    padding: 1rem 0.1rem;
    /* flex-direction: column; */
  }
`;

const Img = styled.img`
  height: 3rem;
  /* padding: 1rem; */

  margin-left: 1rem;
  @media only screen and (max-width: 600px) {
    margin: 0;
  }
`;

const HamburgerLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  gap: 0.5rem;
  /* border:1px solid red; */

  @media only screen and (max-width: 600px) {
    gap: 0rem;
  }
`;
const YoutubeHeading = styled.div`
  font-size: 2.2rem;
  font-weight: 600;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 1rem;

  @media only screen and (max-width: 600px) {
    gap: 0.3rem;
  }
`;
const Button = styled.button`
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.5rem;
  border: none;
  border-radius: 2rem;
  background-color: ${({ theme }) => theme.soft};
`;
const ButtonCircle = styled.div`
  display: flex;
  font-size: 0.9rem;
  justify-content: center;
  align-items: center;
  /* flex-shrink: 1; */
  /* border: 1px solid #f77; */
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.bg};
  cursor: pointer;
  border-radius: 2rem;
  gap: 0.4rem;
  /* margin-right: 1rem; */
  padding: 0rem 0.6rem;
  /* max-width: 4rem; */
  width: 3rem;
  /* height: 4rem; */

  &:hover {
    background-color: ${({ theme }) => `${theme.soft}9`};
  }

  @media only screen and (max-width: 600px) {
  }
`;
const Input = styled.input`
  width: 100%;
  border: none;
  font-size: 1.6rem;
  background-color: transparent;
  color: #ddd;
  outline: none;
  padding: 0.5rem 1rem;
`;
const Search = styled.form`
  display: flex;
  border: 1.5px solid #393939;
  width: 35%;
  border-radius: 2rem;
  /* padding: 0.2rem; */

  @media only screen and (max-width: 600px) {
    margin: 0 0.3rem;
    /* padding: 0.2rem 0; */
    /* padding:0 0rem; */
    flex-grow: 1;
    /* width: 100%; */
    /* min-width: 3rem;
      height: 3rem; */
  }
`;
const Icon = styled.button`
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 0 2rem 2rem 0;
  width: 13%;
  cursor: pointer;
  /* font-size: 1rem; */

  &:hover {
    font-size: 2.2rem;
  }

  @media only screen and (max-width: 600px) {
    width: 22%;
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
        console.log("Google Sign-out");
        // dispatch(loginFailure());
      })
      .catch((error) => {
        console.log(error);
      });
    const res = await axios.get(`${conf.api}/user/auth/logout`, {
      withCredentials: true,
    });
    console.log(res.data.message);
    // await axios.get("/api/user/auth/logout", { withCredentials: true });
    dispatch(loginFailure());
    dispatch(refresh());
    // navigate(-1);
  };

  const searchVideos = async (e) => {
    e.preventDefault();
    if (q.trim() == "") {
      alert("Enter something");
      return;
    }

    const keyWord = q.toLowerCase()

    let searchedVideos = [];
    let uniqueVideoId = [];

    let res = await axios.get(`${conf.api}/video/search?q=${keyWord}`);
    // let res = await axios.get(`/api/video/search?q=${q}`);
    res.data?.data?.forEach((elem) => {
      searchedVideos.push(elem);
      //  if (!uniqueVideoId.includes(elem._id)) searchedVideos.push(elem);
      uniqueVideoId.push(elem._id);
    });
    // let searchedVideos = new Set(res);

    const qTags = keyWord.replaceAll(" ", ",");
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
          <YoutubeHeading display={display}>YouTube</YoutubeHeading>
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
          <ButtonWrapper>
            <Link to="profile">
              {user.avatar ? (
                // <img
                //    style={{
                //       width: "4rem",
                //       height: "4rem",
                //       borderRadius: "50%",
                //    }}
                //    //  src={user?.avatar}
                //    alt=""
                //    />

                <Image src={user?.avatar} size="3" />
              ) : (
                <ButtonCircle>
                  <AccountCircleIcon sx={{ "font-size": "2.2rem" }} />
                </ButtonCircle>
              )}
            </Link>
            <ButtonCircle onClick={() => setOpenUploadVideo(!openUploadVideo)}>
              <VideoCallIcon sx={{ "font-size": "2.5rem" }} />
            </ButtonCircle>
            <ButtonCircle onClick={signout}>
              <LogoutIcon />
            </ButtonCircle>
          </ButtonWrapper>
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
