import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Controller, useForm, useFormContext } from "react-hook-form";
import styles from "./styles";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { Validations } from "../../../app/validations";
import { AddUserFormFCProps, RegisterForm } from "../../../app/types/types";

const AddUserForm = (props: AddUserFormFCProps) => {
  const { handleSubmit, control, clearErrors, reset, watch, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      // userStatus: "",
      password: "",
      confirmPassword: "",
      role: "",
    }
  });
  // const {handleSubmit, reset} = useFormContext();
  // if (props.currRow === undefined) return null

  return (
    <form onSubmit={handleSubmit(data => props.onValidate(data))}>
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6">
          Add user
        </Typography>
        <Grid container spacing={2} mt={1}>
          {/* First Name */}
          <Grid item md={6}>
            <Controller
              name="firstName"
              control={control}
              rules={{ pattern: Validations.name }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="First name"
                  error={Boolean(errors?.firstName)}
                  helperText={errors.firstName?.message?.toString()}
                />
              )}
            />
          </Grid>
          {/* Last Name */}
          <Grid item md={6}>
            <Controller
              name="lastName"
              control={control}
              rules={{ pattern: Validations.name }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Last name"
                  error={Boolean(errors?.lastName)}
                  helperText={errors.lastName?.message?.toString()}
                />
              )}
            />
          </Grid>
          {/* Username */}
          <Grid item md={6}>
            <Controller
              name="userName"
              control={control}
              rules={{
                // validate: Validations.username, // fix
                pattern: {
                  value: /^[a-zA-Z0-9_.]*$/,
                  message: "Please enter a valid username"
                }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  error={Boolean(errors?.userName)}
                  helperText={errors.userName?.message?.toString()}
                />
              )}
            />
          </Grid>
          {/* Role */}
          <Grid item md={6}>
            <Controller
              name='role'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Role"
                  {...field}>
                  <MenuItem value='Admin'>Admin</MenuItem>
                  <MenuItem value='Cashier'>Cashier</MenuItem>
                  <MenuItem value='Inventory Clerk'>Inventory Clerk</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {/* Password */}
          <Grid item md={6}>
            <Controller
              name='password'
              control={control}
              rules={{ minLength: Validations.password.minLength }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  error={Boolean(errors?.password)}
                  helperText={errors.password?.message?.toString()}
                />
              )}
            />
          </Grid>
          {/* Confirm Password */}
          <Grid item md={6}>
            <Controller
              name='confirmPassword'
              control={control}
              rules={{
                // validate: Validations.password.comparePasswords //fix
              }}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  label="Confirm Password"
                  type="password"
                  error={Boolean(errors?.confirmPassword)}
                  helperText={errors?.confirmPassword?.message?.toString()}
                  {...field}
                />
              )}
            />
          </Grid>
          
          <Grid item md={12}>
            <Stack direction='row' spacing={2}>
              <Button onClick={props.handleClose} >Cancel</Button>
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
  );
}

export default AddUserForm;