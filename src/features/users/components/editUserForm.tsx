import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { EditUserFormFCProps, EditUserFormInputs } from "../../../app/types/types";
import { Validations } from "../../../app/validations";
import styles from "./styles";

const EditUserForm = (props: EditUserFormFCProps) => {
  if (props.currRow == undefined) return null;

  const { enqueueSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, errors }
  } = useForm<EditUserFormInputs>({
    defaultValues: {
      firstName: props.currRow["First Name"],
      lastName: props.currRow["Last Name"],
      userName: props.currRow["Username"],
      userStatus: props.currRow["User Status"],
      role: props.currRow["Role"],
    }
  });

  const isFormModified = (data: EditUserFormInputs) => {
    if (isDirty === true) { props.onSubmitPut(data) }
    else {
      enqueueSnackbar("No Changes were made", { variant: 'warning' });
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(editedUserInfo => isFormModified(editedUserInfo))}>
      <Box sx={styles.modal}>
        <Typography id="modal-modal-title" variant="h6">
          Edit user - {props.currRow["First Name"]}
        </Typography>
        <Grid container spacing={2} mt={1} columns={2}>
          {/* First Name */}
          <Grid item md={1}>
            <Controller
              name='firstName'
              control={control}
              rules={{ pattern: Validations.name }}
              render={({ field }) => (
                <TextField
                  label="First name"
                  error={Boolean(errors?.firstName)}
                  helperText={errors.firstName?.message?.toString()}
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Last Name */}
          <Grid item md={1}>
            <Controller
              name="lastName"
              control={control}
              rules={{ pattern: Validations.name }}
              render={({ field }) => (
                <TextField
                  label="Last name"
                  error={Boolean(errors?.lastName)}
                  helperText={errors.lastName?.message?.toString()}
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Username */}
          <Grid item md={1}>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <TextField
                  label="Username"
                  error={Boolean(errors?.userName)}
                  helperText={errors.userName?.message?.toString()}
                  disabled
                  {...field}
                />
              )}
            />
          </Grid>
          {/* Place holder */}
          <Grid item md={1}></Grid>
          {/* Role */}
          <Grid item md={1}>
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
          {/* User Status */}
          <Grid item md={1}>
            <Controller
              name='userStatus'
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Status"
                  {...field}>
                  <MenuItem value='Approved'>Approved</MenuItem>
                  <MenuItem value='Pending'>Pending</MenuItem>
                </TextField>
              )}
            />
          </Grid>
          {/* Action Buttons */}
          <Grid item md={2}>
            <Stack direction='row' spacing={2}>
              <Button onClick={() => props.handleClose()} >Cancel</Button>
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

export default EditUserForm;