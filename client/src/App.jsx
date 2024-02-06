import { useEffect, useState } from "react";
import "./App.css";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utilities/Theme.js";
import { Outlet, } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "./redux/userSlice.js";
import conf from "../conf/conf.js";

// Components
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";

const Container = styled.div`
   /* width: 100%; */
   /* min-height: 100vh; */
   /* height: 100%; */
   /* padding: 0.3rem 0.8rem; */
   background-color: ${({ theme }) => theme.bg};
   /* background-color: #111; */
   color: ${({ theme }) => theme.text};
`;
const Main = styled.div`
   display: flex;
   /* border: 2px solid green; */
`;

const Wrapper = styled.div`
   /* max-width: /70%; */
   width: 100%;
   z-index: 1;
`;

function App() {
   const [darkMode, setDarkMode] = useState(1);
   const [display, setDisplay] = useState(1);
   const dispatch = useDispatch();
   const refresh = useSelector((state) => state.loading.refresh);

   const getCurrentUser = async () => {
      try {
         const res = await axios.get(`${conf.API}/api/user/current-user`, {
        //  const res = await axios.get("/api/user/current-user", {
            withCredentials: true,
         });

         console.log("User available");
         //  console.log(res.data?.data?.user);
         dispatch(loginSuccess(res.data?.data?.user));
      } catch (error) {
         dispatch(loginFailure());
         /* console.log(error) */
      }
   };

   useEffect(() => {
      getCurrentUser();

      console.log("App");
   }, [refresh]);

   return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
         <Container>
            <Navbar display={display} setDisplay={setDisplay}></Navbar>

            <Main>
               <Menu
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  display={display}
               />

               <Wrapper>
                  <Outlet />
               </Wrapper>
            </Main>
         </Container>
      </ThemeProvider>
   );
}

export default App;
