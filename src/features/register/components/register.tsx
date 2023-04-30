
/** @jsxImportSource @emotion/react */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { TextField, Box, Button, Typography, Grid, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack';
import type { RegisterForm, RegisterUser } from '../../../app/types/types';
import loginCss from './styles';
import { default as color } from '../../../util/color-palette';
import { useRegisterMutation } from '../../users/apiSlice';
import { useValidateUsernameMutation } from '../../../app/centralApiSlice';

const Register = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [userInfo, setUserInfo] = useState<RegisterUser>();
  const { handleSubmit, watch, control, formState: { errors } } = useForm<RegisterForm>();
  const [register, {data: registrationData, reset: resetRegister}] = useRegisterMutation();
  const [validateUsername, {data: validationData, reset: resetValidate}] = useValidateUsernameMutation();

  const onValidate = (userInfo: RegisterUser ) => {
    delete userInfo.confirmPassword;
    setUserInfo(userInfo);
    validateUsername({"username": userInfo.userName});
  };

  useEffect(() => {
    if (validationData === false) {
      register(userInfo);
      resetValidate();
    } else if (validationData === true) {
      enqueueSnackbar("Username already exists", {
        variant: 'warning'
      });
      resetValidate();
    }

    if (registrationData === true){
      enqueueSnackbar("Account has been created", {
        variant: 'success'
      });
      navigate('/login');
      resetRegister();
    }
  }, [validationData, registrationData]);

  //VALIDATIONS
  const validations = {
    name: {
      value: /^[\.a-zA-Z, ]*$/,
      message: 'Please enter characters from A to Z only'
    },
    // username: (userName) => {
    //   if (usersInfo.some(i => i.userName === userName)) {
    //     return "Username already exists. Please use another.";
    //   }
    // },
    password: {
      minLength: {
        value: 8,
        message: "Password must be at least 8 characters"
      },
      comparePasswords: (confirmPassword: string) => {
        let password = watch('password');
        if (password !== confirmPassword) {
          return "Passwords do not match";
        }
      }
    },
  };

  // useEffect(() => {
  //   dispatch(getAllUsersInfoApi);
  // }, []);

  return (
    <form onSubmit={handleSubmit(userInfo => onValidate(userInfo))}>
      <Box css={loginCss.parent}>
        <Box css={loginCss.formDiv}>
          <Box>
            <Box css={loginCss.logoDiv}>
              <img css={loginCss.logoImg} src="/images/fucha_logo.png" alt="Empty" />
            </Box>
          </Box>
          <Box css={loginCss.formFields}>
            <Box width={'70%'} mb={'.5rem'}>
              <Typography css={loginCss.loginTitle} variant="h3">
                Create your account
              </Typography>
              <Typography mr={0.5}>
                Already have an account?
                <Link
                  style={{
                    color: color.secondaryRedColor,
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    paddingLeft: 5
                  }}
                  to="/login"
                >Log in
                </Link>
              </Typography>
            </Box>

            <Grid container spacing={2}>
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
                      onChange={field.onChange}
                      error={Boolean(errors?.firstName)}
                      helperText={errors.firstName?.message}
                      css={loginCss.textField}
                    />
                  )}
                />
              </Grid>
              <Grid item md={6}>
                <Controller
                  name="lastName"
                  defaultValue=""
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
                      css={loginCss.textField}
                    />
                  )}
                />
              </Grid>
            </Grid>
            <Controller
              name="userName"
              defaultValue=""
              control={control}
              rules={{
                // validate: validations.username
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
                  css={loginCss.textField}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              rules={{
                minLength: validations.password.minLength
              }}
              defaultValue=''
              // required
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  margin="dense"
                  onChange={field.onChange}
                  error={Boolean(errors?.password)}
                  helperText={errors.password?.message}
                  required
                  size='small'
                  css={loginCss.textField}
                />
              )}
            />

            <Controller
              name='confirmPassword'
              control={control}
              rules={{
                validate: validations.password.comparePasswords
              }}
              defaultValue=''
              // required
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Confirm Password"
                  type="password"
                  margin="dense"
                  required
                  size='small'
                  css={loginCss.textField}
                  onChange={field.onChange}
                  error={Boolean(errors?.confirmPassword)}
                  helperText={errors?.confirmPassword?.message}
                />
              )}
            />

            <Controller
              name='role'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  select
                  label="Role"
                  margin="dense"
                  required
                  size='small'
                  css={loginCss.textField} {...field}>
                  <MenuItem value='Cashier'>Cashier</MenuItem>
                  <MenuItem value='Inventory Clerk'>Inventory Clerk</MenuItem>
                </TextField>
              )}
            />

            <Button
              css={loginCss.button}
              variant="contained"
              disableElevation
              size="large"
              type='submit'
            >Register
            </Button>

          </Box>
        </Box>
        <Box css={loginCss.displayImgPane}>
          <Box css={loginCss.displayImgDiv}>
            <img
              css={loginCss.displayImg}
              src="images\Group-display.png"
              alt="" />
          </Box>
        </Box>
      </Box>
    </form>
  );
};

export default Register;