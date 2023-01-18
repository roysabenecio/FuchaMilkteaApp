/** @jsxImportSource @emotion/react */
import { TextField, Box, Button, Typography, Grow } from '@mui/material';
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import loginCss from './styles';
import { default as color } from '../../../util/color-palette';
import { loginUserApi } from '../slice';

const Login = ({ dispatch }) => {
  const { handleSubmit, control } = useForm();
  const onLogin = async (data) => {
    dispatch(loginUserApi(data));
  };

  return (
    <form onSubmit={handleSubmit(data => onLogin(data))}>
      <Box css={loginCss.parent}>
        <Box css={loginCss.formDiv}>
          <Box>
            <Box css={loginCss.logoDiv}>
              <img css={loginCss.logoImg} src="/images/fucha_logo.png" alt="Empty" />
            </Box>
          </Box>
          <Box css={loginCss.formFields}>
            <Box width={'70%'} mb={'.5rem'}>
              <Typography css={loginCss.loginTitle} variant="h3">Login</Typography>
              <Typography fontWeight={'100'} variant="body1" >Welcome to your sales and inventory system. Please enter your details.</Typography>
            </Box>

            <Controller
              name='userName'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  margin="dense"
                  size='small'
                  required
                  autoFocus
                  css={loginCss.textField}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  margin="dense"
                  size='small'
                  required
                  css={loginCss.textField}
                />
              )}
            />
            <Button
              css={loginCss.button}
              variant="loginBtn"
              disableElevation
              size="large"
              type='submit'
            >Login
            </Button>

            <Box sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Typography mr={0.5}>
                Don't have an account?
              </Typography>
              <Link
                style={{
                  color: color.secondaryRedColor,
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
                to="/register"
              >Register
              </Link>
            </Box>
          </Box>
        </Box>
        <Box css={loginCss.displayImgPane} >
          <Grow in={true} timeout={1000}>
            <Box css={loginCss.displayImgDiv}>
              <img
                css={loginCss.displayImg}
                src="images\Group-display.png"
                alt="" />
            </Box>
          </Grow>
        </Box>
      </Box>
    </form>
  );
};

export default Login;