import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../api";

export const getAllMenusInfoApi = createAsyncThunk('get-all-menu-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Inventory/AllMenus`);
    return response.data;
});
export const getAllAddOnsApi = createAsyncThunk('get-add-ons', async () => {
    const response = await axios.get(`${BASE_URL}/api/Inventory/AllAddOns`);
    return response.data;
});
export const getAllSizesApi = createAsyncThunk('get-sizes', async () => {
    const response = await axios.get(`${BASE_URL}/api/Inventory/AllSizes`);
    return response.data;
});
export const getAllMenuPricesApi = createAsyncThunk('get-menu-prices', async () => {
    const response = await axios.get(`${BASE_URL}/api/Inventory/AllMenuPrices`);
    return response.data;
});

export const postBillApi = createAsyncThunk('post-bill', async (orders ) => {
    const response = await axios.post(`${BASE_URL}/api/Sales/SalesOrders`, orders)
    return response.data
});

export const calculateStockMeasureApi = createAsyncThunk('calculate-stock-measure', async (data) => {
    axios.post(('https://localhost:7280/api/Extra/CalculateStockMeasure'), data)
    .catch(error => console.error(error.response.data, 'ERROR'))
    .then(response => response.data);
});

export const posSlice = createSlice({
    name: 'pos',
    initialState: {
        billInfo: null,
        printStatus: 0,
        menuInfo: null,
        addOnInfo: null,
        sizeInfo: null,
        priceInfo: null,
        fetchStatus: ''
    },
    reducers: {
        makePrint: (state) => {
            state.printStatus += 1;
        },
        clearPrintStatus: (state) => {
            state.printStatus = 0;
        },
        clearBillInfo: (state) => {
            state.billInfo = null;
        }
    },
    extraReducers: {
        // Get All Menus
        [getAllMenusInfoApi.fulfilled]: (state, action) => {
            state.menuInfo = action.payload;
            // state.fetchStatus = 'sucess';
        },
        [getAllMenusInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [getAllMenusInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
        // Get All Add Ons
        [getAllAddOnsApi.fulfilled]: (state, action) => {
            state.addOnInfo = action.payload;
            state.fetchStatus = 'sucess';
        },
        [getAllAddOnsApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [getAllAddOnsApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
        // Gett All Sizes
        [getAllSizesApi.fulfilled]: (state, action) => {
            state.sizeInfo = action.payload;
            state.fetchStatus = 'sucess';
        },
        [getAllSizesApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [getAllSizesApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
        // Gett All Menu Prices
        [getAllMenuPricesApi.fulfilled]: (state, action) => {
            state.priceInfo = action.payload;
            // state.fetchStatus = 'sucess';
        },
        [getAllMenuPricesApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [getAllMenuPricesApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
        // PostBill
        [postBillApi.fulfilled]: (state, action) => {
            state.billInfo = action.payload;
            state.fetchStatus = 'sucess';
        },
        [postBillApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [postBillApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },

        [calculateStockMeasureApi.fulfilled]: (state, action) => {
            state.fetchStatus = 'sucess';
        },
        [calculateStockMeasureApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [calculateStockMeasureApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        }
    }
});

export const posReducer = posSlice.reducer;

export const { addPrice, makePrint , clearPrintStatus, clearBillInfo} = posSlice.actions;