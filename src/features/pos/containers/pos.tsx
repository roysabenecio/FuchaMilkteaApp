import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import POS from '../components/pos';
import { getAllMenuPricesApi, getAllMenusInfoApi } from '../slice';
import { getStockInfoApi } from '../../inventory/slice';
import { useAppSelector } from '../../../app/hooks';
import { useGetAllAddOnsQuery, useGetAllMenusQuery, useGetAllSizesQuery, useGetMenuPricesQuery } from '../apiSlice';
import { useSalesTransacInfoQuery } from '../../../app/centralApiSlice';
import CircularProgress from '@mui/material/CircularProgress';
import { useGetStockInfoQuery } from '../../inventory/apiSlice';

const POSContainer = () => {
  const dispatch = useDispatch();
  const { printStatus, fetchStatus } = useSelector((state) => state.posReducer);
  // const { stockInfo } = useSelector((state) => state.inventory);

  const { userInfo } = useAppSelector(state => state.login);

  const {data: menuInfo, isSuccess: menuReceived} = useGetAllMenusQuery("");
  const {data: addOnInfo, isSuccess: addOnsReceived} = useGetAllAddOnsQuery("");
  const {data: sizeInfo, isSuccess: sizesReceived} = useGetAllSizesQuery("");
  const {data: priceInfo, isSuccess: pricesReceived} = useGetMenuPricesQuery("");
  const {data: stockInfo, isSuccess: stockInfoReceived} = useGetStockInfoQuery("");
  // const {data} = useSalesTransacInfoQuery("");

  // console.log(data)

  const sliceStates = {
    // menuInfo: menuInfo,
    menuInfo: menuInfo,
    addOnInfo: addOnInfo,
    sizeInfo: sizeInfo,
    priceInfo: priceInfo,
    userInfo: userInfo,
    stockInfo: stockInfo,
    printStatus: printStatus
  };

  // useEffect(() => {
  //   dispatch(getAllMenusInfoApi());
  //   dispatch(getStockInfoApi());
  //   dispatch(getAllMenuPricesApi());
  // },[fetchStatus]);

  if (menuReceived !== true || addOnsReceived !== true || sizesReceived !== true || pricesReceived !== true ) {
    return (<div><CircularProgress /></div>);
  }

  // useEffect(() =>{
  //   if (menuReceived !== true || addOnsReceived !== true || sizesReceived !== true ) {
  //     return <div>HEY</div>;
  //   }
  //   console.log(menuReceived)
  //   console.log(addOnsReceived)
  //   console.log(sizesReceived)
  // },[menuReceived, addOnsReceived, sizesReceived]);



  return (
    <POS dispatch={dispatch} sliceStates={sliceStates} menuInfo={menuInfo} addOnInfo={addOnInfo} sizeInfo={sizeInfo} />
  );
};

export default POSContainer;