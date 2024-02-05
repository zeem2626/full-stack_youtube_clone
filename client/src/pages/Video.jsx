import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "../firebase/initialize.js";
import VideoDeleteConfirmation from "../components/VideoDeleteConfirmation.jsx";

// Icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ReplyIcon from "@mui/icons-material/Reply";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Image from "../components/utilities/CircularIconImage";
import Comment from "../components/Comment";
import RecommendatioSection from "../components/RecommendatioSection";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "timeago.js";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Container = styled.div`
   width: 98%;
   min-height: 100vh;
   display: flex;
   /* flex-wrap: wrap; */
   /* padding: 2rem 0; */
   padding-bottom: 7rem;
   margin: 1rem auto;
`;

const VideoAndCommentSection = styled.div``;
const VideoWrapper = styled.video`
   width: 100%;
   max-height: 40vw;
   border: none;
   border-radius: 3rem;
   /* background-color: ${({ theme }) => theme.bgLighter}; */
`;
const Button = styled.button`
   display: flex;
   align-items: center;
   background-color: ${({ theme, subscribe }) =>
      subscribe ? theme.text : theme.bgLighter};
   color: ${({ theme, subscribe }) =>
      subscribe ? theme.bgLighter : theme.text};
   /* color: ${({ theme }) => theme.text}; */
   border: none;
   gap: 0.5rem;
   font-size: 1.5em;
   /* font-weight: 600; */
   padding: 0.8rem 1.5rem;
   margin: 0.2rem 1rem;
   border-radius: 2rem;
   cursor: pointer;
`;
const ChannelInfoWrapper = styled.div`
   max-width: 30%;
   display: flex;
   align-items: center;
   font-size: 1rem;
   gap: 1rem;
   /* border: 2px solid red; */
`;

const ButtonsContainer = styled.div`
   display: flex;
   justify-content: flex-end;
   flex-grow: 1;
   padding: 1rem 0rem;
   /* border: 2px solid green; */
`;
const Wrapper1 = styled.div`
   display: flex;
`;

const DescriptionContent = styled.div`
   padding-top: 1rem;
   line-height: 2.3rem;
   max-height: ${({ maxheight }) => (maxheight ? "5rem" : "")};
   overflow: hidden;
   text-overflow: ellipsis;
`;
const Description = styled.div`
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
         const addView = await axios.get(`/api/video/view/${videoId}`);
         const videoRes = await axios.get(`/api/video/get/${videoId}`);
         setVideo(videoRes.data?.data);

         const channelRes = await axios.get(
            `/api/user/${videoRes.data.data?.userId}`
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
         const res = await axios.get(`/api/user/like/${videoId}`);
         setVideo(res.data?.data);
      } catch (error) {
         console.log(error);
      }
   };

   const dislikeVideo = async () => {
      try {
         loginAlert();
         const res = await axios.get(`/api/user/dislike/${videoId}`);
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
            res = await axios.get(`/api/user/unsubscribe/${channel._id}`);
         } else {
            res = await axios.get(`/api/user/subscribe/${channel._id}`);
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
            const videoRef = ref(
               storage,
               `youtube-clone/thumbnail/${fileName}`
            );
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

         const res = await axios.delete(`/api/video/${videoId}`, {
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
               <VideoWrapper
                  width="100%"
                  height="100%"
                  src={video.videoUrl}
                  autoPlay
                  controls
               ></VideoWrapper>

               <h1 style={{ padding: "1rem 0.2rem" }}>
                  {video.title || "Title"}
               </h1>

               <Wrapper1>
                  <ChannelInfoWrapper>
                     <Image src={channel.avatar} size="4.5" />
                     <div>
                        <h2>{channel.fullName || "Channel name"}</h2>
                        <p>{channel.subscribers?.length} Subscribers</p>
                     </div>
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
                        <ThumbUpIcon sx={{ fontSize: "2rem" }} />
                        {video.likes?.length}
                     </Button>
                     <Button onClick={dislikeVideo}>
                        <ThumbDownAltIcon sx={{ fontSize: "2rem" }} />
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
                  <h6>
                     {video.views} views {format(video.createdAt)}
                  </h6>
                  <DescriptionContent maxheight={maxheight}>
                     {video.description}
                     {/* Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui architecto debitis quia distinctio, repudiandae sequi fugit at voluptatum ab perspiciatis eligendi esse saepe alias itaque error sint totam aliquam quam natus iure doloribus non. Aliquid optio architecto possimus dicta adipisci maiores eos nobis consequatur? Saepe dolore, odio minima optio delectus voluptatibus quod dicta aperiam fugiat! Fugiat quisquam magnam, soluta porro necessitatibus laborum quidem. Libero quis quia et culpa aperiam iure? Velit, maxime omnis vel fuga quis quos inventore aut! Dolorum repellat iure tempore sapiente! Provident voluptates similique nesciunt cum, autem animi beatae voluptatum a architecto laborum! Ad quisquam autem molestiae quos. Culpa fugit corrupti eum quis, reiciendis optio modi aliquid maiores ullam commodi dolor fuga nisi repellat laudantium cupiditate eos cumque! In, exercitationem illum eum eos optio, laborum magni inventore aliquid reprehenderit, eveniet debitis doloribus? Nobis quod possimus quos consequatur praesentium molestias optio at perspiciatis quidem, minus eos qui, soluta similique saepe aut nesciunt voluptatem porro amet odio maiores deleniti eligendi incidunt, adipisci expedita! Quis modi fuga labore perspiciatis nihil eius fugit sunt dolorum magni nesciunt? Quod ducimus officiis odit. Voluptatibus veritatis pariatur labore consequatur repellendus enim ut asperiores, non ex vitae ratione sequi dolore dicta consectetur optio natus mollitia laborum eaque quo? Voluptatibus recusandae possimus, dolor, soluta illum impedit doloremque saepe reiciendis quia quaerat repellendus cumque quo modi quisquam porro aliquid atque non consequuntur tempore molestiae voluptatum maxime exercitationem architecto. Earum exercitationem cupiditate esse maxime. Natus, temporibus ullam suscipit culpa animi doloribus consectetur ea porro odio sequi praesentium, fugiat reiciendis consequatur sed asperiores error. Debitis aut, rerum ut sed quasi natus! Officiis aperiam, voluptatem mollitia iste eaque sint molestias ullam enim tenetur non facere quidem delectus perferendis itaque in ipsam, animi tempora nulla dolorem dolore maiores modi. Error exercitationem fugiat nulla at nesciunt. Sapiente at voluptatibus molestias eligendi ea atque veritatis fuga dolor animi. Veniam dolorum nihil ipsum quae non dicta, quas voluptate, ipsam neque facilis odit inventore maxime. Officia libero excepturi cupiditate corrupti accusantium quam quos nulla. Numquam distinctio dolores eius sed maiores enim tenetur sequi atque aperiam animi nostrum eaque beatae, iure magni, molestias quasi totam vitae laboriosam voluptate blanditiis? Porro, unde dolor, tempora atque at numquam minus natus repellendus ex dolorum recusandae eligendi provident nisi tenetur. Delectus at tempore, quos aliquid deserunt saepe assumenda ipsum non illo error modi laborum atque perferendis tenetur quis, doloremque ea iste. Excepturi, nemo. Fugiat, natus sit impedit, debitis quos vel quis explicabo tempora pariatur culpa asperiores est minus dicta necessitatibus commodi delectus eos illum nobis mollitia soluta. Eligendi obcaecati numquam, sunt vitae porro adipisci, modi fugit voluptate qui ipsa perspiciatis libero fuga fugiat! Dolorem repellat assumenda consequuntur accusamus, excepturi consectetur ea odio vitae qui harum nam libero quaerat officiis voluptatum ipsum doloremque, voluptatem culpa, explicabo error similique fugit molestiae. Dolor quis, inventore eius, dolore odio quam corrupti, voluptatem tenetur voluptas veritatis provident est. Dolores unde laboriosam facere, consequatur aspernatur aut sint officia, cum nemo qui explicabo cumque doloribus soluta culpa, deserunt et accusantium. Modi natus commodi maxime unde laborum ipsum deleniti quos doloremque excepturi! Repudiandae nemo illum natus facilis alias mollitia fuga, eum ullam aspernatur et aliquid corporis ex temporibus tempora eligendi quasi necessitatibus itaque recusandae sapiente architecto fugit ducimus? Mollitia dolor placeat ullam odio voluptatibus omnis quidem nobis molestias cupiditate rerum veniam porro illum eveniet laboriosam non, illo natus ea dignissimos necessitatibus velit modi pariatur. Perspiciatis enim reprehenderit hic voluptatum illum neque ipsum eum non, perferendis voluptates possimus maxime. Id modi, nesciunt quam, quas at aliquid sit reprehenderit, distinctio nobis esse dolorem qui vitae neque! Soluta quasi facilis id, doloribus animi tempore sed hic? Eos expedita culpa amet impedit architecto officia animi possimus nostrum quisquam, perferendis tempore. Dignissimos totam aspernatur tempore magni velit, earum praesentium, asperiores sit ex quas, iure sunt vitae eaque quod sapiente aperiam placeat? Inventore debitis qui temporibus at, sed necessitatibus impedit dolorum saepe quo veniam sunt quam, ut aut animi! Impedit velit enim debitis commodi adipisci nostrum asperiores laborum! Voluptate nemo assumenda velit beatae, consequatur iusto at modi, dicta cumque doloribus minus iste nisi veniam enim dolor ratione. Cupiditate dolor sint enim quisquam commodi, exercitationem at, voluptatibus perspiciatis cum quasi alias magnam iusto rem distinctio labore reprehenderit veritatis deserunt ex dolorem? Quam quia, sequi ut pariatur, labore vero atque deserunt soluta veniam, nostrum culpa aliquid animi praesentium iure ipsa nobis? Nemo suscipit vel nostrum eos doloremque aliquid? Consectetur accusamus repellendus inventore rerum atque ipsum, corrupti optio qui odio sequi tempore incidunt quos sunt maxime esse sint pariatur suscipit dolorum nihil! Earum at nemo ratione rerum deserunt velit voluptatum praesentium est. Vel beatae molestiae explicabo tempora, autem natus vero. Sapiente molestias eaque temporibus molestiae aliquam soluta voluptatibus laborum ex, tempore fugit, autem quod vel illum! Dolore nobis ex repellat sapiente nulla dolor mollitia maxime corrupti eveniet saepe sint magnam dignissimos expedita vel, excepturi ipsam placeat commodi perferendis cumque ipsa, at obcaecati eaque ad itaque. Amet ex aliquam similique nobis quisquam quae voluptatibus placeat expedita voluptates? Excepturi quae quidem accusantium sequi? Ut maxime ad voluptates exercitationem nemo sint. Laborum delectus id voluptatibus quo, quod, quam alias vero, voluptatem in explicabo dolorum impedit vitae fugiat ipsam odio doloribus enim dolore eius eos? Temporibus, officiis. Facilis, veritatis. Ipsam saepe ipsum, quod quam accusamus eaque quibusdam exercitationem? Iure provident modi illum illo facere velit dolores incidunt? Nulla dicta facilis quod animi voluptates deleniti expedita excepturi incidunt repudiandae, quia qui, molestiae alias maiores corrupti at. Ducimus, explicabo illo similique tenetur, quod officia fuga possimus quam perspiciatis placeat non voluptatibus vero delectus natus id magnam praesentium distinctio, obcaecati recusandae ea omnis dicta animi reprehenderit! Quisquam enim deserunt inventore delectus quidem excepturi voluptas voluptatibus possimus exercitationem hic magnam sequi atque reprehenderit quasi unde expedita, eius voluptate ratione doloremque, laudantium aperiam quae iure et recusandae! Aliquid asperiores numquam ipsa, in repellendus illo, repudiandae beatae ea neque iste labore quaerat velit consequuntur vel iure ducimus. Vel soluta delectus non, corporis error dolorum, hic ex culpa ducimus cum, blanditiis necessitatibus temporibus at dolor adipisci fugiat voluptatem aliquam pariatur eum iusto distinctio suscipit. Rem voluptatem nam possimus! */}
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
