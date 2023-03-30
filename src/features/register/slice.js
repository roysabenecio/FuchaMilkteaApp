import { createSlice,  createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';
import { BASE_URL } from "../api";

export const registerUser = createAsyncThunk('register-user', async(data) => {
  data = {...data, userStatus: 'Pending'};
    axios.post(`${BASE_URL}/api/Users/RegisterUser/`, data)
});

export const registerSlice = createSlice({
  name: 'register',
  initialState: {
    userInfo: null,
    fetchStatus: ''
  },
  reducers: {},
  extraReducers: {
    [registerUser.fulfilled]: (state, action) => {
      state.fetchStatus = 'success';
    },
    [registerUser.pending]: (state, action) => {
      state.fetchStatus = 'loading';
    },
    [registerUser.rejected]: (state, action) => {
      state.fetchStatus = 'error';
    },
  }
});

export const registerReducer = registerSlice.reducer;