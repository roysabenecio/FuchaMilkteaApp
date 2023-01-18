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

//add slice's here
const store = configureStore({
    reducer: {
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
    }
});

export default store;