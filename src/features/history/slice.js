import { createSlice,  createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api";

export const getLoginHistoryApi = createAsyncThunk('get-login-history', async () => {
  const response = await axios.get(`${BASE_URL}/api/History/AllLoginHistory`)
  .catch(error => console.log(error))
  return response.data;
});

export const getActivityHistoryApi = createAsyncThunk('get-activity-history', async () => {
  const response = await axios.get(`${BASE_URL}/api/History/AllActivityHistory`)
  .catch(error => console.log(error))
  return response.data;
});

export const getSaleTransactionApi = createAsyncThunk('get-sale-transaction', async () => {
  const response = await axios.get(`${BASE_URL}/api/Sales/AllSaleTransactions`)
  .catch(error => console.log(error))
  return response.data;
});

export const historySlice = createSlice({
  name: 'history',
  initialState: {
    loginHistoryInfo: null,
    activityHistoryInfo: [
      {
        column1: "test1",
        column2: "test2"
      },
      {
        column3: "test3",
        column4: "test4"
      },
    ],
    saleTransactionInfo: [
      {
        column1: "test1",
        column2: "test2"
      },
      {
        column3: "test3",
        column4: "test4"
      },
    ],
    fetchStatus: ''
  },
  reducers: {},
  extraReducers: {
    [getLoginHistoryApi.fulfilled]: (state, action) => {
      state.loginHistoryInfo = action.payload;
      state.fetchStatus = 'success';
    },
    [getLoginHistoryApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [getLoginHistoryApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },

    [getActivityHistoryApi.fulfilled]: (state, action) => {
      state.activityHistoryInfo = action.payload;
      state.fetchStatus = 'success';
    },
    [getActivityHistoryApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [getActivityHistoryApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },

    [getSaleTransactionApi.fulfilled]: (state, action) => {
      state.saleTransactionInfo = action.payload;
      state.fetchStatus = 'success';
    },
    [getSaleTransactionApi.pending]: (state) => {
      state.fetchStatus = 'loading';
    },
    [getSaleTransactionApi.rejected]: (state) => {
      state.fetchStatus = 'error';
    },
    
  }
});

export const historyReducer = historySlice.reducer;