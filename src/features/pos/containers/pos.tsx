import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import POS from '../components/pos';
import { getAllMenuPricesApi, getAllMenusInfoApi } from '../slice';
import { getStockInfoApi } from '../../inventory/slice';

const POSContainer = () => {
  const dispatch = useDispatch();
  const { menuInfo, addOnInfo, sizeInfo, priceInfo, printStatus, fetchStatus } = useSelector((state) => state.posReducer);
  const { stockInfo } = useSelector((state) => state.inventory);

  const sliceStates = {
    menuInfo: menuInfo,
    addOnInfo: addOnInfo,
    sizeInfo: sizeInfo,
    priceInfo: priceInfo,
    userInfo: JSON.parse(localStorage.getItem("userInfo")),
    stockInfo: stockInfo,
    printStatus: printStatus
  };

  useEffect(() => {
    dispatch(getAllMenusInfoApi());
    dispatch(getStockInfoApi());
    dispatch(getAllMenuPricesApi());
  },[fetchStatus]);

  return (
    <POS dispatch={dispatch} sliceStates={sliceStates} />
  );
};

export default POSContainer;