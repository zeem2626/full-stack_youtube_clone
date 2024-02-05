import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   status: true,
   refresh: false,
};

const loadingSlice = createSlice({
   name: "loading",
   initialState,
   reducers: {
      loadingStart: (state, action) => {
         state.status = true;
      },
      loadingEnd: (state, action) => {
         state.status = false;
      },
      refresh: (state, action) => {
         state.refresh = !state.refresh;
      },
   },
});

export const { loadingStart, loadingEnd, refresh } = loadingSlice.actions;

export default loadingSlice.reducer;
