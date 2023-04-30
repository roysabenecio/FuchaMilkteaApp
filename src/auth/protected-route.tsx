import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../app/hooks/useUser";


const ProtectedRoutes = () => {
    // const user = localStorage.getItem("authToken");
    const user = useUser();
    return (
        user ? <Outlet /> : <Navigate to="/login" />
    );
};

export default ProtectedRoutes;