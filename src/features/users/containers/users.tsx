import Users from '../components/users';
import { CircularProgress } from '@mui/material';
import { useGetAllExistingUsersQuery, useGetAllRemovedUsersQuery, useGetAllUsersQuery } from '../apiSlice';

const UsersContainer = () => {
  const {data: usersInfo} = useGetAllUsersQuery("")
  const {data: existingUsers} = useGetAllExistingUsersQuery("");
  const {data: removedUsers} = useGetAllRemovedUsersQuery("")

  // //MOBILE VIEW  
  // const mobileUserCol = Object.keys(existingUsers[0]).filter(x => x != "isRemoved" && x != "id" && x != "userName" && x != "dateCreated");
  // const renderMobileUserCol = mobileUserCol.map((column) => ({
  //   id: column,
  //   label: column.toUpperCase()
  // }));

  if (usersInfo == undefined || existingUsers == undefined || removedUsers == undefined) {
    return (<CircularProgress />)
  }

  // useEffect(() => {
  //   if (usersInfo == undefined || existingUsers == undefined || removedUsers == undefined) {
  //     console.log(usersInfo)
  //   console.log(existingUsers)
  //   console.log(removedUsers)
  //     return <CircularProgress />
  //   }
  // },[usersInfo,existingUsers,removedUsers])

  return (
    <Users
      usersInfo={usersInfo}
      existingUsers={existingUsers}
      removedUsers={removedUsers}
    />
  );
};

export default UsersContainer;