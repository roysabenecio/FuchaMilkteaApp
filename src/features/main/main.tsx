import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSnackbar } from 'notistack';

import Layout from "../../layout/layout";
import Navbar from "../../shared-components/nav-bar/nav-bar"
import Header from "../../shared-components/header/header";
import Login from '../login/containers/login';
import Register from '../register/containers/register';
import { useSelector, useDispatch } from 'react-redux';
import { USERS_MENU, REGISTRATION } from '../../util/constants';

import { clearUserInfo, clearLoginErrors, reloginUserInfo, loginActivityApi, logoutActivityApi, setSliceToken, setSliceUser } from '../login/slice'
import { getAllUsersInfoApi } from '../users/slice';
import { getAllAddOnsApi, getAllMenusInfoApi, getAllSizesApi, getAllMenuPricesApi } from '../pos/slice';
import { getOrdersInfoApi, getSalesTransacInfoApi } from '../sales-report/slice';
import { getStockInfoApi } from '../inventory/slice';
import { getSupplierInfoApi, getPurchaseInfoApi, getPOInfoApi } from '../suppliers/slice';
import { getActivityHistoryApi, getLoginHistoryApi } from '../history/slice';
import { getAllGramSoldApi } from '../dashboard/slice';
import { useUser } from '../../app/hooks/useUser';
import { useToken } from '../../app/hooks/useToken';
import { useAppSelector } from '../../app/hooks';
import jwtDecode from 'jwt-decode';
import { User } from '../../app/types/types';
import { stringify } from 'querystring';
import { useLoginMutation } from '../login/apiSlice';

const MainContainer = () => {
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    let navigate = useNavigate();
    const dispatch = useDispatch();
    // const user = useUser();
    // const {  } = useSelector((state) => state.login);
    const { loginErrors } = useSelector((state) => state.login);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    let userLS;
    let countLS;
    const [login, {isSuccess, reset}] = useLoginMutation({
        fixedCacheKey: 'shared-login-state',
    });
    
    // const t = useUser();

    // useEffect(() => {useUser()},[isSuccess])
    // useEffect(() => {console.log(user)},[user])

    

    const { token, userInfo } = useAppSelector(state => state.login);

    const getUserFromToken = () => {
        const decodedToken: Object = jwtDecode(token);
        const user: User = {
            userId: decodedToken.userId,
            firstName: decodedToken.firstName,
            lastName: decodedToken.lastName,
            userName: decodedToken.userName,
            userStatus: decodedToken.userStatus,
            role: decodedToken.role,
        }

        return user;
    };

    // This is for refresh,
    // Checks local storage first if there is an existing token
    // then set user in slice
    useEffect(() => { 
        if (Object.hasOwn(localStorage, 'token') && token === "") {
            dispatch(setSliceToken(JSON.parse(localStorage.getItem('token') || "")))
        }            
        if (token !== "") {
            dispatch(setSliceUser(getUserFromToken()));
        }         
    },[token]);


    useEffect(() => {
        userLS = JSON.parse(localStorage.getItem("token"));
        countLS = parseInt(localStorage.getItem("loginCount"));

        // user
        // const user = useUser();bbbbbbbb

        // console.log(user)

        if (userLS) {
            setIsAuthenticated(true)
            navigate('/dashboard')
        }
        // user = useToken();
        
        //make some logic here to check if the user is authenticated then let him login

        // if(!userInfo && userLS) {
        // if(!user) {
        //     dispatch(reloginUserInfo());
        // }


        // if (user) {
        //     console.log("has user")

        //     if (user.userStatus === "Approved") {
        //         console.log("Approved")
        //     }
        // }

        // if (user) {
        //     console.log(user)
        //     dispatch(getSalesTransacInfoApi()); // dashboard breaks when page reloads
        //     // if (userLS.userStatus === "Approved") {
        //     //     setIsAuthenticated(true);            
        //     //     navigate("/dashboard");
        //     //     if (countLS == 1) {
        //     //         dispatch(loginActivityApi(userLS));
        //     //     }
        //     //     localStorage.setItem("loginCount", JSON.parse(countLS += 1));
        //     // }
        // }

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
        
        // dispatch(getStockInfoApi());
        // dispatch(getAllUsersInfoApi());
        // dispatch(getAllMenusInfoApi());
        // dispatch(getAllAddOnsApi());
        // dispatch(getAllSizesApi());
        // dispatch(getAllMenuPricesApi());
        // dispatch(getSupplierInfoApi());
        // dispatch(getPurchaseInfoApi());
        // dispatch(getOrdersInfoApi());
        // dispatch(getSalesTransacInfoApi());
        // dispatch(getLoginHistoryApi());
        // dispatch(getAllGramSoldApi());
        // dispatch(getActivityHistoryApi());
        // dispatch(getPOInfoApi());

    }, [userInfo, loginErrors, isSuccess]);
// }, [isSuccess]);

    // Add Logout Activity on server side using JWT
    const onLogout = () => {
        if (userInfo) {
        // if (user) {
            // userLS = JSON.parse(localStorage.getItem("userInfo"));
            // dispatch(logoutActivityApi(userInfo));
            dispatch(clearUserInfo());
            setIsAuthenticated(false);
            localStorage.clear();
            reset();
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
        // const user = useUser();
        return <Header 
                    // userInfo={JSON.parse(localStorage.getItem("userInfo"))} 
                    userInfo={userInfo}
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
                    pages={<Outlet />}
                /> : registerRoute()
            }
        </React.Fragment>
    );
};

export default MainContainer;