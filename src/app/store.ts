import { configureStore } from '@reduxjs/toolkit';
import { loginReducer } from '../features/login/slice';
import { posReducer } from '../features/pos/slice';
import { registerReducer } from '../features/register/slice';
import { supplierReducer, purchaseRecReducer} from '../features/suppliers/slice';

import { usersReducer } from '../features/users/slice';
import { inventoryReducer } from '../features/inventory/slice';
import { salesReportReducer } from '../features/sales-report/slice';
import { historyReducer } from '../features/history/slice';
import { dashboardReducer } from '../features/dashboard/slice';
import { api } from '../features/api/apiSlice';

//add slice's here
const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer, // RTK Query
        login: loginReducer,
        registerReducer: registerReducer,
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
        getDefaultMiddleware().concat(api.middleware)
});

export default store;