import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from "../api";

//SUPPLIERS
export const getSupplierInfoApi = createAsyncThunk('get-supplier-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Supplier/AllSuppliers`);
    return response.data;
});

export const postSupplierInfoApi = createAsyncThunk('post-supplier-info', async (data) => {
    return await axios.post(`${BASE_URL}/api/Supplier/AddSupplier`, data)
        .then(res => res.data)
});

export const putSupplierInfoApi = createAsyncThunk('put-supplier-info', async (data) => {
    return await axios.put(`${BASE_URL}/api/Supplier/EditSupplier/`, data)
        .catch(error => console.error(error))
        .then(response => {
            return response.data;
        });
});

export const removeSupplierInfoApi = createAsyncThunk('remove-supplier-info', async (data) => {
    axios.put(`${BASE_URL}/api/Supplier/RemoveSupplier/`, data)
        .catch(error => {
            console.log(error, "ERROR");
        })
        .then(response => {
            return response.data;
        });
});

export const restoreSupplierInfoApi = createAsyncThunk('restore-supplier-info', async (data) => {
    axios.put(`${BASE_URL}/api/Supplier/RestoreSupplier/`, data)
        .catch(error => {
            console.log(error, "ERROR");
        })
        .then(response => {
            return response.data;
        });
});

export const supplierSlice = createSlice({
    name: 'supplier',
    initialState: {
        supplierInfo: null,
        fetchStatus: ''
    },
    reducers: {},

    extraReducers: {
        [getSupplierInfoApi.fulfilled]: (state, action) => {
            state.supplierInfo = action.payload;
            // state.fetchStatus = 'success';
        },
        [getSupplierInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [getSupplierInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },

        [putSupplierInfoApi.fulfilled]: (state, action) => {
            // state.supplierInfo = action.payload;
            state.fetchStatus = 'success';
        },
        [putSupplierInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [putSupplierInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },

        [removeSupplierInfoApi.fulfilled]: (state, action) => {
            if (action.payload == true) {
                const index = state.supplierInfo.findIndex((object) => {
                    return object.id === action.payload.id
                });
                state.supplierInfo.splice(index, 1);
            }
            state.fetchStatus = 'success';
        },
        [removeSupplierInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [removeSupplierInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },
        [restoreSupplierInfoApi.fulfilled]: (state, action) => {
            // if (action.payload == true){
            //     const index = state.supplierInfo.findIndex((object) => {
            //         return object.id === action.payload.id
            //     });
            //     state.supplierInfo.splice(index, 1);
            // }
            state.fetchStatus = 'success';
        },
        [restoreSupplierInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [restoreSupplierInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        },

        [postSupplierInfoApi.fulfilled]: (state, action) => {
            state.fetchStatus = 'success';
        },
        [postSupplierInfoApi.pending]: (state) => {
            state.fetchStatus = 'loading';
        },
        [postSupplierInfoApi.rejected]: (state) => {
            state.fetchStatus = 'error';
        }

    }
});

//PURCHASE RECORDS
export const getPurchaseInfoApi = createAsyncThunk('get-purchase-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Supplier/AllPurchaseRecords`);
    return response.data;
});

export const getPOInfoApi = createAsyncThunk('get-PO-info', async () => {
    const response = await axios.get(`${BASE_URL}/api/Supplier/AllPORecords`);
    return response.data;
});

export const postPurchaseInfoApi = createAsyncThunk('post-purchase-info', async (data) => {
    const response = await axios.post(`${BASE_URL}/api/Supplier/AddPurchaseRecord`, data);
    return response.data;
});

export const putPurchaseInfoApi = createAsyncThunk('put-purchase-info', async (data) => {
    const response = await axios.put(`${BASE_URL}/api/Supplier/UpdatePurchaseRecord`, data);
    return response.data;
});

export const deletePurchaseInfoApi = createAsyncThunk('delete-supplier-info', async (data) => {
    axios.delete(`http://localhost:9092/purchaseRecord/${data.id}`).then(response => {
        console.log(response.data, 'response');
    });
});

export const purchaseRecSlice = createSlice({
    name: 'purchaseRec',
    initialState: {
        purchaseInfo: null,
        openAddPurchaseRecord: false,
        openAddPurchaseRecord1: false,
        purchaseRecNotifInfo: null,
        poInfo: [
            {
                id: 1,
                stockName: '',
                category: 'test',
                measure: 1,
                measurementUnit: 'test',
                price: 100,
                datePurchased: '12/16/2022 13:34:11',
                supplierId: 1,
                purchaseRecordId: 1

            }
        ],
        fetchStatus2: '',
        b: false
    },
    reducers: {
        setOpenAddPurchaseRecord: (state, action) => {
            state.openAddPurchaseRecord = action.payload;
        },
        setOpenAddPurchaseRecord1: (state, action) => {
            state.openAddPurchaseRecord1 = action.payload;
        },
        setPurchaseRecordNotifInfo: (state, action) => {
            state.purchaseRecNotifInfo = action.payload;
        },
        clearPuchaseRecordNotifInfo: (state) => {
            state.purchaseRecNotifInfo = null;
        }
    },

    extraReducers: {
        [getPurchaseInfoApi.fulfilled]: (state, action) => {
            state.purchaseInfo = action.payload;
            // state.fetchStatus2 = 'success';
        },
        [getPurchaseInfoApi.loading]: (state) => {
            state.fetchStatus2 = 'loading';
        },
        [getPurchaseInfoApi.rejected]: (state) => {
            state.fetchStatus2 = 'error';
        },

        [getPOInfoApi.fulfilled]: (state, action) => {
            state.poInfo = action.payload;
            // state.fetchStatus2 = 'success';
        },
        [getPOInfoApi.loading]: (state) => {
            state.fetchStatus2 = 'loading';
        },
        [getPOInfoApi.rejected]: (state) => {
            state.fetchStatus2 = 'error';
        },

        [postPurchaseInfoApi.fulfilled]: (state, action) => {
            // state.purchaseInfo = action.payload;
            state.fetchStatus2 = 'success';
        },
        [postPurchaseInfoApi.loading]: (state) => {
            state.fetchStatus2 = 'loading';
        },
        [postPurchaseInfoApi.rejected]: (state) => {
            state.fetchStatus2 = 'error';
        },

        [putPurchaseInfoApi.fulfilled]: (state, action) => {
            state.b = !state.b;
            if (state.b === true) {
                state.fetchStatus2 = "success";
            }
        },
        [putPurchaseInfoApi.loading]: (state) => {
            state.fetchStatus2 = 'loading';
        },
        [putPurchaseInfoApi.rejected]: (state) => {
            state.fetchStatus2 = 'error';
        }
    }
});

export const purchaseRecReducer = purchaseRecSlice.reducer;
export const supplierReducer = supplierSlice.reducer;
export const { setOpenAddPurchaseRecord, setOpenAddPurchaseRecord1, setPurchaseRecordNotifInfo } = purchaseRecSlice.actions;