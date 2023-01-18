import BasicTable from '../../../shared-components/table/table';
import { abbvMeasureUnit } from "../constant";
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
  MenuItem,
  Menu,
} from '@mui/material';
import { default as styles } from './styles';
//icons
import AddIcon from '@mui/icons-material/Add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { 
  clearUpdateQuantityStatus, 
  setRow, 
  postStockApi, 
  updateStockQuantityApi, 
  setQuantityModal, 
  editStockApi} from '../slice';

const Inventory = ({ 
  dispatch, 
  columns, 
  mobileViewInfo, 
  supplierInfo, 
  existingStock,
  uniqueCategories,
  uniqueMeasurementUnit,
}) => {

  const { updateQuantityStatus } = useSelector(state => state.inventory);
  const { enqueueSnackbar } = useSnackbar();

  //Modals
  const { handleSubmit, control, reset, watch, setValue, formState: { errors }, getValues } = useForm();

  // ADD MODAL
  const [addOpen, setAddOpen] = useState(false);
  const handleAddModal = () => setAddOpen(true);

  //HANDLE TABLE ON MOBILE VIEW
  const [isMobile, setIsMobile] = useState(false)
  const handleResize = () => {
    if (window.screen.width < 1050 || window.innerWidth < 1050) {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  });

  //EDIT 
  const [editMenu, setEditMenu] = useState(null);
  const openEditMenu = Boolean(editMenu);
  const handleEditMenuClick = (event) => {
    setEditMenu(event.currentTarget);
  };

  const { quantityModal, currRow } = useSelector(state => state.inventory);
  const handleQuantityModal = () => {
    dispatch(setQuantityModal(true));
    setEditMenu(null);
  };

  const [editOpen, setEditOpen] = useState(false);
  const handleEditModal = () => {
    setEditOpen(true);
    setEditMenu(null);
  };
  const handleClose = () => {
    reset();
    setAddOpen(false);
    setEditOpen(false);
    setEditMenu(null);
    dispatch(setQuantityModal(false));
  };

  //Data
  //Callback Function
  const tableToInventory = (tableData) => {
    dispatch(setRow(tableData));
  };

  // Add , edit inventory
  const onSubmitPost = (data) => {
    data = {
      ...data,
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
      measure: parseFloat(data.measure),
      criticalLevel: parseFloat(data.criticalLevel),
      lowLevel: parseFloat(data.lowLevel),
      ceiling: parseFloat(data.ceiling),
      stockServingId: data.stockServingId ? parseInt(data.stockServingId) : null,
      price: parseFloat(data.price)
    };
    dispatch(postStockApi(data));
    enqueueSnackbar("New stock added", {
      variant: "success"
    });
    handleClose();
  };

  const onSubmitPut = (data) => {
    delete data.search;
    data = {
      ...data,
      id: currRow.id,
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
      // measure: parseFloat(data.measure),
      criticalLevel: parseFloat(data.criticalLevel),
      lowLevel: parseFloat(data.lowLevel),
      ceiling: parseFloat(data.ceiling),
      price: parseFloat(data.price)
      // stockServingId: parseInt(data.stockServingId)
    };
    dispatch(editStockApi(data));
    enqueueSnackbar("Stocked edited successfully", {
      variant: "success"
    });
    dispatch(setRow(""));
    handleClose();
  };

  const onSubmitQuantity = (data) => {
    data = {
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id),
      stockName: currRow.name,
      measure: parseFloat(data.measure),
    }
    dispatch(updateStockQuantityApi(data))
    dispatch(setRow(""));
    handleClose();
  };

  //FORM VALIDATION
  const validations = {
    name: {
      value: /^[\.a-zA-Z0-9,!?&' ]*$/,
      message: 'Please enter a valid input'
    },
  };

  //FILED VALUES
  const uom = watch("measurementUnit");
  const category = watch("category");
  const search = watch("search");

  const searchText = (text) => {
    return existingStock.filter(s => {
      if (s.name.toLowerCase().includes(text) || s.category.toLowerCase().includes(text) || s.supplier.toLowerCase().includes(text) || s.status.toLowerCase().includes(text)) {
        return s;
      };
    });
  };

  const filteredSearch = searchText(search);

  useEffect(() => {
    if (category === "Pizza") {
      setValue('measurementUnit', "Pieces");
    } else {
      setValue('measurementUnit', "");
    }
  }, [category]);

  useEffect(() => {
    if (updateQuantityStatus == true) {
      enqueueSnackbar("Stock measure updated", {
        variant: "success"
      });
      dispatch(clearUpdateQuantityStatus());
    }
    if (updateQuantityStatus == false) {
      enqueueSnackbar("No changes were made", {
        variant: "warning"
      });
      dispatch(clearUpdateQuantityStatus());
    }
  }, [updateQuantityStatus]);

  return (
    <Grid container spacing={2}>
      <Grid item md={12} mt={2}>
        <Stack direction="row" spacing={1}>
          <Typography variant='h6' sx={styles.overviewText}>
            Inventory
          </Typography>
          <Tooltip title="The inventory page lets you manage all your stock items. You can view, add, update, and archive items.">
            <Box sx={styles.overviewContent}>
              <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
            </Box>
          </Tooltip>
        </Stack>
      </Grid>

      <Grid item container md={12}>
        <Grow in={true} timeout={800}>
          <Card>
            <Grid item md={12} sx={styles.actionBarWrapper}>
              <form>
                <Controller
                  name='search'
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
                {/* <Tooltip title="Add new stock"> */}
                  <Box sx={styles.iconBox}>
                    {/* <IconButton
                      onClick={handleAddModal}
                      variant="contained"
                      size='small'>
                        <AddIcon />
                    </IconButton> */}
                    <Button 
                      variant='contained'
                      onClick={handleAddModal}
                      size='small'>
                      Add Stock  
                    </Button>
                  </Box>
                {/* </Tooltip> */}

                {/* ADD ITEM MODAL */}
                <Modal
                  open={addOpen}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onSubmitPost(data))}>
                    <Box sx={styles.modal}>
                      <Grid item md={12}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant='h6' sx={styles.overviewText}>
                            Add new stock
                          </Typography>
                          <Tooltip title="Add a new stock to your inventory">
                            <Box sx={styles.overviewContent}>
                              <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
                            </Box>
                          </Tooltip>
                        </Stack>
                      </Grid>
                      <Grid container spacing={2} mt={1}>
                        <Grid item md={6}>
                          <Controller
                            name='name'
                            control={control}
                            defaultValue=""
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Name"
                                margin="dense"
                                size='small'
                                fullWidth
                                onChange={field.onChange}
                                error={Boolean(errors?.name)}
                                helperText={errors.name?.message}
                                required
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='supplier'
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                label="Supplier"
                                margin="dense"
                                size='small'
                                fullWidth
                                select
                                required
                                {...field}
                              >
                                {supplierInfo.map((supplier, index) => (
                                  <MenuItem key={index} value={supplier.name}>{supplier.name}</MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='category'
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                              <TextField
                                id="outlined-password-input"
                                label="Category"
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                select
                                {...field}
                              >
                                {uniqueCategories.map((stock, index) => (
                                  <MenuItem key={index} value={stock}>{stock}</MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item container direction="row" md={6}>
                          <Grid item md={7}>
                            <Controller
                              name='measure'
                              control={control}
                              defaultValue={0}
                              render={({ field }) => (
                                <TextField
                                  disabled={true}
                                  label={category === "Pizza" ? 'Quantity' : "Measure"}
                                  type="number"
                                  margin="dense"
                                  InputProps={{
                                    inputProps: { min: 1 },
                                  }}
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={5}>
                            <Controller
                              name='measurementUnit'
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <Box ml={2}>
                                  <TextField
                                    disabled={category === "Pizza" ? true : null}
                                    label="Unit"
                                    margin="dense"
                                    size='small'
                                    fullWidth
                                    required
                                    select
                                    {...field}
                                  >
                                    {uniqueMeasurementUnit.map((uom, index) => (
                                      <MenuItem key={index} value={uom}>{uom}</MenuItem>
                                    ))}
                                  </TextField>
                                </Box>
                              )}
                            />
                          </Grid>
                          <Grid item md>
                            <Controller
                              name='price'
                              control={control}
                              defaultValue=''
                              render={({ field }) => (
                                <TextField
                                  label="Price"
                                  sx={{ display: category !== "Pizza" ? 'none' : null }}
                                  type="number"
                                  margin="dense"
                                  size='small'
                                  helperText="Sale price of item"
                                  fullWidth
                                  InputProps={{
                                    inputProps: { min: 1 },
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        Php
                                      </InputAdornment>
                                    )
                                  }}
                                  {...field}
                                >
                                </TextField>
                              )}
                            />
                          </Grid>
                        </Grid>
                        <Grid item container spacing={2} md={12}>
                          <Grid item md={12}>
                            <Stack direction="row" spacing={1}>
                              <Typography fontWeight={600}>
                                Warning Levels
                              </Typography>
                              <Tooltip title="Set a warning amount for the added item">
                                <Box sx={styles.overviewContent}>
                                  <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
                                </Box>
                              </Tooltip>
                            </Stack>
                          </Grid>
                          <Grid item md={4}>
                            <Controller
                              name='criticalLevel'
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  label="Critical"
                                  color='error'
                                  InputProps={{
                                    inputProps: { min: 0, step: "any" },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(uom)}
                                      </InputAdornment>
                                    )
                                  }}
                                  type="number"
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <Controller
                              name='lowLevel'
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  label="Low"
                                  type="number"
                                  color='warning'
                                  InputProps={{
                                    inputProps: { min: 0, step: "any" },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(uom)}
                                      </InputAdornment>
                                    )
                                  }}
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <Controller
                              name='ceiling'
                              control={control}
                              defaultValue=""
                              render={({ field }) => (
                                <TextField
                                  label="Ceiling"
                                  color='info'
                                  InputProps={{
                                    inputProps: { min: 1 },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(uom)}
                                      </InputAdornment>
                                    )
                                  }}
                                  type="number"
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>

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

                {/* END STOCK BUTTON */}
                {/* <Tooltip title="Edit item"> */}
                  <Box sx={styles.iconBox}>
                    {/* <IconButton
                      onClick={handleEditMenuClick}
                      disabled={currRow === ''}
                      variant="contained"
                      size='small'
                      aria-label="Edit item"
                    ><EditRoundedIcon />
                    </IconButton> */}
                    <Button
                      variant='text'
                      disabled={currRow === ''}
                      size='small'
                      onClick={handleEditModal}>
                      Edit Stock Info
                    </Button>
                  </Box>
                  <Box sx={styles.iconBox}>
                  <Button
                      variant='text'
                      disabled={currRow === ''}
                      size='small'
                      onClick={handleQuantityModal}>
                      Manage Quantity
                    </Button>
                  </Box>

                {/* </Tooltip> */}
                <Menu
                  anchorEl={editMenu}
                  open={openEditMenu}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleEditModal}>Edit stock info</MenuItem>
                  <MenuItem onClick={handleQuantityModal}>Manage quantity</MenuItem>
                </Menu>

                {/* EDIT ITEM INFO MODAL */}
                <Modal
                  open={editOpen}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onSubmitPut(data))}>
                    <Box sx={styles.modal}>
                      <Grid item md={12}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant='h6' sx={styles.overviewText}>
                            Edit stock information
                          </Typography>
                          <Tooltip title="Edit an exisiting item in your inventory">
                            <Box sx={styles.overviewContent}>
                              <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
                            </Box>
                          </Tooltip>
                        </Stack>
                      </Grid>
                      <Grid container spacing={2} mt={1}>
                        <Grid item md={6}>
                          <Controller
                            name='name'
                            control={control}
                            defaultValue={currRow.name}
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Name"
                                margin="dense"
                                size='small'
                                fullWidth
                                onChange={field.onChange}
                                error={Boolean(errors?.name)}
                                helperText={errors.name?.message}
                                required
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='supplier'
                            control={control}
                            defaultValue={currRow.supplier}
                            render={({ field }) => (
                              <TextField
                                label="Supplier"
                                margin="dense"
                                size='small'
                                fullWidth
                                select
                                required
                                {...field}
                              >
                                {supplierInfo.map((supplier, index) => (
                                  <MenuItem key={index} value={supplier.name}>{supplier.name}</MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='category'
                            control={control}
                            defaultValue={currRow.category}
                            render={({ field }) => (
                              <TextField
                                id="outlined-password-input"
                                label="Category"
                                margin="dense"
                                size='small'
                                fullWidth
                                required
                                select
                                {...field}
                              >
                                {uniqueCategories.map((stock, index) => (
                                  <MenuItem key={index} value={stock}>{stock}</MenuItem>
                                ))}
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item md>
                          <Controller
                            name='price'
                            control={control}
                            defaultValue={currRow.price}
                            render={({ field }) => (
                              <TextField
                                label="Price"
                                sx={{ display: currRow.category !== "Pizza" ? 'none' : null }}
                                type="number"
                                margin="dense"
                                size='small'
                                helperText="Sale price of item"
                                fullWidth
                                InputProps={{
                                  inputProps: { min: 1 },
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      Php
                                    </InputAdornment>
                                  )
                                }}
                                {...field}
                              >
                              </TextField>
                            )}
                          />
                        </Grid>
                        <Grid item container spacing={2} md={12}>
                          <Grid item md={12}>
                            <Stack direction="row" spacing={1}>
                              <Typography fontWeight={600}>
                                Warning Levels
                              </Typography>
                              <Tooltip title="Set a warning amount for the added item">
                                <Box sx={styles.overviewContent}>
                                  <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
                                </Box>
                              </Tooltip>
                            </Stack>
                          </Grid>
                          <Grid item md={4}>
                            <Controller
                              name='criticalLevel'
                              control={control}
                              defaultValue={currRow.criticalLevel}
                              render={({ field }) => (
                                <TextField
                                  label="Critical"
                                  color='error'
                                  InputProps={{
                                    inputProps: { min: 0, step: "any" },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(getValues("measurementUnit"))}
                                      </InputAdornment>
                                    )
                                  }}
                                  type="number"
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <Controller
                              name='lowLevel'
                              control={control}
                              defaultValue={currRow.lowLevel}
                              render={({ field }) => (
                                <TextField
                                  label="Low"
                                  type="number"
                                  color='warning'
                                  InputProps={{
                                    inputProps: { min: 0, step: "any" },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(getValues("measurementUnit"))}
                                      </InputAdornment>
                                    )
                                  }}
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={4}>
                            <Controller
                              name='ceiling'
                              control={control}
                              defaultValue={currRow.ceiling}
                              render={({ field }) => (
                                <TextField
                                  label="Overstock"
                                  color='info'
                                  InputProps={{
                                    inputProps: { min: 1, step: "any" },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(getValues("measurementUnit"))}
                                      </InputAdornment>
                                    )
                                  }}
                                  type="number"
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            />
                          </Grid>

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
                {/* END EDIT ITEM MODAL */}

                {/* EDIT STOCK QUANTITY MODAL */}
                <Modal
                  open={quantityModal}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onSubmitQuantity(data))}>
                    <Box sx={styles.qtyModal}>
                      <Grid item md={12}>
                        <Stack direction="row" spacing={1}>
                          <Typography variant='h6' sx={styles.overviewText}>
                            Update Quantity
                          </Typography>
                          <Tooltip title="Edit the quantity of an exisiting stock in your inventory">
                            <Box sx={styles.overviewContent}>
                              <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
                            </Box>
                          </Tooltip>
                        </Stack>
                        <Typography variant='subtitle1'>
                          {currRow.name} {`(${currRow.category})`}
                        </Typography>
                        <Typography variant='subtitle2'>
                          Supplier: {currRow.supplier}
                        </Typography>
                      </Grid>
                      <Grid container spacing={2} mt={1}>
                        <Grid item container direction="row" md={12}>
                          <Grid item md={12}>
                            <Controller
                              name='measure'
                              control={control}
                              defaultValue={currRow.measure}
                              render={({ field }) => (
                                <TextField
                                  label="Measure"
                                  type="number"
                                  margin="dense"
                                  size='small'
                                  required
                                  fullWidth
                                  InputProps={{
                                    inputProps: { min: 1 },
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        {abbvMeasureUnit(currRow.measurementUnit)}
                                      </InputAdornment>
                                    )
                                  }}
                                  {...field}
                                />
                              )}
                            />
                          </Grid>
                          <Grid item md={12} mt={2}>
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
                      </Grid>
                    </Box>
                  </form>
                </Modal>
              </Stack>
            </Grid>
            {/* END EDIT ITEM QUANTITY MODAL */}


            <Grid item container md={12}>
              <Box p={'1px 1em 1em 1em'}>
                {isMobile ?
                  <BasicTable
                    columns={mobileViewInfo.columns}
                    rows={filteredSearch} tableToModule={tableToInventory}
                    maxHeight={440}
                    maxWidth={'100%'} />
                  :
                  <BasicTable columns={columns}
                    rows={filteredSearch}
                    tableToModule={tableToInventory}
                    maxHeight={440}
                    maxWidth={'100%'} />
                }
              </Box>
            </Grid>
          </Card>
        </Grow>
      </Grid>
    </Grid>
  );
};

export default Inventory;
