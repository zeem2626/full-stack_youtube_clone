import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  value: null,
}
const userSlice = createSlice({
  name: "value",
  initialState,
  reducers:{
    loginSuccess: (state, action)=>{
      state.value = action.payload;
    },
    loginFailure: (state)=>{
      state.value = null;
    },
  }
})

export const {loginSuccess, loginFailure} = userSlice.actions;

export default userSlice.reducer;