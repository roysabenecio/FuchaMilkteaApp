import {
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import NotFound from './features/not-found/not-found';
import Login from './features/login/containers/login';
import Dashboard from './features/dashboard/containers/dashboard';
import SalesReport from "./features/sales-report/containers/sales-report";
import InventoryReport from "./features/inventory-report/containers/inventory-report";
import Inventory from "./features/inventory/containers/inventory";
import Suppliers from "./features/suppliers/containers/suppliers";
import Users from "./features/users/containers/users";
import History from "./features/history/containers/history";
import POS from "./features/pos/containers/pos";
import Profile from "./features/profile/containers/profile";
import Register from "./features/register/containers/register";
import ProtectedRoutes from './auth/protected-route';


const routes = () => {
    return (
        
        <Routes>
            <Route element={<ProtectedRoutes />}>
                <Route path="/dashboard" element={<Dashboard />} exact />
                <Route path="/sales-report" element={<SalesReport />} />
                <Route path="/inventory-report" element={<InventoryReport />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/users" element={<Users />} />
                <Route path="/history" element={<History />} />
                <Route path="/pos" element={<POS />} />
                <Route path="/profile" element={<Profile />} />
            </Route> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
};

export default routes;