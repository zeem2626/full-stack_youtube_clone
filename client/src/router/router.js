import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Video from "../pages/Video.jsx";
import Signup from "../pages/Signup.jsx";
import Login from "../pages/Login.jsx";


const router = createBrowserRouter([
  {
    path: "",
    element: <App />
  },
  {
    path: "/",
    element: <Home />
  },
  {
    path: "video/:id",
    element: <Video />,
    // element: { Video },
  },
  {
    path: "auth/signup",
    element: <Signup />,
    // element: { Signup },
  },
  {
    path: "auth/signin",
    element: <Login />,
    // element: { Login },
  },
  {
    path: "recommendation",
    element: <RecommendatioCard />,
  },

]);

export default router;
