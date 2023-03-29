import InventoryReport from '../components/inventory-report';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getStockInfoApi } from '../../inventory/slice';
import { getPOInfoApi } from '../../suppliers/slice';


const InventoryReportContainer = () => {
  const dispatch = useDispatch();
  const { stockInfo } = useSelector((state) => state.inventory);
  const { poInfo } = useSelector((state) => state.purchaseRec);
  let { activityHistoryInfo } = useSelector((state) => state.history);

  const columns = Object.keys(poInfo[0]);
  activityHistoryInfo = activityHistoryInfo.filter(d => d.module === "Inventory");

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
  }

  // const stockCategory = stockInfo.map((data) => data.category)
  // const categoryCount = stockCategory.reduce((acc, value) => (
  //   {
  //     ...acc,
  //     [value]: (acc[value] || 0) + 1
  //   }
  // ), {});

   // const chartInfo = {
  //   legends: Object.keys(categoryCount),
  //   values: Object.values(categoryCount)
  // }

  //FOR INVENTORY SUMMARY
  const status = stockInfo?.map((d) => d.status);
  const warningLevels = status.reduce((acc, value) => (
    {
      ...acc,
      [value]: (acc[value] || 0) + 1
    }
  ), {});

  //MOBILE DATA VIEW
  const mobileReorderCol = Object.keys(poInfo[0]).filter(x => x != "isRemoved" && x != "id" && x != "supplier" && x != "user" && x != "category");
  const renderMobileReorderCol = mobileReorderCol.map((column) => ({
    id: column,
    label: column.toUpperCase()
  }));

  const tableInfo = {
    rows: Object.values(poInfo),
    renderColumns: () => {
      const newObj = columns.map(column => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    },
    activityHistory: {
      rows: activityHistoryInfo ? Object.values(activityHistoryInfo) : null,
      columns: renderActivityHistoryColumns ? () => renderActivityHistoryColumns() : () => []
    }
  };

  useEffect(() => {
    dispatch(getStockInfoApi());
    dispatch(getPOInfoApi());
  }, [])

  return (
    <InventoryReport
      tableInfo={tableInfo}
      warningLevels={warningLevels}
      renderMobileReorderCol={renderMobileReorderCol} />
  );
};

export default InventoryReportContainer;
