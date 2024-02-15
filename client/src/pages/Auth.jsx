import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/initialize.js";
import axios from "axios";
import conf from "../../conf/conf.js";
import { loadingEnd, refresh } from "../redux/loadingSlice.js";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  //   height: 95vh;
  //  /* max-width: 100%; */
`;
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.bgLighter};
  padding: 2rem 1rem 3rem 1rem;
  text-align: center;
  gap: 1rem;
  //   margin-top: 5rem;
  width: 90%;
  margin-top: 2rem;
  max-width: 50rem;
  //   height: 20rem;
  border-radius: 1rem;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const Input = styled.input`
  width: 90%;
  max-width: 30rem;
  margin: auto;
  padding: 1rem;
  background-color: transparent;
  outline: none;
  border: 2px solid ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  border-radius: 1rem;
`;
const Button = styled.button`
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme, btnGoogle }) => (btnGoogle ? theme.soft : theme.textSoft)};
  font-size: 1.5rem;
  margin: auto;
  padding: 1rem 1rem;
  border: 1px solid ${({ theme }) => theme.bgLighter};
  border-radius: 1rem;
  cursor: pointer;
`;
const P = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textSoft};
`;

const Auth = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const loading = useSelector((state) => state.loading.status);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  let usernameOrEmail = useRef("");
  let signinPassword = useRef("");
  let userName = useRef("");
  let fullName = useRef("");
  let email = useRef("");
  let signupPassword = useRef("");

  const signin = async (e) => {
    try {
      e.preventDefault();
      if (
        usernameOrEmail.current.value.trim() == "" ||
        signinPassword.current.value.trim() == ""
      ) {
        alert("Incomplete Details");
        return;
      }

      const res = await axios.post(
        `${conf.api}/user/auth/signin`,
        {
          //  const res = await axios.post("/api/user/auth/signin", {
          usernameOrEmail: usernameOrEmail.current.value,
          password: signinPassword.current.value,
        },
        { withCredentials: true }
      );

      // Signed in
      console.log("User signed in");
      console.log(res.data.data.user);
      dispatch(loginSuccess(res.data?.data.user));
      dispatch(refresh());
      navigate(-1);
      // alert("Signed in");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || error.response?.message);
      dispatch(loadingEnd);
    }
  };

  const googleSignin = async (e) => {
    try {
      e.preventDefault();
      const result = await signInWithPopup(auth, provider);
      // const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;

      const res = await axios.post(`${conf.api}/user/auth/googleSignin`, {
        //  const res = await axios.post("/api/user/auth/googleSignin", {
        uid: user.uid,
        fullName: user.displayName,
        email: user.email,
      });
      // console.log(res.data);
      dispatch(loginSuccess(res.data?.data));
      dispatch(refresh());
      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  // const currentUser = async (e) => {
  //   e.preventDefault();
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       console.log("User: ", user.uid);
  //     } else {
  //       console.log("User Loged out");
  //     }
  //   });
  // }

  const signup = async (e) => {
    try {
      e.preventDefault();
      const incompleteDetails = [
        userName,
        fullName,
        email,
        signupPassword,
      ].some((elem) => elem.current.value.trim() == "");
      if (incompleteDetails) {
        alert("Incomplete Details");
        return;
      }

      const res = await axios.post(`${conf.api}/user/auth/signup`, {
        //  const res = await axios.post("/api/user/auth/signup", {
        userName: userName.current.value,
        fullName: fullName.current.value,
        email: email.current.value,
        password: signupPassword.current.value,
      });

      //  console.log(res.data.data);
      userName.current.value = "";
      fullName.current.value = "";
      email.current.value = "";
      signupPassword.current.value = "";

      alert("User registered, Login to continue");
    } catch (error) {
      // console.log(error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    if (user) {
      console.log("Auth");
      navigate("/");
    }
    console.log("Auth Login");
  }, [user]);

  return (
    <Container>
      <Wrapper>
        <h1 style={{ fontSize: "2.5rem" }}> Sign in </h1>
        <P> to continue </P>

        <Form action="">
          <Input ref={usernameOrEmail} placeholder="Username Or Email" />
          <Input ref={signinPassword} placeholder="Password" />

          <Button onClick={(e) => signin(e)}> Sign in </Button>
          <Button btnGoogle="google" onClick={(e) => googleSignin(e)}>
            {" "}
            Sign In Google{" "}
          </Button>
          {/* <Button onClick={(e) => currentUser(e)}> User </Button> */}
        </Form>
        <P> Or </P>
        <Form action="">
          <Input ref={fullName} placeholder="Fullname" />
          <Input ref={userName} placeholder="Username" />
          <Input ref={email} placeholder="Email" />
          <Input ref={signupPassword} placeholder="Password" />

          <Button onClick={(e) => signup(e)}> Sign up </Button>
        </Form>
      </Wrapper>
    </Container>
  );
};

export default Auth;
