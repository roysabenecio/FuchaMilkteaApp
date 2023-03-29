import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAllUsersInfoApi, postUserInfoApi, putUserInfoApi, removeUserInfoApi, restoreUserInfoApi }  from '../slice';
import Users from '../components/users';

const UsersContainer = () => {
  const { usersInfo, fetchStatus } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const existingUsers = usersInfo.filter(x => x.isRemoved == false);
  let renderExistingUserColumns;

  if (existingUsers.length != 0) {
    const existingUserColumns = Object.keys(existingUsers[0]).filter(x => x != "isRemoved" && x != "id");
    renderExistingUserColumns = () => {
      const newObj = existingUserColumns.map((column) => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    };
  } 
  const removedUsers = usersInfo.filter(x => x.isRemoved == true);
  let renderRemovedUserColumns;

  if (removedUsers.length != 0) {
    const removedUserColumns = Object.keys(removedUsers[0]).filter(x => x != "isRemoved" && x != "id");
    renderRemovedUserColumns = () => {
      const newObj = removedUserColumns.map((column) => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    };
  }

  //MOBILE VIEW  
  const mobileUserCol = Object.keys(existingUsers[0]).filter(x => x != "isRemoved" && x != "id" && x != "userName" && x != "dateCreated");
  const renderMobileUserCol = mobileUserCol.map((column) => ({
    id: column,
    label: column.toUpperCase()
  }));


  const tableInfo = {
    existingUsers: {
      info: existingUsers,
      rows: Object.values(existingUsers),
      columns: () => renderExistingUserColumns()
    },
    removedUsers: {
      info: removedUsers,
      rows: Object.values(removedUsers),
      columns: () => renderRemovedUserColumns()
    }
  };

  const reducers = {
    postUserInfoApi: postUserInfoApi,
    putUserInfoApi: putUserInfoApi,
    removeUserInfoApi: removeUserInfoApi,
    restoreUserInfoApi: restoreUserInfoApi
  };

  useEffect(() => {
    dispatch(getAllUsersInfoApi())
  },[fetchStatus]);

  return (
    <Users
      dispatch={dispatch}
      usersInfo={usersInfo}
      tableInfo={tableInfo}
      reducers={reducers}
      renderMobileUserCol={renderMobileUserCol}
    />
  );
};

export default UsersContainer;