import { configureStore } from '@reduxjs/toolkit';
import { loginReducer } from '../features/login/slice';
import { posReducer } from '../features/pos/slice';
import { supplierReducer, purchaseRecReducer} from '../features/suppliers/slice';

import { usersReducer } from '../features/users/slice';
import { inventoryReducer } from '../features/inventory/slice';
import { salesReportReducer } from '../features/sales-report/slice';
import { historyReducer } from '../features/history/slice';
import { dashboardReducer } from '../features/dashboard/slice';
import { centralApiSlice } from './centralApiSlice';

//add slice's here
const store = configureStore({
    reducer: {
        [centralApiSlice.reducerPath]: centralApiSlice.reducer, // RTK Query
        login: loginReducer,
        supplier: supplierReducer,
        purchaseRec: purchaseRecReducer,
        posReducer: posReducer,
        users: usersReducer,
        inventory: inventoryReducer,
        salesReport: salesReportReducer,
        history: historyReducer,
        dashboard: dashboardReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(centralApiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;