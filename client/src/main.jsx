// add the beginning of your app entry
import 'vite/modulepreload-polyfill'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import store from "./redux/store/store.js";
import Home from "./pages/Home.jsx";
import Video from "./pages/Video.jsx";
import Auth from "./pages/Auth.jsx";
import Profile from "./pages/Profile.jsx";
import Test from "./pages/Test.jsx";
import Error from "./pages/Error.jsx";

const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            path: "",
            element: <Home type="random" />,
         },
         {
            path: "trending",
            element: <Home type="trend" />,
         },
         {
            path: "subscribed",
            element: <Home type="subscribed" />,
         },
         {
            path: "video/:id",
            element: <Video />,
         },
         {
            path: "auth",
            element: <Auth />,
         },
         {
            path: "profile",
            element: (
               <>
                  <Profile /> <Home type="profile" />
               </>
            ),
         },
         // {
         //   path: "search",
         //   element: <Home />,
         //   // element: <Home type="search" />,
         // },
        //  {
        //     path: "test",
        //     element: <Test />,
        //  },
         {
            path: "*",
            element: <Error />,
         },
      ],
   },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
      <Provider store={store}>
         <RouterProvider router={router} />
      </Provider>
   </React.StrictMode>
);
