import { default as styles } from './styles';
//icons
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import BasicDialog from '../../../shared-components/basic-dialog/basic-dialog';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {
  Grid,
  Typography,
  Box,
  Card,
  Button,
  IconButton,
  Grow,
  Stack,
  Container,
  Tooltip,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { postBillApi, makePrint, clearBillInfo, clearPrintStatus } from '../slice';
import { milkTeaSizes, milkTeaSize } from '../constants';
import { getOrdersInfoApi } from '../../sales-report/slice';
import { getStockInfoApi } from '../../inventory/slice';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useForm } from "react-hook-form";
import { useAppSelector } from '../../../app/hooks';
import { usePostBillMutation } from '../apiSlice';

const Bill = ({
  dispatch,
  orders, setOrders,
  totalPrice, setTotalPrice,
  validations,
  addToBill,
  deductToBill,
  sliceStates,
}) => {

  const { billInfo } = useSelector(state => state.posReducer);

  const { enqueueSnackbar } = useSnackbar();
  const { register, unregister, setValue, watch } = useForm();

  const [quantityValue, setQuantityValue] = useState(0);
  const [confirmOrder, setConfirmOrder] = useState(false);

  const deleteOrder = (menuItem, menuCategoryId, addOn, size, index) => {
    for (let i = 0; i <= orders.length; i++) {
      if (index == i) unregister('qty' + index);
      // if (index == i) setValue('qty' + index, 1);
    }

    if (validations.isMilkTea(menuCategoryId)) {
      const orderExists = orders.find(order =>
        order.id === menuItem.id &&
        order.sizeId === size &&
        order.menuCategoryId === menuCategoryId &&
        order.addOn === addOn);
      setTotalPrice(totalPrice - orderExists.price - orderExists.addOnPrice);
      setOrders(orders.filter(order => order !== orderExists));
    } else {
      const orderExists = orders.find(order =>
        order.id === menuItem.id &&
        order.menuCategoryId === menuCategoryId);
      setTotalPrice(totalPrice - orderExists.price);
      setOrders(orders.filter(order => order !== orderExists));
    }
  };

  // CONFIRM ORDER DIALOG STATE AND FUNC
  const [openDialog, setOpenDialog] = useState(false);
  const handleBillDialog = () => {
    let insufficientStock = [];
    let data = { orders: [...orders] };

    data.orders.map(o => {
      // Check if Pizza
      if (o.menuCategoryId == 4 || o.menuCategoryId == 5) {
        // Check if stock's measure is enough
        let stock = sliceStates.stockInfo.find(s => o.name == s.name);

        if (stock.measure < o.quantity) {
          insufficientStock.push(stock);
        }
      }
    });
    if (insufficientStock.length == 0) {
      setOpenDialog(!openDialog);
    }
    if (insufficientStock.length != 0) {
      insufficientStock.map(s => {
        enqueueSnackbar(`${s.name} has ${s.measure} stock/s left`, {
          variant: 'error'
        });
      });
    }
  };
  //DIALOG CONTENT
  const orderSummary = (orders) => {
    return (
      <>
        {orders.map((order, index) => (
          <Grid key={index} container spacing={2}>
            <Grid item md={2}>
              <Typography textAlign={"left"}>
                {`${order.quantity}`}
              </Typography>
            </Grid>
            <Grid item md={7}>
              <Typography textAlign={"left"}>
                {order.name}
              </Typography>
              {/* SIZE & ADD ON IF MILKTEA */}
              {validations.isMilkTea(order.menuCategoryId) ?
                milkTeaSize.map((s, index) => (
                  order.sizeId === s.id ?
                    <Typography key={index} fontStyle={"italic"} variant="caption">
                      {`${s.label}, ${order.addOn}`}
                    </Typography> : null
                ))
                : null
              }
            </Grid>
            <Grid item md>
              <Typography textAlign={"right"}>
                {`₱${order.price}`}
              </Typography>
            </Grid>
          </Grid>
        ))}
        <Grid container mt={2}>
          <Grid item md>
            <Typography fontWeight={700}>
              Total
            </Typography>
          </Grid>
          <Grid item md>
            <Typography fontWeight={700} textAlign={"right"}>
              {`Php ${totalPrice}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container >
          <Grid item md>
            <Typography variant='subtitle2' >
              Cash
            </Typography>
          </Grid>
          <Grid item md>
            <Typography variant='subtitle2' textAlign={"right"}>
              {`Php ${cash}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid container >
          <Grid item md>
            <Typography variant='subtitle2' >
              Change
            </Typography>
          </Grid>
          <Grid item md>
            <Typography variant='subtitle2' textAlign={"right"}>
              {`Php ${cashChange()}`}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  };

  //PRINT RECEIPT
  useEffect(() => {
    if (sliceStates.printStatus == 1) {
      const receiptData = billInfo.map((order) => (
        [
          order.name,
          order.size,
          order.category,
          order.quantity,
          order.addOn,
          order.addOnPrice,
          order.price,
        ]
      ));
      const saleID = billInfo.map(order => order.saleId);
      const receiptToPdf = () => {
        const pdf = new jsPDF();
        const filenameDate = moment().format('MMDDYYYY')
        const dateTime = moment().format('MM/DD/YYYY h:mm a')
        //BUSINESS NAME
        pdf.setFont('courier', 'bold')
        pdf.setFontSize(14);
        pdf.text(105, 20, "FU-CHA FORTUNE MILKTEA HOUSE", null, null, 'center');
        //BUSINESS ADDRESS
        pdf.setFont(undefined, 'normal')
        pdf.setFontSize(10);
        pdf.text(105, 27, "M. Santos, San Roque, Antipolo City", null, null, 'center');
        //PHONE NUM
        pdf.setFontSize(10);
        pdf.text(105, 34, "+7092-1703", null, null, 'center');
        //RECEIPT TITLE
        pdf.setFont("courier");
        pdf.setFontSize(17);
        pdf.text(105, 45, `OFFICAL RECEIPT`, null, null, 'center');
        //REF NUMBER 
        pdf.setFont("courier");
        pdf.setFontSize(12);
        pdf.text(105, 50, `Reference No.: ${saleID[0]}`, null, null, 'center');
        //TIME
        pdf.setFontSize(12);
        pdf.text(105, 55, dateTime, null, null, 'center');
        //ORDERS 
        autoTable(pdf, {
          head: [["Item", "Size", "Category", "Quantity", "Add On", "Add On Price", "Price"]],
          body: receiptData,
          startY: 70,
          theme: "plain",
          styles: { font: "courier" }
        })
        //TOTAL PRICE
        pdf.setFont('courier', 'bold')
        pdf.setFontSize(15);
        pdf.text(`Total: P${totalPrice}`, 160, pdf.lastAutoTable.finalY + 10, null, null, 'left');
        pdf.setFont('courier', 'normal')
        pdf.setFontSize(12);
        pdf.text(`Cash: P${cash}`, 160, pdf.lastAutoTable.finalY + 15, null, null, 'left');
        pdf.text(`Change: P${cashChange()}`, 160, pdf.lastAutoTable.finalY + 20, null, null, 'left');
        pdf.save(`Receipt${saleID[0]}_${filenameDate}.pdf`);
      }
      receiptToPdf();
      dispatch(clearPrintStatus());
      dispatch(clearBillInfo());
      if (orders.length === 0) {
        setTotalPrice(0);
        setValue('cash', "");
      };
    }
  }, [billInfo]);

  const {userInfo} = useAppSelector(state => state.login);

  const [postBill] = usePostBillMutation();

  const printBill = () => {
    // const userData = JSON.parse(localStorage.getItem('userInfo'));
    const userData = userInfo;
    console.log(userData);
    let data = { orders: [...orders], userId: userData.id };
    // dispatch(postBillApi(data));
    postBill(data)
    handleBillDialog();
    enqueueSnackbar("Order placed successfully", {
      variant: 'success'
    });
    // dispatch(getOrdersInfoApi());
    // dispatch(getStockInfoApi());
    // dispatch(makePrint());
    setOrders([]);
  };

  //CASH TENDERED
  const cash = watch("cash");
  const cashChange = () => {
    let change = cash - totalPrice;
    if (change > 0) return change.toFixed(2);
    else if (change === 0) return 0;
    else return "Invalid"
  };

  const handleMoney = (e) => {
    let money = e.target.value;
    let intMoney = parseInt(money);
    let cents = parseFloat((((money * 100) - intMoney * 100) / 100)).toFixed(2);

    if ((cents * 100) % 5 === 0) {
      setConfirmOrder(true);
    }
    else if (cents == 0.55) {
      setConfirmOrder(true);
    }
    else {
      setConfirmOrder(false);
    }
  };

  //QTY
  useEffect(() => {
    for (let i = 0; i <= orders.length; i++) {
      let qty = parseInt(watch(`qty${i}`));

      if (orders[i]) {
        
        if (validations.isMilkTea(orders[i].menuCategoryId)) {
          let basePrice = orders[i].price / orders[i].quantity;
          let priceBefore = orders[i].price;
          let addOnBasePrice = orders[i].addOnPrice / orders[i].quantity;
          let addOnPriceBefore = orders[i].addOnPrice;

          orders[i].quantity = qty;
          orders[i].price = orders[i].quantity * basePrice;
          orders[i].addOnPrice = orders[i].quantity * addOnBasePrice;

          setTotalPrice(totalPrice + orders[i].price + orders[i].addOnPrice - priceBefore - addOnPriceBefore);

        } else {
          let basePrice = orders[i].price / orders[i].quantity;
          let priceBefore = orders[i].price;

          orders[i].quantity = qty;
          orders[i].price = orders[i].quantity * basePrice;

          setTotalPrice(totalPrice + orders[i].price - priceBefore);
        }

        
      }

      // if(qty < 0) {
      //   unregister('qty' + i);
      // }
    }
  }, [quantityValue]);

  const handleQuantityChange = (e) => {
    setQuantityValue(e.target.value);
  };

  return (
    <Grid item container md={4} mt={2}>
      <Grid item md={12} maxHeight={650} overflow={'auto'} >
        <Card>
          <Grid item md={12}>
            <Typography
              ml={2}
              mt={2}
              variant='subtitle1'
              sx={styles.overviewText}>
              Bill
            </Typography>
          </Grid>

          {!orders || orders.length === 0 ?
            <Container>
              <Typography m={5} color={'rgb(128, 128, 128)'} textAlign={'center'}>
                No orders yet
              </Typography>
            </Container> :
            orders.map((order, index) => (
              // There could be different bills with same item
              // so the key should not be the bill's ID
              order.quantity <= 0 ? deleteOrder(order, order.menuCategoryId, order.addOn, order.sizeId) :
                <Grow key={index} in={true} timeout={500}>
                  <Grid item md={12} key={index}>
                    <Box display={'flex'} m={2}>
                      <Box m={1} sx={styles.iconWrapper}>
                        <FastfoodRoundedIcon />
                      </Box>
                      <Box m={1} flexGrow={2}>
                        {/* Name */}
                        <Typography sx={styles.overviewText} variant="subtitle1">
                          {order.name}
                        </Typography>
                        {/* Menu Category */}
                        <Typography variant="subtitle2">
                          {order.menuCategory}
                        </Typography>
                        {/* Add On */}
                        {validations.isMilkTea(order.menuCategoryId) ?
                          <Typography variant="subtitle2">
                            {`${order.addOn} / Php ${order.addOnPrice}`}
                          </Typography> : null}
                        {/* Size */}
                        {validations.isMilkTea(order.menuCategoryId) ?
                          milkTeaSizes.map((s, index) => (
                            order.sizeId === s.id ?
                              < Typography key={index} variant="subtitle2">
                                {`${s.value}`}
                              </Typography> : null
                          )) : null
                        }
                      </Box>
                      <Box sx={styles.billPrice}>
                        {/* Quantity */}
                        <Stack direction="row" spacing={1}>
                          <button
                            style={styles.qtyButton}
                            onClick={() => deductToBill(order, order.menuCategoryId, order.addOn, order.sizeId)}>
                            -
                          </button>
                          <Typography variant="subtitle2">
                            {`${order.quantity}`}
                          </Typography>
                          <button
                            style={styles.qtyButton}
                            onClick={() => addToBill(order, order.menuCategoryId, order.addOn, order.sizeId, 0)}>
                            +
                          </button>
                          <input
                            onBlurCapture={handleQuantityChange}
                            style={{ width: 50 }}
                            type='number'
                            min={1}
                            defaultValue={order.quantity || order.quantity < 0 ? order.quantity : 1}
                            required
                            {...register('qty' + index)}
                          />
                          {/* <TextField 
                            type="number" 
                            InputProps={
                              {inputProps: { min: 1}}}
                            /> */}
                        </Stack>

                        {/* Delete Order */}
                        <Box>
                          <IconButton onClick={() => deleteOrder(order, order.menuCategoryId, order.addOn, order.sizeId, index)}>
                            <DeleteRoundedIcon />
                          </IconButton>
                        </Box>

                        {/* Price */}
                        <Typography sx={styles.overviewText} variant='subtitle1'>
                          {`Php ${order.price}`}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grow>
            ))
          }

          {/* Total Price */}
          {totalPrice === null || totalPrice === 0 ? null :
            <Grid item md={12} m={2}>
              <Grid item container md={12}>
                {/* Total Price */}
                <Grid item md={6}>
                  <Typography variant="h6" fontWeight={700} textAlign={'left'}>
                    Total
                  </Typography>
                </Grid>
                <Grid item md={6} >
                  <Typography variant="h6" fontWeight={700} textAlign={'right'}>
                    {orders.length === 0 ? `Php ${0}` : `Php ${totalPrice}`}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container md={12} >
                <Stack direction="row" spacing={1} >
                  <Typography variant="subtitle1" textAlign={'left'}>
                    Cash
                  </Typography>
                  <Tooltip title="The money should be divisible by 5 cents">
                    <Box sx={styles.overviewContent}>
                      <InfoRoundedIcon sx={{ fontSize: 15, color: "gray" }} />
                    </Box>
                  </Tooltip>
                </Stack>
                <Grid item md={6} style={styles.changeField}>
                  {orders.length === 0 ?
                    <Typography variant="subtitle1" textAlign={'right'}>
                      {orders.length === 0 ? `Php ${0}` : `Php ${totalPrice}`}
                    </Typography> :
                    <form>
                      <input type="number" min={0} style={{ width: 90 }} step={0.05} defaultValue="" onChangeCapture={handleMoney} {...register("cash", { required: true })} />
                    </form>
                  }

                </Grid>
              </Grid>
              <Grid item container md={12}>
                {/* Total Price */}
                <Grid item md={6}>
                  <Typography variant="subtitle1" textAlign={'left'}>
                    Change
                  </Typography>
                </Grid>
                <Grid item md={6} >
                  <Typography variant="subtitle1" textAlign={'right'}>
                    {orders.length === 0 || cash === undefined || cash === "" || cash === 0 ? `Php ${0}` : `Php ${cashChange()}`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid item md={12} mt={1}>
                <Button
                  disabled={orders.length === 0 || cash === "" || cash === undefined || cash < totalPrice || confirmOrder === false || totalPrice < 0}
                  fullWidth
                  variant='contained'
                  onClick={handleBillDialog} >
                  Confirm order
                </Button>
              </Grid>
            </Grid>
          }
        </Card>
      </Grid>

      {/* CONFIRM ORDER VALIDATION */}
      <BasicDialog
        dialogTitle={"Order Summary"}
        dialogContentText={orderSummary(orders)}
        openBasicDiag={openDialog}
        closeBasicDiag={handleBillDialog}
        confirmBtnText={"Print Bill"}
        declineBtnText={"Cancel"}
        confirmOnClick={printBill}
        declineOnClick={handleBillDialog}
      />
    </Grid >
  );
};

export default Bill;