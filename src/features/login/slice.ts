import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../api";

// First, create the thunk
// const getUserInfoByNameAndPassword = createAsyncThunk(
//   'users/fetchByIdStatus',
//   async (userId, thunkAPI) => {
//     const response = await userAPI.fetchById(userId)
//     return response.data
//   }
// )
export const getUserInfoApi = createAsyncThunk('get-user-info', async (data) => {
  const { userName, password } = data;
  const response = await axios.get(`${BASE_URL}/api/Users/GetUserInfo?userName=${userName}&password=${password}`);
  return response.data;
});

export const loginUserApi = createAsyncThunk('get-login-info', async (data) => {
  const res = await axios.post(`${BASE_URL}/api/Auth/LoginUser`, data)
  return res.data;
});

export const loginActivityApi = createAsyncThunk('login-activity', async (data) => {
  const res = await axios.post(`${BASE_URL}/api/Auth/LoginActivity`, data)
  return res.data;
});

export const logoutActivityApi = createAsyncThunk('logout-activity', async (data) => {
  const res = await axios.post(`${BASE_URL}/api/Auth/LogoutActivity`, data)
  return res.data;
});

export const loginSlice = createSlice({
  name: 'login',
  initialState: {
    userInfo: null,
    loginInfo: null,
    loginErrors: null,
    fetchStatus: ''
  },
  reducers: {
    getUserInfo: (state, action) => {
      state.userInfo = action.payload
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo.userInfo));

    },
    reloginUserInfo: (state) => {
      state.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    },
    clearUserInfo: (state) => {
      state.userInfo = null
    },
    clearLoginErrors: (state) => {
      state.loginErrors = null
    },
    setLoginErrors: (state, action) => {
      state.loginErrors = action.payload
    }
  },
  extraReducers: {
    [getUserInfoApi.fulfilled]: (state, action) => {
      state.userInfo = action.payload;
      // localStorage.setItem('userData', JSON.stringify(state.userInfo));
      state.fetchStatus = 'success';
    },
    [getUserInfoApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [getUserInfoApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },
    [loginUserApi.fulfilled]: (state, action) => {
      state.loginInfo = action.payload
      if (state.loginInfo.ok) {
        state.userInfo = state.loginInfo.ok;
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
        localStorage.setItem("authToken", JSON.stringify(state.loginInfo.token));
        localStorage.setItem("loginCount", JSON.stringify(1));
      }
      if (!state.loginInfo.ok) {
        state.loginErrors = action.payload;
      }
      state.fetchStatus = 'success';
    },
    [loginUserApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [loginUserApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },

    [loginActivityApi.fulfilled]: (state) => {
      state.fetchStatus = 'success';
    },
    [loginActivityApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [loginActivityApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },

    [logoutActivityApi.fulfilled]: (state) => {
      state.fetchStatus = 'success';
    },
    [logoutActivityApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [logoutActivityApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },
  }
});

export const loginReducer = loginSlice.reducer;

export const { getUserInfo, clearUserInfo, clearLoginErrors, reloginUserInfo, setLoginErrors } = loginSlice.actions;