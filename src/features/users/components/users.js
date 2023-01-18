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
  IconButton,
  Card,
  Tooltip,
  Modal,
  Button,
  MenuItem
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { default as styles } from './styles';
import BasicTable from '../../../shared-components/table/table';
import BasicDialog from '../../../shared-components/basic-dialog/basic-dialog';
//icons
import AddIcon from '@mui/icons-material/Add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

const Users = ({ dispatch, tableInfo, reducers, usersInfo, renderMobileUserCol }) => {
  const { enqueueSnackbar } = useSnackbar();
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
  const { handleSubmit, control, clearErrors, reset, watch, formState: { errors } } = useForm();
  const [addOpen, setAddOpen] = useState(false);
  const handleAddModal = () => setAddOpen(true);
  const [editOpen, setEditOpen] = useState(false);
  const handleEditModal = () => {
    setEditOpen(true);
  };
  const handleClose = (data) => {
    reset();
    setAddOpen(false);
    setEditOpen(false);
  };

  //Data
  const [currRow, setRow] = useState('');
  //Callback Function
  const tableToUsers = (tableData) => {
    setRow(tableData);
  };

  const onSubmitPost = (data) => {
    data = {
      ...data,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id)
    };
    dispatch(reducers.postUserInfoApi(data));
    handleClose();
  };

  const onSubmitPut = (data) => {
    data = {
      ...data,
      id: currRow.id,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id),
      // dateCreated: currRow.dateCreated,
      //password: currRow.password
    };
    enqueueSnackbar("Updated user", {
      variant: 'success'
    });
    dispatch(reducers.putUserInfoApi(data));
    setEditOpen(!editOpen);
    setRow('');
  };

  const onSubmitDelete = () => {
    if (currRow.id == 1) {
      enqueueSnackbar("This user cannot be deleted", {
        variant: 'error'
      });
    } else if (parseInt(JSON.parse(localStorage.getItem("userInfo")).id) == currRow.id) {
      enqueueSnackbar("You cannot delete your account", {
        variant: 'error'
      });
    }
    else {
      let data = {
        userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id),
        id: currRow.id
      };
      dispatch(reducers.removeUserInfoApi(data));
      enqueueSnackbar("User deleted", {
        variant: 'success'
      });
    }
    handleAlertClose();
    setRow('');
  };

  const onSubmitRestore = () => {
    let data = {
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id),
      id: currRow.id
    };
    dispatch(reducers.restoreUserInfoApi(data));
    enqueueSnackbar("User restored", {
      variant: 'success'
    });
    handleRestoreClose();
    setRow('');
  };

  //FORM VALIDATION
  const validations = {
    name: {
      value: /^[\.a-zA-Z, ]*$/,
      message: 'Please enter characters from A to Z only'
    },
    username: (userName) => {
      if (currRow.userName === userName) {
        clearErrors("userName");
      }
      else if (usersInfo.some(i => i.userName === userName)) {
        return "Username already exists. Please use another.";
      }
    },
    password: {
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      comparePasswords: (confirmPassword) => {
        const password = watch('password');
        if (password !== confirmPassword) {
          return "Passwords do not match"
        }
      }
    }
  };

  //SEARCH 
  const existUserText = watch("searchExistUser");
  const removedUserText = watch("searchRemovedUser");

  const searchExistUser = (text) => {
    return tableInfo.existingUsers.info.filter(s => {
      if (s.firstName.toLowerCase().includes(text) || s.lastName.toLowerCase().includes(text) || s.userName.toLowerCase().includes(text) || s.role.toLowerCase().includes(text)) {
        return s
      };
    });
  };
  const searchRemovedUser = (text) => {
    return tableInfo.removedUsers.info.filter(s => {
      if (s.firstName.toLowerCase().includes(text) || s.lastName.toLowerCase().includes(text) || s.userName.toLowerCase().includes(text) || s.role.toLowerCase().includes(text)) {
        return s
      };
    });
  };

  const existUserFilter = searchExistUser(existUserText);
  const removedUserFilter = searchRemovedUser(removedUserText);

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
                  rules={{ pattern: validations.name }}
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
                      margin="dense"
                      size='small'
                      fullWidth
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
                <Modal
                  open={addOpen}
                  onClose={handleClose}>
                  <form onSubmit={handleSubmit(data => onSubmitPost(data))}>
                    <Box sx={styles.modal}>
                      <Typography id="modal-modal-title" variant="h6">
                        Add user
                      </Typography>
                      <Grid container spacing={2} mt={1}>
                        <Grid item md={6}>
                          <Controller
                            name="firstName"
                            defaultValue=""
                            control={control}
                            rules={{
                              pattern: validations.name
                            }}
                            render={({ field }) => (
                              <TextField
                                label="First name"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                onChange={field.onChange}
                                error={Boolean(errors?.firstName)}
                                helperText={errors.firstName?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name="lastName"
                            control={control}
                            rules={{
                              pattern: validations.name
                            }}
                            render={({ field }) => (
                              <TextField
                                label="Last name"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                onChange={field.onChange}
                                error={Boolean(errors?.lastName)}
                                helperText={errors.lastName?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name="userName"
                            control={control}
                            rules={{
                              validate: validations.username,
                              pattern: {
                                value: /^[a-zA-Z0-9_.]*$/,
                                message: "Please enter a valid username"
                              }

                            }}
                            render={({ field }) => (
                              <TextField
                                label="Username"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                onChange={field.onChange}
                                error={Boolean(errors?.userName)}
                                helperText={errors.userName?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='password'
                            control={control}
                            rules={{
                              minLength: validations.password.minLength
                            }}
                            defaultValue=''
                            required
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Password"
                                type="password"
                                margin="dense"
                                fullWidth
                                onChange={field.onChange}
                                error={Boolean(errors?.password)}
                                helperText={errors.password?.message}
                                required
                                size='small'
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='confirmPassword'
                            control={control}
                            rules={{
                              validate: validations.password.comparePasswords
                            }}
                            defaultValue=''
                            required
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Confirm Password"
                                type="password"
                                margin="dense"
                                required
                                fullWidth
                                size='small'
                                onChange={field.onChange}
                                error={Boolean(errors?.confirmPassword)}
                                helperText={errors?.confirmPassword?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='role'
                            control={control}
                            defaultValue=''
                            render={({ field }) => (
                              <TextField
                                select
                                label="Role"
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                {...field}>
                                <MenuItem value='Admin'>Admin</MenuItem>
                                <MenuItem value='Cashier'>Cashier</MenuItem>
                                <MenuItem value='Inventory Clerk'>Inventory Clerk</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md={12}>
                          <Stack direction='row' spacing={2}>
                            <Button onClick={handleClose} >Cancel</Button>
                            <Button
                              variant="contained"
                              disableElevation
                              size="large"
                              type="submit"
                            >Save
                            </Button>
                          </Stack>
                        </Grid>

                      </Grid>
                    </Box>
                  </form>
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
                      disabled={currRow === '' || currRow.isRemoved === true} >
                      Edit User
                    </Button>
                  </Box>
                {/* </Tooltip> */}

                {/* EDIT */}
                <Modal
                  open={editOpen}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onSubmitPut(data))}>
                    <Box sx={styles.modal}>
                      <Typography id="modal-modal-title" variant="h6">
                        Edit user - {currRow.firstName}
                      </Typography>
                      <Grid container spacing={2} mt={1}>
                        <Grid item md={6}>
                          <Controller
                            name='firstName'
                            control={control}
                            defaultValue={currRow.firstName}
                            rules={{
                              pattern: validations.name
                            }}
                            render={({ field }) => (
                              <TextField
                                label="First name"
                                margin="dense"
                                size='small'
                                required
                                onChange={field.onChange}
                                error={Boolean(errors?.firstName)}
                                helperText={errors.firstName?.message}
                                fullWidth
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name="lastName"
                            defaultValue={currRow.lastName}
                            control={control}
                            rules={{
                              pattern: validations.name
                            }}
                            render={({ field }) => (
                              <TextField
                                label="Last name"
                                margin="dense"
                                size='small'
                                required
                                onChange={field.onChange}
                                error={Boolean(errors?.lastName)}
                                helperText={errors.lastName?.message}
                                fullWidth
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name="userName"
                            defaultValue={currRow.userName}
                            control={control}
                            rules={{
                              validate: validations.username
                            }}
                            render={({ field }) => (
                              <TextField
                                label="Username"
                                margin="dense"
                                size='small'
                                required
                                onChange={field.onChange}
                                error={Boolean(errors?.userName)}
                                helperText={errors.userName?.message}
                                fullWidth
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='role'
                            control={control}
                            defaultValue={currRow.role}
                            render={({ field }) => (
                              <TextField
                                select
                                label="Role"
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                {...field}>
                                <MenuItem value='Admin'>Admin</MenuItem>
                                <MenuItem value='Cashier'>Cashier</MenuItem>
                                <MenuItem value='Inventory Clerk'>Inventory Clerk</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='userStatus'
                            control={control}
                            defaultValue={currRow.userStatus}
                            render={({ field }) => (
                              <TextField
                                select
                                label="Status"
                                margin="dense"
                                size='small'
                                fullWidth
                                {...field}>
                                <MenuItem value='Approved'>Approved</MenuItem>
                                <MenuItem value='Pending'>Pending</MenuItem>
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md={12}>
                          <Stack direction='row' spacing={2}>
                            <Button onClick={handleClose} >Cancel</Button>
                            <Button
                              variant="contained"
                              disableElevation
                              size="large"
                              type="submit"
                            >Save
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </form>
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
                      disabled={currRow === '' || currRow.isRemoved === true} >
                      Delete User
                    </Button>
                  </Box>
                {/* </Tooltip> */}

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
              </Stack>

            </Grid>

            {isMobile ?
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
            }

          </Card>
        </Grow>
      </Grid>
      {tableInfo.removedUsers.info.length != 0 ?
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
                  variant='title'
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
                    rules={{ pattern: validations.name }}
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
                        margin="dense"
                        size='small'
                        fullWidth
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
                  disabled={currRow === '' || currRow.isRemoved === false}
                  onClick={handleRestoreOpen}>Restore User</Button>
              </Stack>
            </Grid>

            <Box p={'1px 1em 1em 1em'}>
              {/* User Archive Table */}
              {isMobile ?
                <BasicTable
                  columns={renderMobileUserCol}
                  rows={removedUserFilter}
                  tableToModule={tableToUsers} />
                :
                <BasicTable
                  columns={tableInfo.removedUsers.columns()}
                  rows={removedUserFilter}
                  tableToModule={tableToUsers} />
              }
            </Box>
          </Card>
        </Grid>
        : null
      }

    </Grid>
  );
};

export default Users;