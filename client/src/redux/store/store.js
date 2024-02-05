import { configureStore } from "@reduxjs/toolkit";
import userReducers from "../userSlice.js";
import loadingReducers from "../loadingSlice.js";
import videosReducers from "../videosSlice.js";

const store = configureStore({
   reducer: {
      user: userReducers,
      loading: loadingReducers,
      videos: videosReducers,
   },
});

export default store;
