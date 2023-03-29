import { useDispatch } from 'react-redux';
import { getAllUsersInfoApi } from '../../users/slice'
import Register from '../components/register';
import { registerUser } from '../slice';

const RegisterContainer = () => {
    const dispatch = useDispatch();

    return (
        <Register
            dispatch={dispatch}
            registerUser={registerUser}
            getAllUsersInfoApi={getAllUsersInfoApi} />
    );
};

export default RegisterContainer;