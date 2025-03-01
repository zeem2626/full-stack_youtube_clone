import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
   width: 100%;
   z-index: 3;
   background-color: #33333366;
   position: fixed;
   color: #fff;
   /* background-color: ${({ theme }) => theme.bg}; */
   /* opacity: 50%; */
   /* border: 1px solid red; */
`;

const Loader = () => {
   const loading = useSelector((state) => state.loading.status);
   const [message, setMessage] = useState("Loading...");

   const checkServer = async () => {
      setTimeout(() => {
         if (loading) {
            setMessage("Wait, Server is initialising...");
         } else {
            setMessage("Ruko Bhai...");
         }
      }, 3 * 1000);
   };

   useEffect(()=>{
    checkServer()
   }, [])

   return (
      <Container>
         <h1>{message}</h1>
      </Container>
   );
};

export default Loader;
