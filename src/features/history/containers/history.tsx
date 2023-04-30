import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import History from '../components/history';
import { getActivityHistoryApi, getLoginHistoryApi, getSaleTransactionApi } from '../slice';
import { useGetActivityHistoryQuery, useGetLoginActivitiesQuery } from '../apiSlice';
import { CircularProgress } from '@mui/material';

const HistoryContainer = () => {
  const dispatch = useDispatch();
  // const { loginHistoryInfo, activityHistoryInfo, saleTransactionInfo } = useSelector((state) => state.history);
  const { saleTransactionInfo } = useSelector((state) => state.history);

  const { data: loginHistoryInfo } = useGetLoginActivitiesQuery("");
  const { data: activityHistoryInfo} = useGetActivityHistoryQuery("");

  if (loginHistoryInfo == undefined || activityHistoryInfo == undefined) {
    return <div><CircularProgress /></div>
  } else {
    let renderLoginHistoryColumns;
    if (loginHistoryInfo.length != 0) {
      const loginHistoryColumns = Object.keys(loginHistoryInfo[0]).filter(x => x != "id");
      renderLoginHistoryColumns = () => {
        const newObj = loginHistoryColumns.map((column) => ({
          id: column,
          label: column.toUpperCase()
        }));
        return newObj;
      };
    };

    let renderActivityHistoryColumns;
    if (activityHistoryInfo.length != 0) {
      const activityHistoryColumns = Object.keys(activityHistoryInfo[0]).filter(x => x != "id");
      renderActivityHistoryColumns = () => {
        const newObj = activityHistoryColumns.map((column) => ({
          id: column,
          label: column.toUpperCase()
        }));
        return newObj;
      };
    };
    let renderSaleTransactionColumns;
    if (saleTransactionInfo.length != 0) {
      const saleTransactionColumns = Object.keys(saleTransactionInfo[0]);
      renderSaleTransactionColumns = () => {
        const newObj = saleTransactionColumns.map((column) => ({
          id: column,
          label: column.toUpperCase()
        }));
        return newObj;
      };
    };
    const tableInfo = {
      loginHistory: {
        rows: loginHistoryInfo ? Object.values(loginHistoryInfo) : null,
        columns: renderLoginHistoryColumns ? () => renderLoginHistoryColumns() : () => []
      },
      activityHistory: {
        rows: activityHistoryInfo ? Object.values(activityHistoryInfo) : null,
        columns: renderActivityHistoryColumns ? () => renderActivityHistoryColumns() : () => []
      },
      saleTransaction: {
        rows: saleTransactionInfo ? Object.values(saleTransactionInfo) : null,
        columns: renderSaleTransactionColumns ? () => renderSaleTransactionColumns() : () => []
      }
    };

    // useEffect(() => {
    //   dispatch(getActivityHistoryApi());
    //   dispatch(getLoginHistoryApi());
    //   dispatch(getSaleTransactionApi());
    // }, []);

    return (
      <History tableInfo={tableInfo} loginHistoryInfo={loginHistoryInfo}
      activityHistoryInfo={activityHistoryInfo}
      />
    );

  }


  
};

export default HistoryContainer;