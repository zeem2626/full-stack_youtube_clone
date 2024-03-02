import { useEffect, useState } from "react";
import "./App.css";
import styled, { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "./utilities/Theme.js";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, loginFailure } from "./redux/userSlice.js";
import { loadingStart, loadingEnd } from "./redux/loadingSlice.js";
import conf from "../conf/conf.js";

// Components
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import Loader from "./pages/Loader.jsx";

const Container = styled.div`
   min-height: 100vh;
   background-color: ${({ theme }) => theme.bg};
   color: ${({ theme }) => theme.text};
`;
const Main = styled.div`
   display: flex;
`;

const Wrapper = styled.div`
   /* max-width: /70%; */
   width: 100%;
   z-index: 1;
`;

function App() {
   const [darkMode, setDarkMode] = useState(1);
   const [display, setDisplay] = useState(0);
   const loading = useSelector((state) => state.loading.status);
   const dispatch = useDispatch();
   const refresh = useSelector((state) => state.loading.refresh);

   const getCurrentUser = async () => {
      try {
         // dispatch(loadingStart())
         const res = await axios.get(`${conf.api}/user/current-user`, {
            //  const res = await axios.get("/api/user/current-user", {
            withCredentials: true,
         });

         console.log("User available");
         // console.log(res.data?.data?.user);
         dispatch(loginSuccess(res.data?.data?.user));
         dispatch(loadingEnd());
      } catch (error) {
         dispatch(loginFailure());
         console.log(error);
         dispatch(loadingEnd());
      }
   };

   useEffect(() => {
      getCurrentUser();

      console.log("App");
   }, [refresh]);

   return (
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
         {loading ? <Loader /> : ""}
         <Container>
            <Navbar display={display} setDisplay={setDisplay}></Navbar>

            <Main>
               <Menu
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  display={display}
                  setDisplay={setDisplay}
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
