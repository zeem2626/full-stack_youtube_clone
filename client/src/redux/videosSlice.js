import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  value: [],
}
const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers:{
    fetchSuccess: (state, action)=>{
      state.value = action.payload;
    },
    fetchFailure: (state)=>{
      state.value = [];
    },
  }
})

export const {fetchSuccess, fetchFailure} = videosSlice.actions;

export default videosSlice.reducer;