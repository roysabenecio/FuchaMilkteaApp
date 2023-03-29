import Inventory from '../components/inventory';
import { postStockApi, getStockInfoApi, editStockApi, deleteStockApi } from '../slice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

const InventoryContainer = () => { 
  const { stockInfo, fetchStatus } = useSelector((state) => state.inventory);
  const { supplierInfo } = useSelector((state) => state.supplier);
  const dispatch = useDispatch();

  //EXISTING STOCK
  const existingStock = stockInfo.filter(x => x.isRemoved == false);
  
  const columns = Object.keys(stockInfo[0]).filter(x => x != "isRemoved" && x != "id");
  // const columns = columnsT.map(x => x == "ceiling" ? x : x);
  
  const mobileCol = Object.keys(stockInfo[0]).filter(x => x != "isRemoved" && x != "id"  
  && x != "category" && x != "lastRestocked" && x != "supplier"  && x != "lowLevel"  && x != "criticalLevel" && x != "ceiling");

  const mobileColObj = mobileCol.map((column) => ({
    id: column,
    label: column.toUpperCase()
  }));

  const renderColumns = () => {
    const newObj = columns.map((column) => ({
      id: column,
      label: column.toUpperCase()
    }));
    return newObj;
  };

  const stockCategory = stockInfo.map(x => x.category);
  const uniqueCategories = [...new Set(stockCategory)];

  const measurementUnit = stockInfo.map(x => x.measurementUnit);
  const uniqueMeasurementUnit = [...new Set(measurementUnit)];

  //MOBILE VIEW DATA
  const mobileViewInfo = {
    rows: Object.values(stockInfo),
    columns: mobileColObj
  }

  useEffect(() => {
    dispatch(getStockInfoApi());
  },[fetchStatus]);

  useEffect(() => {
    dispatch(getStockInfoApi());
  },[]);

  return (
    <Inventory
      dispatch={dispatch}
      columns={renderColumns()}
      mobileViewInfo={mobileViewInfo}
      supplierInfo={supplierInfo}
      existingStock={existingStock}
      uniqueCategories={uniqueCategories}
      uniqueMeasurementUnit={uniqueMeasurementUnit}
      />
  );
};

export default InventoryContainer;
