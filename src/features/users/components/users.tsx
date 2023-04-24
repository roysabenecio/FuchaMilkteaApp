import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import {
  Grid,
  Typography,
  Box,
  Stack,
  InputAdornment,
  TextField,
  Grow,
  Tooltip,
  Modal,
  Button,
  MenuItem,
  IconButton,
  Card,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import BasicDialog from '../../../shared-components/basic-dialog/basic-dialog';
//icons
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddIcon from '@mui/icons-material/Add';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useAppSelector } from '../../../app/hooks';
import { useDeleteUserMutation, useEditUserMutation, useRegisterMutation, useRestoreUserMutation } from '../apiSlice';
import { default as styles } from './styles';
import type { EditUserFormInputs, RegisterForm, RegisterUser, UserDTO, UsersFCProps } from "../../../app/types/types";
import ExistingUserTable from './existingUserTable';
import { Validations } from '../../../app/validations';
import { useValidateUsernameMutation } from '../../../app/centralApiSlice';
import UserArchiveTable from './userArchiveTable';
import AddUserForm from './addUserForm';
import EditUserForm from './editUserForm';

const Users = ({ usersInfo, existingUsers, removedUsers}: UsersFCProps) => {
  const { enqueueSnackbar } = useSnackbar();

  //Data
  const [currRow , setRow] = useState<UserDTO>();
  const [userInfo, setUserInfo] = useState<RegisterForm>()

  // Queries
  const [deleteUser, {data: deletionData, reset: resetUserDelete}] = useDeleteUserMutation();
  const [restoreUser, {data: restorationData, reset: resetUserRestore}] = useRestoreUserMutation();
  const [register, {data: registrationData, reset: resetRegister}] = useRegisterMutation();
  const [editUser, {data: editData, reset: resetEdit}] = useEditUserMutation();
  const [ validateUsername, {data: validationData, reset: resetValidate} ] = useValidateUsernameMutation();

  // Store Data
  const {userInfo: sliceUserInfo} = useAppSelector(state => state.login);

  // Form
  const  { control, reset, watch }  = useForm();

  //Alert
  const [open, setOpen] = useState(false);
  const handleAlertOpen = () => {
    setOpen(true);
  };
  const handleAlertClose = () => {
    setOpen(false);
  };
  const [restoreOpen, setRestoreOpen] = useState(false);
  const handleRestoreOpen = () => {
    setRestoreOpen(true);
  };
  const handleRestoreClose = () => {
    setRestoreOpen(false);
  };

  //HANDLE TABLE ON MOBILE VIEW
  const [isMobile, setIsMobile] = useState(false)
  const handleResize = () => {
    if (window.screen.width < 1050 || window.innerWidth < 1050) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize)
  });

  //MODAL CONTROLS
  const [addOpen, setAddOpen] = useState(false);
  const handleAddModal = () => setAddOpen(true);
  const [editOpen, setEditOpen] = useState(false);
  const handleEditModal = () => {
    setEditOpen(true);
  };
  const handleClose = () => {
    reset();
    setAddOpen(false);
    setEditOpen(false);
    setRow(undefined)
  };
  
  //Callback Function
  const tableToUsers = (tableData: UserDTO) => {
    setRow(tableData);
  };

  // Form Functions
  const onValidate = (data: RegisterForm) => {
    setUserInfo(data)
    validateUsername({ "username": data.userName})
  };

  const onSubmitPut = (data?: EditUserFormInputs) => {
    const fullData = {
      ...data,
      id: currRow!.id,
      actorId: sliceUserInfo.userId
    }
    editUser(fullData);
    setEditOpen(!editOpen);
    setRow(undefined);
  };
  
  const onSubmitDelete = () => {
    if (currRow!.id == 1) {
      enqueueSnackbar("This user cannot be deleted", {
        variant: 'error'
      });
    } 
    // else if (parseInt(JSON.parse(localStorage.getItem("userInfo")).id) == currRow.id) {
    //   enqueueSnackbar("You cannot delete your account", {
    //     variant: 'error'
    //   });
    // }
    else {
      let data = {
        id: currRow!.id,
        actorId: sliceUserInfo.userId
      }
      deleteUser(data);
    }
    handleAlertClose();
    setRow(undefined);
  };
  
  const onSubmitRestore = () => {
    let data = {
      id: currRow!.id,
      actorId: sliceUserInfo.userId
    }
    restoreUser(data);
    handleRestoreClose();
    setRow(undefined);
  };

  // Search Function
  const existingUserText = watch("searchExistUser");
  const searchExistingUser = (text: string) => {
    return existingUsers.filter(s => {
      if (text == "" || text == undefined) {
        return existingUsers.map(x => x);
      }
      if (s['First Name'].toLowerCase().includes(text!) ||
        s['Last Name'].toLowerCase().includes(text!) ||
        s['Username'].toLowerCase().includes(text!) ||
        s.Role.toLowerCase().includes(text!)) {
        return s
      }
    });
  };
  const existingUserFilter = searchExistingUser(existingUserText);

  const removedUserText = watch("searchRemovedUser");
  const searchRemovedUser = (text: string) => {
    return removedUsers.filter(s => {
      if (text == "" || text == undefined) {
        return removedUsers.map(x => x);
      }
      if (s['First Name'].toLowerCase().includes(text) ||
      s['Last Name'].toLowerCase().includes(text) ||
      s['Username'].toLowerCase().includes(text) ||
      s.Role.toLowerCase().includes(text)) {
        return s
      };
    });
  };
  const removedUserFilter = searchRemovedUser(removedUserText);

  // Side Effects
  // Action Notifications
  useEffect(() => {
    if (deletionData === true) {
      enqueueSnackbar("User deleted", {
        variant: 'success'
      });
      resetUserDelete();
    }
    if (restorationData === true) {
      enqueueSnackbar("User restored", {
        variant: 'success'
      });
      resetUserRestore();
    }
    if (registrationData === true){
      enqueueSnackbar("Account has been created", {
        variant: 'success'
      });
      resetRegister();
    }
    if (editData === true){
      enqueueSnackbar("Updated user", {
        variant: 'success'
      });
      resetRegister();
    }
    if (validationData === true) {
      enqueueSnackbar("Username already exists", {
        variant: 'error'
      });
      resetValidate();
    } else if (validationData === false) {
      register(userInfo);
      resetRegister();
      resetValidate();
      handleClose();
    }
  },[deletionData, restorationData, registrationData, editData, validationData]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} mt={2}>
        <Stack direction="row" spacing={1}>
          <Typography variant='h6' sx={styles.overviewText}>
            Users
          </Typography>
          <Tooltip title="The users page lets you manage different accounts using the system.">
            <Box sx={styles.overviewContent}>
              <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
            </Box>
          </Tooltip>
        </Stack>
      </Grid>

      <Grid item xs={12} md={12}>
        <Grow in={true} timeout={800}>
          <Card>
            <Grid item md={12} sx={styles.actionBarWrapper}>
              <form>
                <Controller
                  name='searchExistUser'
                  control={control}
                  defaultValue=""
                  rules={{ pattern: Validations.name }}
                  render={({ field }) => (
                    <TextField
                      placeholder="Search"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <SearchRoundedIcon />
                          </InputAdornment>
                        ),
                      }}
                      {...field}
                    />
                  )}
                />
              </form>
              <Stack ml={2} spacing={1} direction="row">

                {/* <Tooltip title="Add user"> */}
                  <Box sx={styles.overviewContent}>
                    {/* <IconButton
                      onClick={handleAddModal}
                      variant="contained"
                      size='small'
                      aria-label="Add user"
                    ><AddIcon />
                    </IconButton> */}
                    <Button
                      variant='contained'
                      size='small'
                      onClick={handleAddModal} >
                      Add User
                    </Button>
                  </Box>
                {/* </Tooltip> */}

                {/* ADD USER */}
                <Modal open={addOpen} onClose={handleClose}>
                  <>
                    <AddUserForm
                      onValidate={onValidate}
                      handleClose={handleClose}
                    />
                  </>
                </Modal>

                {/* <Tooltip title="Edit user"> */}
                  <Box sx={styles.overviewContent}>
                    {/* <IconButton
                      onClick={handleEditModal}
                      disabled={currRow === '' || currRow.isRemoved === true}
                      variant="contained"
                      size='small'
                      aria-label="Edit item"
                    ><EditRoundedIcon />
                    </IconButton> */}
                    <Button
                      variant='text'
                      size='small'
                      onClick={handleEditModal}
                      disabled={currRow === undefined || currRow.isRemoved === true} >
                      Edit User
                    </Button>
                  </Box>
                {/* </Tooltip> */}

                {/* EDIT */}                
                <Modal open={editOpen} onClose={handleClose} >
                  <>
                    <EditUserForm
                      currRow={currRow}
                      onSubmitPut={onSubmitPut}
                      handleClose={handleClose}
                    />
                  </>
                </Modal>

                {/* <Tooltip title="Delete User"> */}
                  <Box sx={styles.overviewContent}>
                    {/* <IconButton
                      onClick={handleAlertOpen}
                      disabled={currRow === '' || currRow.isRemoved === true}
                      variant="contained"
                      size='small'
                      aria-label="Delete User"
                    ><DeleteRoundedIcon />
                    </IconButton> */}
                    <Button
                      variant='delete'
                      size='small'
                      onClick={handleAlertOpen}
                      disabled={currRow === undefined || currRow.isRemoved === true} >
                      Delete User
                    </Button>
                  </Box>
                {/* </Tooltip> */}
              </Stack>

            </Grid>

            {/* Existing Users Table */}
            <Grid item md={12}>
              <Box p={'1px 1em 1em 1em'}>
                <ExistingUserTable
                  usersInfo={usersInfo}
                  existingUsers={existingUsers}
                  existingUserFilter={existingUserFilter}
                  tableToModule={tableToUsers}
                />
              </Box>
            </Grid>

            {/* {isMobile ?
              tableInfo.existingUsers.info.length != 0 ?
                <Grid item md={12}>
                  <Box p={'1px 1em 1em 1em'}>
                    <BasicTable
                      columns={renderMobileUserCol}
                      rows={existUserFilter}
                      tableToModule={tableToUsers} />
                  </Box>
                </Grid>
                : null
              :
              tableInfo.existingUsers.info.length != 0 ?
                <Grid item md={12}>
                  <Box p={'1px 1em 1em 1em'}>
                    <BasicTable
                      columns={tableInfo.existingUsers.columns()}
                      rows={existUserFilter}
                      tableToModule={tableToUsers} />
                  </Box>
                </Grid>
                : null
            } */}

          </Card>
        </Grow>
      </Grid>

       {/* User Achived Table */}
      {removedUsers.length != 0 ?
        <Grid item xs={12} md={12}>
          <Card>
            <Grid item md={12} sx={styles.actionBarWrapper}>
              <Box sx={{
                display: "flex",
                flexGrow: 2
              }}>
                <Typography
                  mt={2}
                  sx={styles.overviewText}
                  // variant='title'
                >Archive
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <form>
                  <Controller
                    name='searchRemovedUser'
                    control={control}
                    defaultValue=""
                    rules={{ pattern: Validations.name }}
                    render={({ field }) => (
                      <TextField
                        placeholder="Search"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <SearchRoundedIcon />
                            </InputAdornment>
                          ),
                        }}
                        {...field}
                      />
                    )}
                  />
                </form>
              </Box>
              <Stack ml={2} spacing={1} direction="row">
                <Button
                  variant='outlined'
                  size="small"
                  disabled={currRow === undefined || currRow.isRemoved === false}
                  onClick={handleRestoreOpen}>Restore User</Button>
              </Stack>
            </Grid>

            <Box p={'1px 1em 1em 1em'}>
              {/* User Archive Table */}
              {/* {isMobile ?
                <BasicTable
                  columns={renderMobileUserCol}
                  rows={removedUserFilter}
                  tableToModule={tableToUsers} />
                :
                <BasicTable
                  columns={tableInfo.removedUsers.columns()}
                  rows={removedUserFilter}
                  tableToModule={tableToUsers} />
              } */}
              <UserArchiveTable
                usersInfo={usersInfo}
                removedUsers={removedUsers}
                removedUserFilter={removedUserFilter}
                tableToModule={tableToUsers}
              />
            </Box>
          </Card>
        </Grid>
        : null
      }

      {/* Delete User Dialog */}
      <BasicDialog
        openBasicDiag={open}
        closeBasicDiag={handleAlertClose}
        dialogTitle={"Delete User"}
        dialogContentText={"Are you sure you want to delete this user?"}
        declineBtnText={"Cancel"}
        confirmBtnText={"Delete"}
        declineOnClick={handleAlertClose}
        confirmOnClick={onSubmitDelete}
      />

      {/* Restore User Dialog */}
      <BasicDialog
        openBasicDiag={restoreOpen}
        closeBasicDiag={handleRestoreClose}
        dialogTitle={"Restore User"}
        dialogContentText={"Are you sure you want to restore this user?"}
        declineBtnText={"Cancel"}
        confirmBtnText={"Restore"}
        declineOnClick={handleRestoreClose}
        confirmOnClick={onSubmitRestore}
      />

    </Grid>
  );
};

export default Users;