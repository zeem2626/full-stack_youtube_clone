import React from "react";
import styled from "styled-components";

const Container = styled.div`
   width: 99vw;
   height: 100vh;
   position: absolute;
   top: 0px;
   left: 0px;
   z-index: 4;
   display: flex;
   justify-content: center;
   align-items: center;
   background-color: #3335;
   background-color: ${({ theme }) => theme.bg}7;
   /* color: ${({ theme }) => theme.text}; */
   `;
const Wrapper = styled.div`
   background-color: ${({ theme }) => theme.bg};
   width: 97%;
   max-width: 60rem;
   /* text-align: center; */
   height: 50%;
   display: flex;
   border-radius: 2rem;
   flex-direction: column;
   justify-content: center;
   align-items: center;
`;
const Button = styled.button`
   background-color: ${({ theme }) => theme.bgLighter};
   /* background-color: transparent; */
   color: ${({ theme }) => theme.text};
   font-weight: 600;
   font-size: 1.6rem;
   padding: 0.6rem 2rem;
   border-radius: 2rem;
   border: none;
   cursor: pointer;
   margin: 2rem 1rem;
   &:hover{
     color: ${({ theme }) => theme.textSoft};
     
   }
`;
const ButtonWrapper = styled.div`
   /* background-color: ${({ theme }) => theme.bgLighter}; */
`;

const VideoDeleteConfirmation = ({ setDeleteConfirmation, deleteVideo }) => {
   return (
      <Container>
         <Wrapper>
            <h1>Are you sure want to delete this video ?</h1>
            <ButtonWrapper>
               <Button onClick={() => setDeleteConfirmation(false)}>No</Button>
               <Button onClick={deleteVideo}>Yes</Button>
            </ButtonWrapper>
         </Wrapper>
      </Container>
   );
};

export default VideoDeleteConfirmation;
