import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from 'notistack';

import Layout from "../../layout/layout";
import Navbar from "../../shared-components/nav-bar/nav-bar"
import Header from "../../shared-components/header/header";
import Login from '../login/containers/login';
import Register from '../register/containers/register';
import { useSelector, useDispatch } from 'react-redux';
import { USERS_MENU, REGISTRATION } from '../../util/constants';

import { clearUserInfo, clearLoginErrors, reloginUserInfo, loginActivityApi, logoutActivityApi } from '../login/slice'
import { getAllUsersInfoApi } from '../users/slice';
import { getAllAddOnsApi, getAllMenusInfoApi, getAllSizesApi, getAllMenuPricesApi } from '../pos/slice';
import { getOrdersInfoApi, getSalesTransacInfoApi } from '../sales-report/slice';
import { getStockInfoApi } from '../inventory/slice';
import { getSupplierInfoApi, getPurchaseInfoApi, getPOInfoApi } from '../suppliers/slice';
import { getActivityHistoryApi, getLoginHistoryApi } from '../history/slice';
import { getAllGramSoldApi } from '../dashboard/slice';

const MainContainer = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.login);
    const { loginErrors } = useSelector((state) => state.login);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    let userLS;
    let countLS;

    useEffect(() => {
        userLS = JSON.parse(localStorage.getItem("userInfo"));
        countLS = parseInt(localStorage.getItem("loginCount"));
        
        //make some logic here to check if the user is authenticated then let him login

        if(!userInfo && userLS) {
            dispatch(reloginUserInfo());
        }

        if (userLS) {
            dispatch(getSalesTransacInfoApi()); // dashboard breaks when page reloads
            if (userLS.userStatus === "Approved") {
                setIsAuthenticated(true);            
                navigate("/dashboard");
                if (countLS == 1) {
                    dispatch(loginActivityApi(userLS));
                }
                localStorage.setItem("loginCount", JSON.parse(countLS += 1));
            }
        }

        if (loginErrors != null){
            if (loginErrors.userNotFound){
                enqueueSnackbar(loginErrors.userNotFound, {
                    variant: 'error'
                  });
                dispatch(clearLoginErrors());
            }
            if (loginErrors.wrongPassword){
                enqueueSnackbar(loginErrors.wrongPassword, {
                    variant: 'error'
                  });
                dispatch(clearLoginErrors());
            }
            if (loginErrors.accountPending) {
                enqueueSnackbar(loginErrors.accountPending, {
                    variant: 'warning'
                });    
                dispatch(clearLoginErrors());
            }
        }
        
        dispatch(getStockInfoApi());
        dispatch(getAllUsersInfoApi());
        dispatch(getAllMenusInfoApi());
        dispatch(getAllAddOnsApi());
        dispatch(getAllSizesApi());
        dispatch(getAllMenuPricesApi());
        dispatch(getSupplierInfoApi());
        dispatch(getPurchaseInfoApi());
        dispatch(getOrdersInfoApi());
        dispatch(getSalesTransacInfoApi());
        dispatch(getLoginHistoryApi());
        dispatch(getAllGramSoldApi());
        dispatch(getActivityHistoryApi());
        dispatch(getPOInfoApi());

    }, [userInfo, loginErrors]);

    const onLogout = () => {
        if (userInfo) {
            userLS = JSON.parse(localStorage.getItem("userInfo"));
            dispatch(logoutActivityApi(userLS));
            dispatch(clearUserInfo());
            setIsAuthenticated(false);
            localStorage.clear();
            navigate("/login");
        }
    };

    const onRenderHeader = () => {
        const finalMenuItems = USERS_MENU.map((item) => {
            if (item.label === 'Logout') {
                item.action = () => onLogout();
                return item;
            }
            else if (item.label === 'Profile') {
                item.action = () => navigate('/profile');
                return item;
            }
        });
        return <Header 
                    userInfo={JSON.parse(localStorage.getItem("userInfo"))} 
                    menuList={finalMenuItems} />;
    };

    const registerRoute = () => {
        if (location?.pathname === REGISTRATION) {
            return <Register />;
        } else {
            return <Login />;
        }
    };

    return (
        <React.Fragment>
            {
                isAuthenticated ? <Layout
                    navbar={<Navbar />}
                    header={onRenderHeader()}
                    pages={children}
                /> : registerRoute()
            }
        </React.Fragment>
    );
};

export default MainContainer;