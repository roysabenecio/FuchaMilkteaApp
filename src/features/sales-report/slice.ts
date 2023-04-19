import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../api";

export const getOrdersInfoApi = createAsyncThunk('get-orders-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Sales/AllOrders`);
    return response.data;
});

export const getSalesTransacInfoApi = createAsyncThunk('get-sales-transac-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Sales/AllSaleTransactions`);
    return response.data;
});

export const salesReportSlice = createSlice({
    name: 'salesReport',
    initialState: {
        ordersInfo: [{ // dashboard will break if page reload
            id: 1,
            name: "ss",
            order: "test order",
            quantity: 2
        }],
        salesTransacInfo: [{ // dashboard will break if page reload
            id: 1,
            name: "ss",
            dateSold: "test order",
            totalSales: 2
        }],
        fetchStatus: null
    },
    reducers: { },
    extraReducers: {
        [getOrdersInfoApi.fulfilled] : (state, action) => {
            state.ordersInfo = action.payload;
            state.fetchStatus = 'Success'
        },
        [getOrdersInfoApi.pending] : (state) => {
            state.fetchStatus = 'Loading'
        },
        [getOrdersInfoApi.rejected] : (state) => {
            state.fetchStatus = 'Error'
        },
        [getSalesTransacInfoApi.fulfilled] : (state, action) => {
            state.salesTransacInfo = action.payload;
            state.fetchStatus = 'Success'
        },
        [getSalesTransacInfoApi.pending] : (state) => {
            state.fetchStatus = 'Loading'
        },
        [getSalesTransacInfoApi.rejected] : (state) => {
            state.fetchStatus = 'Error'
        },
    }
});

export const salesReportReducer = salesReportSlice.reducer;