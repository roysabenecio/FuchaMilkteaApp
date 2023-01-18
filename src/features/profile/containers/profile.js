import Profile from "../components/profile";
import { useSelector, useDispatch } from 'react-redux';

const ProfileContainer = () => {
    const { userInfo } = useSelector((state) => state.login);
    const { profileStatus } = useSelector((state) => state.users);
    const dispatch = useDispatch();

    return (
        <Profile
            userInfo={userInfo}
            dispatch={dispatch}
            profileStatus={profileStatus}
        />
    );
};

export default ProfileContainer;