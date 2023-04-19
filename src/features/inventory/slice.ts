import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../api";

export const getStockInfoApi = createAsyncThunk('get-stock-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Inventory/AllStocks/`);
    return response.data
});

export const postStockApi = createAsyncThunk('post-stock', async (data) => {
    return await axios.post(`${BASE_URL}/api/Inventory/AddStock/`, data)
        .catch(error => console.log(error, "ERROR"))
        .then(response => {
            return response.data;
        });
});

export const editStockApi = createAsyncThunk('edit-stock', async (data) => {
    return await axios.put(`${BASE_URL}/api/Inventory/EditStock/`, data)
        .catch(error => console.log(error, "ERROR"))

        .then(response => {
            return response.data;
        });
});

export const updateStockQuantityApi = createAsyncThunk('update-stock-quantity', async (data) => {
    return await axios.put(`${BASE_URL}/api/Inventory/UpdateStockMeasure/`, data)
        .catch(error => console.log(error, "ERROR"))

        .then(response => {
            return response.data;
        });
});

export const deleteStockApi = createAsyncThunk('delete-stock', async (data) => {
    axios.delete(`https://localhost:7280/api/Inventory/RemoveStock/`, { data: { Id: data.id } })
        .catch(error => console.log(error, 'ERROR'))
        .then(response => {
            return response.data;
        });
});

export const removeStockApi = createAsyncThunk('remove-stock', async (data) => {
    return await axios.put(`${BASE_URL}/api/Inventory/RemoveStock/`, data)
        .catch(error => console.log(error, 'ERROR'))
        .then(response => {
            return response.data;
        });
});

export const searchStockApi = createAsyncThunk('search-stock', async () => {
    let data = {
        category: "Milk Tea Flavor",
        characters: "red"
    };
    return await axios.post(`${BASE_URL}/api/Extra/SearchStock/`, data)
    .catch(error => console.log(error, 'ERROR'))
    .then(response => {
        return response.data;
    });
});


export const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        // stockInfo: [{
        //     id: 1,
        //     name: "Okinawa",
        //     measure: 2,
        //     measurementUnit: "Kilograms",
        //     category: "MilkTeaFlavor",
        //     isRemoved: false,
        //     lastRestocked: null,
        //     status: "Sufficient",
        //     supplier: "In joy"
        // }],
        stockInfo: null,
        updateQuantityStatus: null,
        quantityModal: false,
        currRow: "",
        fetchStatus: ''
    },
    reducers: {
        clearUpdateQuantityStatus: (state) => {
            state.updateQuantityStatus = null;
        },
        setQuantityModal: (state, action) => {
            state.quantityModal = action.payload;
        },
        setRow: (state, action) => {
            state.currRow = action.payload;
        }
    },
    extraReducers: {
        [getStockInfoApi.fulfilled]: (state, action) => {
            state.stockInfo = action.payload;
            // state.fetchStatus = 'success';
        },
        [getStockInfoApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [getStockInfoApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [postStockApi.fulfilled]: (state, action) => {
            // state.stockInfo.push(action.payload);
            state.fetchStatus = 'success';
        },
        [postStockApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [postStockApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [editStockApi.fulfilled]: (state, action) => {
            const index = state.stockInfo.findIndex((object) => {
                return object.id === action.payload.id
            })
            state.stockInfo.splice(index, 1, action.payload)
            state.fetchStatus = 'success';
        },
        [editStockApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [editStockApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [updateStockQuantityApi.fulfilled]: (state, action) => {
            // const index = state.stockInfo.findIndex((object) => {
            //     return object.id === action.payload.id
            // })
            // state.stockInfo.splice(index, 1, action.payload)
            state.updateQuantityStatus = action.payload;
            state.fetchStatus = 'success';
        },
        [updateStockQuantityApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [updateStockQuantityApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [removeStockApi.fulfilled]: (state, action) => {
            // const index = state.stockInfo.findIndex((object) => {
            //     return object.id === action.payload.id
            // })
            // state.stockInfo.splice(index, 1)
            state.fetchStatus = 'success';

        },
        [removeStockApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [removeStockApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

        [searchStockApi.fulfilled]: (state, action) => {
            state.fetchStatus = 'success';

        },
        [searchStockApi.pending]: (state, action) => {
            state.fetchStatus = 'loading';
        },
        [searchStockApi.rejected]: (state, action) => {
            state.fetchStatus = 'error';
        },

    }
});

export const inventoryReducer = inventorySlice.reducer;

export const { clearUpdateQuantityStatus, setQuantityModal, setRow } = inventorySlice.actions;