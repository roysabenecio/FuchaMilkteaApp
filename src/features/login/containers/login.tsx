import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllUsersInfoApi } from '../../users/slice'
import Login from '../components/login';

const LoginContainer = () => {
    const dispatch = useDispatch();

    useEffect(() => { dispatch(getAllUsersInfoApi()); }, []);

    return <Login dispatch={dispatch} />;
};

export default LoginContainer;