import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { loadingStart } from "../redux/loadingSlice";

import {
   ref,
   uploadBytesResumable,
   getDownloadURL,
   deleteObject,
} from "firebase/storage";
import { storage } from "../firebase/initialize";
import { fetchSuccess } from "../redux/videosSlice";

const Container = styled.div`
   display: flex;
   justify-content: center;
   margin-top: 3rem;
   /* z-index: -1; */
`;
const InputFile = styled.input`
   border: 1px solid red;
   width: 15rem;
   height: 15rem;
   border-radius: 50%;
   opacity: 0;
   cursor: pointer;
`;
const Input = styled.input`
   background-color: transparent;
   color: ${({ theme }) => theme.text};
   /* border: 1px solid ${({ theme }) => theme.bgLighter}; */
   border: ${({ theme, readOnly }) =>
      readOnly ? "none" : `1px solid ${theme.bgLighter}`};

   border-radius: 1rem;
   font-size: 1.8rem;
   padding: 0rem 1rem;
   outline: none;
   height: 4.4rem;
   cursor: ${({ readOnly }) => (readOnly ? "" : "pointer")};
`;

const Image = styled.img`
   width: 15rem;
   height: 15rem;
   border-radius: 50%;
   position: absolute;
   z-index: -1;
`;

const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   gap: 0.4rem;
   margin-left: 1rem;
`;

const P = styled.p`
   max-width: 30rem;
   line-height: 1.6rem;
   max-height: 3rem;
   margin: 0.6rem 0;
   /* display: flex; */
   /* flex-direction: column; */
   /* white-space: wrap; */
   text-overflow: ellipsis;
   /* border:1px solid red; */
   overflow: hidden;
`;

const Button = styled.button`
   background-color: ${({ theme }) => theme.bgLighter};
   color: ${({ theme }) => theme.text};
   width: 40%;
   max-width: 20rem;
   /* margin: auto; */
   border-radius: 2rem;
   font-size: 1.5rem;
   padding: 0.6rem;
   border: none;
   cursor: pointer;
`;

const Profile = () => {
   const user = useSelector((state) => state.user.value);
   const videos = useSelector((state) => state.videos.value);
   const loading = useSelector((state) => state.loading.status);
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const [editProfile, setEditProfile] = useState(true);
   const [readonly, setReadonly] = useState(true);

   const [userName, setUserName] = useState("");
   const [fullName, setFullName] = useState("");
   const [email, setEmail] = useState("");
   const [avatar, setAvatar] = useState(null);

   const imageRef = useRef("");

   const uploadFile = (file) => {
      return new Promise((resolve, reject) => {
         if (!file) {
            throw { code: "Unavailable details" };
         }
         const storageRef = ref(
            storage,
            `youtube-clone/avatar/` + `${user.userName}_${Date.now()}`
         );
         const uploadTask = uploadBytesResumable(storageRef, file);

         uploadTask.on(
            "state_changed",
            (snapshot) => {
               const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setAvatar(`Uploading : ${Math.round(progress)} %`);
               if (snapshot.state == "paused") {
                  setAvatar("paused");
               }
               console.log("Upload is " + progress + "% done");
               console.log(`Upload is paused ${snapshot.state}`);
            },
            (error) => {
               console.log(error);
               reject(error);
            },
            () => {
               getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  resolve(downloadURL);
               });
            }
         );
      });
   };

   const updateProfileDetails = async () => {
      if (!user) {
         alert("Login to update avatar");
         return;
      }
      try {
         setEditProfile(!editProfile);
         setReadonly(!readonly);

         if (editProfile) return;

         if (
            userName.trim() == "" ||
            fullName.trim() == "" ||
            email.trim() == ""
         ) {
            alert("Incomplete details");
            return;
         }

         const res = await axios.post(
            "/api/user//update-user",
            { userName, fullName, email },
            { withCredentials: true }
         );

         dispatch(loginSuccess(res.data?.data));
         console.log("Updated");
         alert("User updated");
      } catch (error) {
         alert(error.response?.data?.message || error.message);
      }
   };

   const updateAvatar = async () => {
      if (!user) {
         alert("Login to update avatar");
         return;
      }
      const avatarUrl = await uploadFile(avatar);
      console.log(avatarUrl);

      const res = await axios.post(
         "/api/user/update-avatar",
         { avatar: avatarUrl },
         { withCredentials: true }
      );

      // delete previous avatar from firebase
      if (user.avatar) {
         const arr = user.avatar?.split("%2F");
         const fileName = arr[2].split("?")[0].replaceAll("%20", " ");
         const avatarRef = ref(storage, `youtube-clone/avatar/${fileName}`);

         deleteObject(avatarRef)
            .then(() => {
               console.log("File deleted successfully");
            })
            .catch((error) => {
               console.log(error);
            });
      }

      dispatch(loginSuccess(res.data?.data));
      // console.log(res.data);
      alert("Avatar updated");
      setAvatar(null);
   };

   const getMyVideos = async () => {
      try {
         const res = await axios.get(`/api/video/get/my/${user?._id}`, {
            withCredentials: true,
         });
         console.log(res.data?.data);
         dispatch(fetchSuccess(res.data?.data));
      } catch (error) {
         console.log(error);
      }
   };
   const check = () => {
      // const image = imageRef.current?.files[0]?.name;
      const image = user.avatar;
      console.log(image);
   };

   useEffect(() => {
      if (!user) {
         navigate(-1);
      }
      if (user) {
         setUserName(user?.userName);
         setFullName(user?.fullName);
         setEmail(user?.email);
         getMyVideos();
      }
      console.log("Profile");
   }, []);

   return (
      <>
         <Container>
            <div>
               <Image
                  src={user?.avatar}
                  alt=" Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar Update Avatar"
               ></Image>
               <InputFile
                  type="file"
                  ref={imageRef}
                  onChange={() => setAvatar(imageRef.current?.files[0])}
               ></InputFile>
               {avatar ? (
                  <>
                     <P>{avatar.name || avatar}</P>
                     <Button onClick={updateAvatar} style={{ width: "100%" }}>
                        Update Avatar
                     </Button>
                  </>
               ) : (
                  ""
               )}
            </div>
            <Wrapper>
               <Input
                  style={{ fontSize: "2.2rem", fontWeight: "600" }}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  value={fullName}
                  readOnly={readonly}
               />

               <Input
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  value={userName}
                  readOnly={readonly}
               />
               <Input
                  type="text"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  readOnly={readonly}
               />
               <Button onClick={updateProfileDetails}>
                  {editProfile ? "Edit" : "Save"}{" "}
               </Button>
            </Wrapper>
         </Container>
         <h1 style={{ margin: "1rem 0 0 2rem" }}>Your Videos </h1>
      </>
   );
};

export default Profile;
