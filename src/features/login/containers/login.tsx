import React from "react";
import { useEffect } from "react";
import Login from "../components/login";
import { useToken } from "../../../app/hooks/useToken";
import { useAddLoginActivityMutation, useLoginMutation } from "../../api/apiSlice";
import type { LoginForm } from "../../../app/types/types";
import { setSliceToken } from "../slice";
import { useSnackbar } from "notistack";
import { useAppDispatch } from "../../../app/hooks";

const LoginContainer = () => {
  const [, setToken] = useToken();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useAppDispatch();
  const [login, { isSuccess, data, error }] = useLoginMutation({
    fixedCacheKey: 'shared-login-state',
  });
  const [addLoginActivity] = useAddLoginActivityMutation();
  
  const onLogin = (credentials: LoginForm) => {
    login(credentials)
  }

  useEffect(() => { 
    // Checks if there is data, and has user info from server
    if (data !== undefined && Object.hasOwn(data, 'ok')) {
      setToken(data.token)
      dispatch(setSliceToken(data.token))
      // dispatch(addLoginActivity(0)) // Add Login Activity using JWT on server side
    }

    // Login Errors notification
    // Gets the login errors directly from data using the Object.values
    if (data !== undefined && !Object.hasOwn(data, 'ok')) {
      enqueueSnackbar(Object.values(data)[0] as string, {
        variant: 'error',
        autoHideDuration: 2000,
      });
   }
  },[isSuccess])

  return <Login 
    dispatch={dispatch} 
    onLogin={onLogin}
  />;
};

export default LoginContainer;
