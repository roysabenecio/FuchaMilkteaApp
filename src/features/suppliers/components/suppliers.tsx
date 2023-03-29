import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  Grid,
  Typography,
  Box,
  Stack,
  InputAdornment,
  TextField,
  Button,
  IconButton,
  Card,
  Tooltip,
  Grow,
  Modal,
  MenuItem
} from '@mui/material';
import { default as styles } from './styles';
import { getPOInfoApi, setOpenAddPurchaseRecord, setOpenAddPurchaseRecord1 } from '../slice';
import BasicTable from '../../../shared-components/table/table';
import BasicDialog from '../../../shared-components/basic-dialog/basic-dialog';
//icons
import AddIcon from '@mui/icons-material/Add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import PostAddIcon from '@mui/icons-material/PostAdd';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { getStockInfoApi } from '../../inventory/slice';

const Suppliers = ({
  dispatch,
  putSupplierInfoApi,
  putPurchaseInfoApi,
  postPurchaseInfoApi,
  supplierInfo,
  stockInfo,
  reducers,
  tableInfo,
  mobileTableInfo,
  purchaseRecNotifInfo,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { openAddPurchaseRecord, openAddPurchaseRecord1 } = useSelector(state => state.purchaseRec);
  const [currRow, setRow] = useState('');
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  //FORM VALIDATION
  const validations = {
    number: {
      inputCheck: {
        value: /^[-+]?[0-9]+$/,
        message: 'Please enter digits from 0-9 only'
      },
      minLength: {
        value: 8,
        message: "Please enter a valid contact number"
      },
      maxLength: {
        value: 11,
        message: "Please enter a valid contact number"
      }
    },
    name: {
      value: /^[\.a-zA-Z0-9,!?& ]*$/,
      message: 'Invalid input. Please enter a valid character.'
    },
    email: {
      value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      message: 'Please enter a valid email address.'
    },
    receivedOrders: {
      value: currRow.receivedOrders,
      message: "test"
    }
  };

  //HANDLE TABLE ON MOBILE VIEW
  const [isMobile, setIsMobile] = useState(false);
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

  //FORM CONTROLS
  const { handleSubmit, control, getValues, setValue, reset, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        purchaseRec: [{
          supplier: "",
          stock: "",
          category: "",
          measure: "",
          measurementUnit: "",
          price: ""
        }]
      }
    }
  );
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "purchaseRec",
  });
  //GET FIELD VALUES
  const supplierVal = watch(`purchaseRec[0].supplier`);

  //MODAL CONTROL
  //SUPPLIER CONTROL
  const [restoreOpen, setRestoreOpen] = useState(false);
  const handleRestoreOpen = () => {
    setRestoreOpen(true);
  };
  const handleRestoreClose = () => {
    setRestoreOpen(false);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDelete = () => setDeleteOpen(!deleteOpen);

  const [openAddSupplier, setOpenAddSupplier] = useState(false);
  const [openEditSupplier, setOpenEditSupplier] = useState(false);

  const handleAddSupplierOpen = () => setOpenAddSupplier(true);
  const handleEditSupplierOpen = () => {
    setOpenEditSupplier(true);
  }

  //PURCHASE RECORD CONTROL
  const handlePurchaseRecordOpen = () => dispatch(setOpenAddPurchaseRecord(true));

  const [openEditPO, setOpenEditPO] = useState(false);
  const handleEditPoOpen = () => {
    if (currRow.status == "Received") {
      enqueueSnackbar("Transaction is already complete", {
        variant: 'warning'
      });
    } else {
      setOpenEditPO(true);
    }
  };

  const handleClose = () => {
    reset();
    //SUPPLIER
    setOpenAddSupplier(false);
    setOpenEditSupplier(false);
    //PR
    dispatch(setOpenAddPurchaseRecord(false));
    setOpenEditPO(false);
    //PR NOTIF
    dispatch(setOpenAddPurchaseRecord1(false))
    dispatch(getPOInfoApi());
    setRow('');
  };

  //CALLBACK FUNCTION
  const tableToSuppliers = (tableData) => {
    setRow(tableData)
  };

  const tableToPurchaseRec = (tableData) => {
    setRow(tableData)
  };

  //CRUD FOR SUPPLIER
  const onSupplierAdd = (data) => {
    data = {
      ...data,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id)
    };
    dispatch(reducers.postSupplierInfoApi(data));
    enqueueSnackbar("Supplier added", {
      variant: 'success'
    });
    handleClose();
  };

  const onSupplierEdit = (data) => {
    data = {
      ...data,
      id: currRow.id,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id)
    };
    dispatch(putSupplierInfoApi(data));
    handleClose();
    setRow('');
  };

  const onSupplierRestore = () => {
    let data = {
      id: currRow.id,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id)
    }
    dispatch(reducers.restoreSupplierInfoApi(data));
    enqueueSnackbar("Supplier restored", {
      variant: 'success'
    });
    handleRestoreClose();
    setRow('');
  };

  const onSupplierDelete = () => {
    let data = {
      id: currRow.id,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id)
    };

    dispatch(reducers.removeSupplierInfoApi(data));
    enqueueSnackbar("Supplier deleted", {
      variant: 'success'
    });
    handleDelete();
    setRow('');
  };

  // ADD, EDIT FOR PURCHASE RECORD
  const onPurchaseRecordAdd = (data) => {
    if (data.purchaseRec[0].supplier === "" && data.purchaseRec[0].stock === "") {
      data.purchaseRec.map((s) => {
        s.stock = purchaseRecNotifInfo.name;
        s.category = purchaseRecNotifInfo.category;
        s.supplier = purchaseRecNotifInfo.supplier;
        s.measure = purchaseRecNotifInfo.ceiling - purchaseRecNotifInfo.measure;
        s.measurementUnit = purchaseRecNotifInfo.measurementUnit;
        s.price = parseFloat(s.price);
      });
    } else {
      data.purchaseRec.map((s) => {
        s.supplier = supplierVal;
        s.measure = parseFloat(s.measure);
        s.price = parseFloat(s.price);
      });
    }

    data = {
      ...data,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id)
    };
    dispatch(postPurchaseInfoApi(data));

    enqueueSnackbar("Reorder success", {
      variant: "success"
    });
    handleClose();
  };

  const onPurchaseRecordEdit = (data) => {
    delete data.purchaseRec;
    delete data.searchExistSupplier;
    delete data.searchReorder;
    data = {
      ...data,
      userId: parseInt(JSON.parse(localStorage.getItem("userInfo")).id),
      id: currRow.id,
      receivedOrders: data.receivedOrders == null ? 0 : parseInt(data.receivedOrders)
    }

    // let receivedOrders = data.receivedOrders;
    // switch (receivedOrders) {
    //   case receivedOrders > currRow.measure: 
    //     enqueueSnackbar(`Ordered quantity is only ${currRow.measure} `, {
    //       variant: 'error'
    //     });
    //     break;
    //   case currRow.receivedOrders > data.receivedOrder:
    //     enqueueSnackbar("Cannot revert received orders", {
    //       variant: 'error'
    //     });
    //     break;
    //   case currRow.receivedOrders == data.receivedOrders:
    //     enqueueSnackbar("No Changes were made", {
    //       variant: 'warning'
    //     });
    //     break;
    //   default:
    //     // dispatch(putPurchaseInfoApi(data));
    //     handleClose();
    //     break;
    // }
    if (data.receivedOrders <= currRow.measure) {
      if (currRow.receivedOrders > data.receivedOrders) {
        enqueueSnackbar("Cannot revert received orders", {
          variant: 'error'
        });
      } else if (currRow.receivedOrders == data.receivedOrders) {
        enqueueSnackbar("No Changes were made", {
          variant: 'warning'
        });
      }
      else {
        dispatch(putPurchaseInfoApi(data));
        enqueueSnackbar("Updated Succesfully", {
          variant: 'success'
        });
        handleClose();
      }
    } else {
      enqueueSnackbar(`Ordered quantity is only ${currRow.measure} `, {
        variant: 'error'
      });
    }
  };

  //SEARCH
  const existSupplierText = watch("searchExistSupplier");
  const searchExistSupplier = (text) => {
    return tableInfo.existingSuppliers.info.filter(s => {
      if (s.name.toLowerCase().includes(text) || s.address.toLowerCase().includes(text) || s.dateAdded.toLowerCase().includes(text)) {
        return s
      };
    })
  };
  const existSupplierFilter = searchExistSupplier(existSupplierText);

  const removedSupplierText = watch("searchRemovedSupplier");
  const searchRemovedSupplier = (text) => {
    return tableInfo.removedSuppliers.info.filter(s => {
      if (s.name.toLowerCase().includes(text) || s.address.toLowerCase().includes(text)) {
        return s
      };
    })
  }
  const removedSupplierFilter = searchRemovedSupplier(removedSupplierText);

  const reorderText = watch("searchReorder");
  const searchReorder = (state, text) => {
    return state.purchaseRec.poInfo.filter(s => {
      if (s.stock.toLowerCase().includes(text) || s.uom.toLowerCase().includes(text) || s.category.toLowerCase().includes(text)) {
        return s
      };
    })
  };
  const reorderFilter = useSelector(state => searchReorder(state, reorderText));

  const { b } = useSelector(state => state.purchaseRec);
  useEffect(() => {
    dispatch(getStockInfoApi());
    dispatch(getPOInfoApi());
  }, [b]);

  return (
    <Grid container spacing={2}>
      <Grid item md={12} mt={2}>
        <Stack direction="row" spacing={1}>
          <Typography variant='h6' sx={styles.overviewText}>
            Suppliers
          </Typography>
          <Tooltip title="The suppliers page allows you to manage all supplier information and purchase order records. You can view, add, update, and archive items.">
            <Box sx={styles.overviewContent}>
              <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
            </Box>
          </Tooltip>
        </Stack>
      </Grid>

      {/* START OF SUPPLIERS TABLE */}
      <Grid item md={12}>
        <Grow in={true} timeout={800}>
          <Card>
            <Grid item md={12} sx={styles.actionBarWrapper}>
              <form>
                <Controller
                  name='searchExistSupplier'
                  control={control}
                  defaultValue=""
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
              <Stack ml={2} spacing={1} direction="row" sx={{ display: userInfo.role === "Inventory Clerk" ? "none" : null }}>
                {/* <Tooltip title="Add supplier"> */}
                  {/* <IconButton
                    onClick={handleAddSupplierOpen}
                    variant="contained"
                    size='small'
                    aria-label="Add supplier"
                  ><AddIcon />
                  </IconButton> */}
                {/* </Tooltip> */}
                <Box sx={ styles.center }>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={handleAddSupplierOpen} >
                    Add Supplier
                  </Button>
                </Box>

                {/* ADD SUPPLIER MODAL */}
                <Modal
                  open={openAddSupplier}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onSupplierAdd(data))}>
                    <Box sx={styles.modal}>
                      <Typography variant="h6">
                        Add Supplier
                      </Typography>
                      <Grid container spacing={2} mt={1}>
                        <Grid item md={6}>
                          <Controller
                            name='name'
                            control={control}
                            defaultValue=''
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Name"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.name)}
                                helperText={errors?.name?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='address'
                            control={control}
                            defaultValue=""
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Address"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.address)}
                                helperText={errors?.address?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='contactNumber'
                            control={control}
                            defaultValue=""
                            rules={{
                              pattern: validations.number,
                              minLength: validations.number.minLength,
                              maxLength: validations.number.maxLength
                            }}
                            render={({ field }) => (
                              <TextField
                                label="Contact Number"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.contactNumber)}
                                helperText={errors.contactNumber?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='email'
                            control={control}
                            defaultValue=""
                            rules={{ pattern: validations.email }}
                            render={({ field }) => (
                              <TextField
                                label="Email"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.email)}
                                helperText={errors?.email?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='contactPerson'
                            control={control}
                            defaultValue=''
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Contact Person"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.name)}
                                helperText={errors?.name?.message}
                                {...field}
                              />
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
                {/* End Add Supplier Modal*/}

                {/* <Tooltip title="Edit supplier"> */}
                  <Box sx={styles.overviewContent}>
                    {/* <IconButton
                      onClick={handleEditSupplierOpen}
                      variant="contained"
                      size='small'
                      disabled={currRow === '' || currRow.isRemoved === true || 'stock' in currRow}
                    ><EditRoundedIcon />
                    </IconButton> */}
                    <Button
                      variant='text'
                      size='small'
                      disabled={currRow === '' || currRow.isRemoved === true || 'stock' in currRow}
                      onClick={handleEditSupplierOpen} >
                      Edit Supplier
                    </Button>
                  </Box>
                {/* </Tooltip> */}

                {/* EDIT SUPPLIER MODAL */}
                <Modal
                  open={openEditSupplier}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onSupplierEdit(data))}>
                    <Box sx={styles.modal}>
                      <Typography id="modal-modal-title" variant="h6">
                        Edit Supplier - {currRow.name}
                      </Typography>
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
                                required
                                fullWidth
                                error={Boolean(errors?.name)}
                                helperText={errors?.name?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='address'
                            control={control}
                            defaultValue={currRow.address}
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Address"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.address)}
                                helperText={errors?.address?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='contactNumber'
                            control={control}
                            defaultValue={currRow.contactNumber}
                            rules={{
                              pattern: validations.number,
                              minLength: validations.number.minLength,
                              maxLength: validations.number.maxLength
                            }}
                            render={({ field }) => (
                              <TextField
                                label="Contact Number"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.contactNumber)}
                                helperText={errors.contactNumber?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='email'
                            control={control}
                            defaultValue=""
                            rules={{ pattern: validations.email }}
                            render={({ field }) => (
                              <TextField
                                label="Email"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.email)}
                                helperText={errors?.email?.message}
                                {...field}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='contactPerson'
                            control={control}
                            defaultValue=''
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Contact Person"
                                margin="dense"
                                size='small'
                                required
                                fullWidth
                                error={Boolean(errors?.name)}
                                helperText={errors?.name?.message}
                                {...field}
                              />
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
                {/* END EDIT SUPPLIER MODAL*/}

                {/* <Tooltip title="Delete supplier"> */}
                  <Box sx={styles.overviewContent}>
                    {/* <IconButton
                      onClick={handleDelete}
                      disabled={currRow === '' || currRow.isRemoved === true || 'stock' in currRow}
                      variant="contained"
                      size='small'
                      aria-label="Delete supplier"
                    ><DeleteRoundedIcon />
                    </IconButton> */}
                  <Button
                    size='small'
                    variant='delete'
                    onClick={handleDelete} 
                    disabled={currRow === '' || currRow.isRemoved === true || 'stock' in currRow} >
                    Delete Supplier
                  </Button>
                </Box>
                {/* </Tooltip> */}
              </Stack>

              {/* Restore User Dialog */}
              <BasicDialog
                openBasicDiag={deleteOpen}
                closeBasicDiag={handleDelete}
                dialogTitle={"Delete Supplier"}
                dialogContentText={"Are you sure you want to delete this supplier?"}
                declineBtnText={"Cancel"}
                confirmBtnText={"Delete"}
                declineOnClick={handleDelete}
                confirmOnClick={onSupplierDelete}
              />

            </Grid>

            {isMobile ?
              tableInfo.existingSuppliers.info.length != 0 ?
                <Grid item md={12}>
                  <Stack p={'1px 1em 1em 1em'}>
                    <BasicTable
                      maxHeight={440}
                      columns={mobileTableInfo.renderMobileSupplierCol}
                      rows={existSupplierFilter}
                      tableToModule={tableToSuppliers} />
                  </Stack>
                </Grid>
                : null
              :
              tableInfo.existingSuppliers.info.length != 0 ?
                <Grid item md={12}>
                  <Stack p={'1px 1em 1em 1em'}>
                    <BasicTable
                      maxHeight={440}
                      columns={tableInfo.existingSuppliers.columns()}
                      rows={existSupplierFilter}
                      tableToModule={tableToSuppliers} />
                  </Stack>
                </Grid>
                : null
            }

            {tableInfo.removedSuppliers.info.length != 0 ?
              <Grid item md={12} sx={{ display: userInfo.role === "Inventory Clerk" ? "none" : null }}>
                <Stack >
                  <Grid item md={12} sx={styles.actionBarWrapper}>
                    <Box sx={{
                      display: "flex",
                      flexGrow: 2
                    }}>
                      <Typography
                        mt={2}
                        sx={styles.overviewText}
                        variant='title'
                      >Supplier Archive
                      </Typography>
                    </Box>

                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <form>
                        <Controller
                          name='searchRemovedSupplier'
                          control={control}
                          defaultValue=""
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
                        onClick={handleRestoreOpen}>Restore Supplier</Button>
                    </Stack>
                  </Grid>
                  <Box m={2}>
                    {isMobile ?
                      <BasicTable
                        maxHeight={440}
                        columns={mobileTableInfo.renderMobileSupplierCol}
                        rows={removedSupplierFilter}
                        tableToModule={tableToSuppliers} />
                      :
                      <BasicTable
                        maxHeight={440}
                        columns={tableInfo.removedSuppliers.columns()}
                        rows={removedSupplierFilter}
                        tableToModule={tableToSuppliers} />
                    }
                  </Box>
                </Stack>
              </Grid>
              : null}

            {/* Restore User Dialog */}
            <BasicDialog
              openBasicDiag={restoreOpen}
              closeBasicDiag={handleRestoreClose}
              dialogTitle={"Restore Supplier"}
              dialogContentText={"Are you sure you want to restore this supplier?"}
              declineBtnText={"Cancel"}
              confirmBtnText={"Restore"}
              declineOnClick={handleRestoreClose}
              confirmOnClick={onSupplierRestore}
            />

          </Card>
        </Grow>
      </Grid>
      {/* END OF SUPPLIER TABLE */}

      {/* START OF PURCHASE RECORDS TABLE */}
      <Grid item md={12}>
        <Grow in={true} timeout={1000}>
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
                >Purchase Order
                </Typography>
              </Box>

              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <form>
                  <Controller
                    name='searchReorder'
                    control={control}
                    defaultValue=""
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
                {/* <Tooltip title="Add purchase record">
                  <IconButton
                    onClick={handlePurchaseRecordOpen}
                    variant="contained"
                    size='small'
                  ><PostAddIcon />
                  </IconButton>
                </Tooltip> */}
                <Box sx={ styles.center }>
                  <Button
                    variant='contained'
                    size='small'
                    onClick={handlePurchaseRecordOpen} >
                    Add Purchase Record
                  </Button>
                </Box>
                

                {/* ADD PURCHASE MODAL NOTIF */}
                {purchaseRecNotifInfo ?
                  <Modal
                    open={openAddPurchaseRecord1}
                    onClose={handleClose}
                  >
                    <form onSubmit={handleSubmit(data => onPurchaseRecordAdd(data))}>
                      <Box sx={styles.modal}>
                        <Typography variant="h6">
                          Add Purchase Order 1
                        </Typography>

                        <Box sx={styles.formContainer}>
                          <>
                            {fields.map(({ id, supplier }, index) => {
                              return (
                                <Grid key={id} container spacing={2} mt={1}>
                                  {fields.length !== 1 &&
                                    <Grid item md={12} >
                                      <Typography variant="caption" fontWeight={700}>
                                        Item {index + 1}
                                      </Typography>
                                    </Grid>
                                  }
                                  <Grid item md={6}>
                                    <Controller
                                      name={`purchaseRec[0].supplier`}
                                      control={control}
                                      defaultValue={purchaseRecNotifInfo.supplier}
                                      render={({ field }) => (
                                        <TextField
                                          label="Supplier"
                                          margin="dense"
                                          size='small'
                                          defaultValue={purchaseRecNotifInfo.supplier}
                                          disabled
                                          fullWidth
                                          required />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item md={6}>
                                    <Controller
                                      name={`purchaseRec[${index}].stock`}
                                      control={control}
                                      defaultValue={purchaseRecNotifInfo.name}
                                      render={({ field }) => (
                                        <TextField
                                          label="Stock"
                                          margin="dense"
                                          size='small'
                                          defaultValue={purchaseRecNotifInfo.name}
                                          disabled
                                          required
                                          fullWidth
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item md={6}>
                                    <Controller
                                      name={`purchaseRec[${index}].category`}
                                      control={control}
                                      defaultValue={purchaseRecNotifInfo.category}
                                      render={({ field }) => (
                                        <TextField
                                          label="Category"
                                          margin="dense"
                                          size='small'
                                          defaultValue={purchaseRecNotifInfo.category}
                                          required
                                          disabled
                                          fullWidth
                                        />
                                      )}
                                    />
                                  </Grid>

                                  <Grid item container direction="row" md={6}>
                                    <Grid item md={7}>
                                      <Controller
                                        name={`purchaseRec[${index}].measure`}
                                        control={control}
                                        defaultValue=""
                                        render={({ field }) => (
                                          <TextField
                                            label="Measure"
                                            type="number"
                                            margin="dense"
                                            size='small'
                                            defaultValue={purchaseRecNotifInfo.ceiling - purchaseRecNotifInfo.measure}
                                            disabled
                                            fullWidth
                                            required
                                            InputProps={{
                                              inputProps: { min: 1 },
                                            }} />
                                        )}
                                      />
                                    </Grid>
                                    <Grid item md={5}>
                                      <Controller
                                        name={`purchaseRec[${index}].measurementUnit`}
                                        control={control}
                                        defaultValue=''
                                        render={({ field }) => (
                                          <Box ml={2}>
                                            <TextField
                                              label="Unit"
                                              margin="dense"
                                              size='small'
                                              defaultValue={purchaseRecNotifInfo.measurementUnit}
                                              fullWidth
                                              disabled
                                              required />
                                          </Box>
                                        )}
                                      />
                                    </Grid>
                                  </Grid>

                                  <Grid item md={6}>
                                    <Controller
                                      name={`purchaseRec[${index}].price`}
                                      control={control}
                                      defaultValue=""
                                      render={({ field }) => (
                                        <TextField
                                          label="Unit Cost"
                                          type="number"
                                          margin="dense"
                                          required
                                          InputProps={{
                                            inputProps: { min: 1, step: "any" },
                                            startAdornment: (
                                              <InputAdornment position="start">
                                                Php
                                              </InputAdornment>
                                            ),
                                          }}
                                          size='small'
                                          fullWidth
                                          {...field}
                                        />
                                      )}
                                    />
                                  </Grid>
                                </Grid>
                              )
                            })}
                          </>

                        </Box>

                        <Grid container mt={2}>
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
                      </Box>
                    </form>
                  </Modal>
                  : null}
                {/* END NOTIF PURCHASE MODAL */}

                {/* ADD PURCHASE MODAL */}
                <Modal
                  open={openAddPurchaseRecord}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onPurchaseRecordAdd(data))}>
                    <Box sx={styles.modal}>
                      <Typography variant="h6">
                        Add Purchase Order
                      </Typography>

                      <Box sx={styles.formContainer}>
                        <>
                          {fields.map(({ id, supplier }, index) => {
                            let stock = stockInfo.find(s => s.name === watch(`purchaseRec[${index}].stock`));
                            // console.log(stock === undefined)
                            // if (stock !== undefined || stock !== null) {
                            //   // () => null;
                            //     setValue(`purchaseRec[${index}].category`, stock.category);
                            //     setValue(`purchaseRec[${index}].measurementUnit`, stock.measurementUnit);
                            // } 
                            // else {
                            //     setValue(`purchaseRec[${index}].category`, stock.category);
                            //     setValue(`purchaseRec[${index}].measurementUnit`, stock.measurementUnit);
                            // }
                            
                              // stock == undefined || stock == null ? null :
                              //   setValue(`purchaseRec[${index}].category`, stock.category) &&
                              //   setValue(`purchaseRec[${index}].measurementUnit`, stock.measurementUnit)
                            if (stock != null || stock != undefined) {
                                setValue(`purchaseRec[${index}].category`, stock.category);
                                setValue(`purchaseRec[${index}].measurementUnit`, stock.UOM);
                            }

                            return (
                              <Grid key={id} container spacing={2} mt={1}>
                                {fields.length !== 1 &&
                                  <Grid item md={12} >
                                    <Typography variant="caption" fontWeight={700}>
                                      Item {index + 1}
                                    </Typography>
                                  </Grid>
                                }
                                <Grid item md={6}>
                                  <Controller
                                    name={`purchaseRec[0].supplier`}
                                    control={control}
                                    defaultValue={supplier}
                                    render={({ field }) => (
                                      <TextField
                                        label="Supplier"
                                        margin="dense"
                                        size='small'
                                        fullWidth
                                        required
                                        select
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
                                    name={`purchaseRec[${index}].stock`}
                                    control={control}
                                    defaultValue=''
                                    render={({ field }) => (
                                      <TextField
                                        label="Stock"
                                        margin="dense"
                                        size='small'
                                        disabled={supplierVal === ""}
                                        select
                                        required
                                        fullWidth
                                        {...field}
                                      >
                                        {stockInfo.map((stock, index) => (
                                          supplierVal === stock.supplier &&
                                          <MenuItem key={index} value={stock.name}>{stock.name}</MenuItem>
                                        ))}

                                      </TextField>
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  <Controller
                                    name={`purchaseRec[${index}].category`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        label="Category"
                                        margin="dense"
                                        size='small'
                                        required
                                        disabled
                                        fullWidth
                                        {...field}
                                      />
                                    )}
                                  />
                                </Grid>

                                <Grid item container direction="row" md={6}>
                                  <Grid item md={7}>
                                    <Controller
                                      name={`purchaseRec[${index}].measure`}
                                      control={control}
                                      defaultValue=""
                                      render={({ field }) => (
                                        <TextField
                                          label="Measure"
                                          type="number"
                                          margin="dense"
                                          size='small'
                                          fullWidth
                                          required
                                          InputProps={{
                                            inputProps: { min: 1 },
                                          }}
                                          {...field}
                                        />
                                      )}
                                    />
                                  </Grid>
                                  <Grid item md={5}>
                                    <Controller
                                      name={`purchaseRec[${index}].measurementUnit`}
                                      control={control}
                                      defaultValue=''
                                      render={({ field }) => (
                                        <Box ml={2}>
                                          <TextField
                                            label="Unit"
                                            margin="dense"
                                            size='small'
                                            fullWidth
                                            disabled
                                            required
                                            {...field}
                                          />
                                        </Box>
                                      )}
                                    />
                                  </Grid>
                                </Grid>

                                <Grid item md={6}>
                                  <Controller
                                    name={`purchaseRec[${index}].price`}
                                    control={control}
                                    defaultValue=""
                                    render={({ field }) => (
                                      <TextField
                                        label="Unit Cost"
                                        type="number"
                                        margin="dense"
                                        required
                                        InputProps={{
                                          inputProps: { min: 1, step: "any" },
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              Php
                                            </InputAdornment>
                                          ),
                                        }}
                                        size='small'
                                        fullWidth
                                        {...field}
                                      />
                                    )}
                                  />
                                </Grid>
                                <Grid item md={6}>
                                  {/* ADD */}
                                  {fields.length - 1 === index &&
                                    <Tooltip title="Add another item">
                                      <IconButton onClick={() => append({
                                        supplier: getValues(`purchaseRec[0].supplier`)
                                      })}>
                                        <AddIcon />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                  {/* REMOVE */}
                                  {fields.length !== 1 &&
                                    <Tooltip title="Remove item">
                                      <IconButton onClick={() => remove(index)}>
                                        <DeleteRoundedIcon />
                                      </IconButton>
                                    </Tooltip>
                                  }
                                </Grid>
                              </Grid>
                            )
                          })}
                        </>

                      </Box>

                      <Grid container mt={2}>
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
                    </Box>
                  </form>
                </Modal>
                {/* END PURCHASE MODAL */}

                {/* Edit Purchase Record */}
                {/* <Tooltip title="Edit purchase record"> */}
                  <Box sx={styles.center}>
                    {/* <IconButton
                      onClick={handleEditPoOpen}
                      variant="contained"
                      disabled={currRow === '' || 'address' in currRow}
                      size='small'
                    ><EditRoundedIcon />
                    </IconButton> */}
                    <Button
                      sx={{size: 'small'}}
                      variant='text'
                      disabled={currRow === '' || 'address' in currRow}
                      size='small'
                      onClick={handleEditPoOpen} >
                      Edit Purchase Record
                    </Button>
                  </Box>
                {/* </Tooltip> */}
                <Modal
                  open={openEditPO}
                  onClose={handleClose}
                >
                  <form onSubmit={handleSubmit(data => onPurchaseRecordEdit(data))}>
                    <Box sx={styles.modal}>
                      <Typography variant="h6" sx={styles.overviewText}>
                        Update Purchase Record
                      </Typography>
                      <Stack mt={2}>
                        <Typography variant="h6">
                          {currRow.stock} {`(${currRow.category})`}
                        </Typography>
                        <Typography variant="subtitle1">
                          Supplier: {currRow.supplier}
                        </Typography>
                      </Stack>

                      <Grid container spacing={2} mt={1}>
                        <Grid item md={6}>
                          <Controller
                            name='status'
                            control={control}
                            defaultValue=""
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Status"
                                margin="dense"
                                size='small'
                                defaultValue="Not Received"
                                disabled
                                required
                                fullWidth
                                error={Boolean(errors?.name)}
                                helperText={errors?.name?.message}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item md={6}>
                          <Controller
                            name='receivedOrders'
                            control={control}
                            defaultValue={currRow.receivedOrders}
                            rules={{ pattern: validations.name }}
                            render={({ field }) => (
                              <TextField
                                label="Received Orders"
                                margin="dense"
                                size='small'
                                type='number'
                                InputProps={
                                  { inputProps: { min: 1 } }
                                }
                                required
                                fullWidth
                                helperText={'Quantity of received orders'}
                                {...field}
                              />
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

              </Stack>
            </Grid>
            <Grid item md={12}>
              <Stack p={'1px 1em 1em 1em'}>
                {isMobile ?
                  <BasicTable
                    maxHeight={440}
                    columns={mobileTableInfo.renderMobileReorderCol}
                    rows={reorderFilter}
                    tableToModule={tableToPurchaseRec} />
                  :
                  <BasicTable
                    maxHeight={440}
                    // maxWidth={20}
                    columns={tableInfo.poInfo.columns()}
                    rows={reorderFilter}
                    tableToModule={tableToPurchaseRec} />
                }
              </Stack>
            </Grid>
          </Card>
        </Grow>
      </Grid>
      {/* END OF PURCHASE RECORDS TABLE */}
    </Grid >
  );
};

export default Suppliers;