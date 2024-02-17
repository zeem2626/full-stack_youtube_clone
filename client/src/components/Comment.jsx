import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Image from "./utilities/CircularIconImage";
import axios from "axios";
import conf from "../../conf/conf";

// Icons
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { format } from "timeago.js";
import { useSelector } from "react-redux";

const Container = styled.div`
   /* background-color: ${({ theme }) => theme.bgLighter}; */
   padding: 2rem 0;
   width: 100%;
   /* background-color: #222; */
`;
const Input = styled.input`
   border: none;
   outline: none;
   background-color: transparent;
   /* background-color: ${({ theme }) => theme.bgLighter}; */
   color: ${({ theme }) => theme.text};
   padding: 0.8rem 0.5rem;
`;
const Hr = styled.div`
   width: 100%;
   height: 1px;
   background-color: #555;
   /* background-color: ${({ theme }) => theme.bgLighter}; */
`;
const AddComment = styled.form`
   display: flex;
   justify-content: space-between;
   align-items: center;
   gap: 1rem;
   margin: 3rem 0;
`;

const InputComment = styled.div`
   display: flex;
   flex-direction: column;
   flex-grow: 1;
`;

const Container2 = styled.div`
   display: flex;
   padding: 1rem 0;
`;
const UserCommentDetail = styled.div`
   padding: 0 1.3rem;
   line-height: 3rem;
   font-size: 1.5rem;
   flex-grow: 1;
`;

const ButtonContainer = styled.div`
   display: flex;
   align-items: center;
   gap: 1rem;
`;
const Button = styled.button`
   background-color: ${({ theme }) => theme.soft};
   color: ${({ theme }) => theme.bgLighter};
   border: none;
   border-radius: 2rem;
   padding: 0.2rem 1rem;
   font-weight: 600;
   cursor: pointer;
`;

const CommentManageButton = styled.button`
   height: 100%;
   background-color: ${({ theme }) => theme.bgLighter};
   color: ${({ theme }) => theme.textSoft};
   padding: 0.5rem;
   margin-right: 1.5rem;
   border-radius: 1rem;
   cursor: pointer;
   border: none;
`;

const UserComment = ({
   getAllComments,
   commentId,
   userId,
   comment,
   createdAt,
}) => {
   const [channel, setChannel] = useState({});
   const user = useSelector((state) => state.user.value);

   const getUser = async () => {
      try {
        //  const res = await axios.get(`/api/user/${userId}`);
         const res = await axios.get(`${conf.api}/user/${userId}`);
         setChannel(res.data?.data);
      } catch (error) {
         setChannel({});
      }
   };

   const editComment = async () => {
      console.log(commentId);
   };

   const deleteComment = async () => {
      const res = await axios.delete(`${conf.api}/comment/${commentId}`, {
      // const res = await axios.delete(`/api/comment/${commentId}`, {
         withCredentials: true,
      });
      getAllComments();
      console.log(res);
   };

   useEffect(() => {
      getUser();
      // console.log("Check");
   }, [getAllComments]);

   return (
      <Container2>
         <Image src={channel?.avatar} size="3.5" />

         <UserCommentDetail>
            <h4>
               {channel.fullName}{" "}
               <span style={{ fontWeight: "400", color: "#888" }}>
                  {format(createdAt)}
               </span>
            </h4>
            <p>{comment} </p>

            <ButtonContainer>
               <ThumbUpIcon sx={{ fontSize: "2rem" }} />
               <ThumbDownAltIcon sx={{ fontSize: "2rem" }} />
               <h6>Reply</h6>
            </ButtonContainer>
         </UserCommentDetail>

         {user?._id == userId ? (
            <>
               {/* <CommentManageButton>
                  <EditIcon onClick={editComment} sx={{ fontSize: "2rem" }} />
               </CommentManageButton> */}
               <CommentManageButton>
                  <DeleteForeverIcon
                     onClick={deleteComment}
                     sx={{ fontSize: "2rem" }}
                  />
               </CommentManageButton>
            </>
         ) : (
            ""
         )}
      </Container2>
   );
};

const Comment = ({ videoId }) => {
   const [comments, setComments] = useState([]);
   const inputComment = useRef("");
   const user = useSelector((state) => state.user.value);

   const getAllComments = async () => {
      // const res = await axios.get(`/api/comment/${videoId}`);
      const res = await axios.get(`${conf.api}/comment/${videoId}`);
      // console.log(res.data?.data);
      setComments(res.data?.data);
   };

   const addComment = async (e) => {
      e.preventDefault();
      // console.log(videoId);
      if (!user) {
         alert("Login to continue");
         return;
      }
      if (inputComment.current.value.trim() == "") {
         alert("Comment something");
         return;
      }
      const res = await axios.post(
         `${conf.api}/comment/${videoId}`,
         { comment: inputComment.current.value },
         { withCredentials: true }
      );

      // console.log(res.data?.data);
      getAllComments();
      inputComment.current.value = "";
   };

   useEffect(() => {
      getAllComments();
      console.log("Comments");
   }, [videoId]);

   return (
      <Container>
         <h1>{comments.length} Comments </h1>

         <AddComment>
            <Image src={user?.avatar} size="3.5" />
            <InputComment>
               <Input
                  ref={inputComment}
                  type="text"
                  placeholder="Add a comment"
               />
               <Hr />
            </InputComment>
            <Button onClick={(e) => addComment(e)}>Comment</Button>
         </AddComment>

         {comments.map((elem, index) => (
            <UserComment
               userId={elem.userId}
               comment={elem.comment}
               createdAt={elem.createdAt}
               key={elem._id}
               commentId={elem._id}
               getAllComments={getAllComments}
            />
         ))}
      </Container>
   );
};

export default Comment;
