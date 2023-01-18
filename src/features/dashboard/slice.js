import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api";

export const getAllGramSoldApi = createAsyncThunk('get-all-gram-sold', async () => {
  const res = await axios.get(`${BASE_URL}/api/Extra/AllGramSold`);
  return res.data;
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    userInfo: null,
    gramsSoldInfo: [
      {
        name: "Okinawa",
        gramsSold: 700,
        measurementUnit: "Grams",
        status: "Sufficient",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },
      {
        name: "Red Velvet",
        gramsSold: 200,
        status: "Critical",
        measurementUnit: "Grams",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },
      {
        name: "Cookies and Cream",
        gramsSold: 350,
        status: "Low",
        measurementUnit: "Grams",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },
      {
        name: "Wintermelon",
        gramsSold: 550,
        status: "Sufficient",
        measurementUnit: "Grams",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },
      {
        name: "Wintermelon",
        gramsSold: 550,
        status: "Sufficient",
        measurementUnit: "Grams",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },
      {
        name: "Wintermelon",
        gramsSold: 550,
        status: "Sufficient",
        measurementUnit: "Grams",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },
      {
        name: "Wintermelon",
        gramsSold: 550,
        status: "Low",
        measurementUnit: "Grams",
        resetDate: "12/19/2022",
        previousMeasure: 200
      },

    ]
  },
  reducers: {},
  extraReducers: {
    // builder
    //   .addCase((state, action) => {
    //     state.gramsSoldInfo = action.payload;
    //     state.fetchStatus = 'Success';
    //   })
    //   .addCase((state, action) => {
    //     state.fetchStatus = 'Loading'

    //   })
    //   .addCase((state, action) => {
    //     state.fetchStatus = 'Error'

    //   })
    [getAllGramSoldApi.fulfilled]: (state, action) => {
      state.gramsSoldInfo = action.payload;
      state.fetchStatus = 'Success';
    },
    [getAllGramSoldApi.pending]: (state) => {
      state.fetchStatus = 'Loading'
    },
    [getAllGramSoldApi.rejected]: (state) => {
      state.fetchStatus = 'Error'
    },
  }
});

export const dashboardReducer = dashboardSlice.reducer;