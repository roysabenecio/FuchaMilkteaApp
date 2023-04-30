import { useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Grid,
  Typography,
  Box,
  Stack,
  TextField,
  Card,
  Button,
} from '@mui/material';
import { default as styles } from './styles';
import { clearProfileStatus, putProfileInfoApi } from '../../users/slice';


const Profile = ({ userInfo, dispatch, profileStatus }) => {
  const { usersInfo } = useSelector((state) => state.users);
  const { handleSubmit, control, clearErrors, reset, watch, formState: { errors } } = useForm();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (profileStatus == true) {
      enqueueSnackbar("Profile edited successfully", {
        variant: 'success'
      });
      dispatch(clearProfileStatus());
    }
    if (profileStatus == false) {
      enqueueSnackbar("Password incorrect. Please try again.", {
        variant: 'error'
      });
      dispatch(clearProfileStatus());
    }
  }, [profileStatus]);

  //FORM VALIDATION
  const validations = {
    name: {
      value: /^[A-Za-z]+$/i,
      message: 'Please enter characters from A to Z only'
    },
    username: (userName) => {
      if (userInfo.userName === userName) {
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
        const newPassword = watch('newPassword');
        if (newPassword !== confirmPassword) {
          return "Passwords do not match";
        }
      },
      // compareOldPassword: () => {

      //   if (oldPassword !== userInfo.password) {
      //     return "Password incorrect. Please try again."
      //   }
      // }
    }
  };

  const onSave = (data) => {
    delete data.confirmPassword;
    data = { ...data, id: userInfo.id }
    // dispatch(putProfileInfoApi(data));
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Typography
          mt={2}
          sx={styles.overviewText}
          variant='h6'
        >Profile
        </Typography>
      </Grid>

      <Grid item md={12}>
        <Card>
          <form onSubmit={handleSubmit(data => onSave(data))}>
            <Box sx={styles.modal}>
              <Grid container spacing={2} mt={1}>
                <Grid item md={6}>
                  <Controller
                    name='firstName'
                    control={control}
                    defaultValue={userInfo.firstName}
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
                        helperText={errors?.firstName?.message}
                        fullWidth
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}>
                  <Controller
                    name='lastName'
                    control={control}
                    defaultValue={userInfo.lastName}
                    rules={{
                      pattern: validations.name
                    }}
                    render={({ field }) => (
                      <TextField
                        label="Last name"
                        margin="dense"
                        size='small'
                        required
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
                    name='userName'
                    control={control}
                    defaultValue={userInfo.userName}
                    rules={{
                      validate: validations.username
                    }}
                    render={({ field }) => (
                      <TextField
                        label="Username"
                        margin="dense"
                        size='small'
                        required
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
                    name='currentPassword'
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        label="Current Password"
                        type="password"
                        margin="dense"
                        size='small'
                        required
                        fullWidth
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}>
                  <Controller
                    name='newPassword'
                    control={control}
                    defaultValue=""
                    rules={{
                      minLength: validations.password.minLength
                    }}
                    render={({ field }) => (
                      <TextField
                        label="New Password"
                        type="password"
                        margin="dense"
                        size='small'
                        required
                        error={Boolean(errors?.newPassword)}
                        helperText={errors.newPassword?.message}
                        fullWidth
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={6}>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    defaultValue=""
                    rules={{
                      validate: validations.password.comparePasswords
                    }}
                    render={({ field }) => (
                      <TextField
                        label="Confirm password"
                        type="password"
                        margin="dense"
                        size='small'
                        fullWidth
                        required
                        error={Boolean(errors?.confirmPassword)}
                        helperText={errors?.confirmPassword?.message}
                        {...field}
                      />
                    )}
                  />
                </Grid>
                <Grid item md={12}>
                  <Stack direction='row' spacing={2}>
                    <Button
                      variant="contained"
                      disableElevation
                      size="large"
                      type="submit" >
                      Save
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;