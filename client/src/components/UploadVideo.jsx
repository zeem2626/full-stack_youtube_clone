import React, { useRef, useState } from "react";
import styled from "styled-components";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/initialize";
import axios from "axios";
import conf from "../../conf/conf";
import { useSelector } from "react-redux";

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   position: fixed;
   font-size: 1.6rem;
   border-radius: 2rem;
   width: 99vw;
   height: 100vh;
   background-color: #3335;
   /* opacity: 0.3; */
   z-index: 3;
`;

const TextArea = styled.textarea`
   width: 90%;
   margin: auto;
   margin: 1rem auto 5rem auto;
   background-color: transparent;
   border: 1px solid ${({ theme }) => theme.bgLighter};
   color: ${({ theme }) => theme.text};
   outline: none;
   padding: 1.5rem 1rem;
   border-radius: 1rem;
`;
const Label = styled.label`
   width: 90%;
   margin: auto;
   color: ${({ theme }) => theme.textSoft};
`;
const Input = styled.input`
   width: 90%;
   margin: auto;
   margin: 1rem auto 4rem auto;
   background-color: transparent;
   color: ${({ theme }) => theme.text};
   border: 1px solid ${({ theme }) => theme.bgLighter};
   outline: none;
   padding: 1.5rem 1rem;
   border-radius: 1rem;
   cursor: pointer;
`;
const Wrapper = styled.div`
   display: flex;
   flex-direction: column;
   border-radius: 2rem;
   padding: 1rem 0;
   background-color: ${({ theme }) => theme.bg};
   width: 90%;
   max-width: 100rem;
`;

const Wrapper2 = styled.div`
   display: flex;
   justify-content: space-between;
   padding: 0 1rem;
`;
const H1 = styled.h1`
   width: 90%;
   font-size: 3rem;
   font-weight: 600;
   text-align: center;
   color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
   width: 90%;
   margin: auto;
   margin-bottom: 5rem;
   background-color: transparent;
   border: 1px solid ${({ theme }) => theme.bgLighter};
   color: ${({ theme }) => theme.text};
   font-size: 1.8rem;
   outline: none;
   padding: 1.5rem 1rem;
   border-radius: 1rem;
   cursor: pointer;
`;

const UploadingSpan = styled.span`
   font-size: 1.6rem;
   font-weight: 600;
   color: ${({ theme }) => theme.text};
`;

const UploadVideo = ({ setOpenUploadVideo }) => {
   const [uploadingProgress, setUploadingProgress] = useState(0);
   const videoRef = useRef();
   const thumbnailRef = useRef();
   const titleRef = useRef("");
   const tagsRef = useRef("");
   const descriptionRef = useRef("");

   const user = useSelector((state) => state.user.value);

   const uploadFile = ({ file, fileType }) => {
      return new Promise((resolve, reject) => {
         if (!file || (fileType != "video" && fileType != "thumbnail")) {
            throw { code: "Unavailable details" };
         }
         const storageRef = ref(
            storage,
            `youtube-clone/${fileType}/` + `${user.userName}_${Date.now()}`
         );
         const uploadTask = uploadBytesResumable(storageRef, file);

         uploadTask.on(
            "state_changed",
            (snapshot) => {
               const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
               setUploadingProgress(Math.round(progress));
               if (snapshot.state == "paused") {
                  setUploadingProgress("paused");
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

   const manageUpload = async () => {
      if (!user) {
         alert("Login to upload video");
         return;
      }
      const video = videoRef.current.files[0];
      const thumbnail = thumbnailRef.current.files[0];
      const title = titleRef.current.value;
      const tags = tagsRef.current.value;
      const description = descriptionRef.current.value;

      if (
         title.trim() == "" ||
         description.trim() == "" ||
         tags.trim() == "" ||
         !video ||
         !thumbnail
      ) {
         alert("Incomplete details");
         return;
      }
      const videoUrl = await uploadFile({ file: video, fileType: "video" });
      const thumbnailUrl = await uploadFile({
         file: thumbnail,
         fileType: "thumbnail",
      });

      // const videoUrl = "Hello check";
      // const thumbnailUrl = "Hello check";

      if (!videoUrl || !thumbnailUrl) {
         alert("Files did not uploaded successfully");
         return;
      }

      const res = await axios.post(
        `${conf.api}/video/upload`,
        //  "/api/video/upload",
         { title, tags, description, videoUrl, thumbnailUrl },
         { withCredentials: true }
      );

      console.log(res.data.data);
      alert("Video uploaded successfully");
      setOpenUploadVideo(false);
   };

   const check = () => {
      // console.log(videoUrl);
      // console.log(thumbnailUrl);
   };

   return (
      <Container>
         <Wrapper>
            <Wrapper2>
               <H1> Upload Video </H1>
               <h2
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenUploadVideo(false)}
               >
                  X
               </h2>
            </Wrapper2>
            {/* <div> */}
            <Label>
               Video
               {uploadingProgress > 0 ? (
                  <UploadingSpan>
                     &nbsp; Uploading : {uploadingProgress} %
                  </UploadingSpan>
               ) : (
                  ""
               )}
            </Label>
            <Input type="file" accept="video" ref={videoRef} />
            <Input type="text" ref={titleRef} placeholder="Title" />
            <TextArea
               cols="30"
               rows="10"
               ref={descriptionRef}
               placeholder="Description"
            ></TextArea>
            <Input
               type="text"
               ref={tagsRef}
               placeholder="Tags seperated with comma (,)"
            />
            <Label>Thumbnail</Label>
            <Input type="file" ref={thumbnailRef} />

            <Button onClick={() => manageUpload()}> Upload </Button>
         </Wrapper>
      </Container>
   );
};

export default UploadVideo;
