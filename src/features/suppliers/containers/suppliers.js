import Suppliers from '../components/suppliers';
import {
  postSupplierInfoApi,
  putSupplierInfoApi,
  removeSupplierInfoApi,
  postPurchaseInfoApi,
  putPurchaseInfoApi,
  deletePurchaseInfoApi,
  restoreSupplierInfoApi,
  getPOInfoApi,
  getSupplierInfoApi
} from '../slice';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getStockInfoApi } from '../../inventory/slice';

const SuppliersContainer = () => {
  const dispatch = useDispatch();

  const { supplierInfo, fetchStatus } = useSelector((state) => state.supplier);
  const { purchaseInfo, poInfo, fetchStatus2 } = useSelector((state) => state.purchaseRec);
  const { stockInfo } = useSelector((state) => state.inventory);

  //SUPPLIERS
  let renderExistingSupplierColumns;
  const existingSuppliers = supplierInfo.filter(x => x.isRemoved == false);
  if (existingSuppliers.length != 0) {
    const existingSupplierColumns = Object.keys(existingSuppliers[0]).filter(x => x != "isRemoved" && x != "id" && x != "dateAdded");
    renderExistingSupplierColumns = () => {
      const newObj = existingSupplierColumns.map((column) => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    };
  }

  let renderRemovedSupplierColumns;
  const removedSuppliers = supplierInfo.filter(x => x.isRemoved == true);
  if(removedSuppliers.length != 0) {
    const removedSuppliersColumns = Object.keys(removedSuppliers[0]).filter(x => x != "isRemoved" && x != "id");
    renderRemovedSupplierColumns = () => {
      const newObj = removedSuppliersColumns.map((column) => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    };
  }
  
  //PURCHASE REC
  let renderPurchaseRecColumns;
  if(purchaseInfo.length != 0) {
    const purchaseRecColumns = Object.keys(purchaseInfo[0]);
    renderPurchaseRecColumns = () => {
    const newObj = purchaseRecColumns.map((column) => ({
      id: column,
      label: column.toUpperCase()
    }));
    return newObj;
  };
  }
  

  // Purchase Order Record
  let renderPoColumns;
  if(poInfo.length != 0) {
    const poColumns = Object.keys(poInfo[0]);
    renderPoColumns = () => {
    const newObj = poColumns.map((column) => ({
      id: column,
      label: column.toUpperCase()
    }));
    return newObj;
  };
  }

  //MOBILE VIEW DATA 
  const mobileSupplierCol = Object.keys(existingSuppliers[0]).filter(x => x != "isRemoved" && x != "id" && x != "dateAdded");
  const renderMobileSupplierCol = mobileSupplierCol.map((column) => ({
    id: column,
    label: column.toUpperCase()
  }));

  const mobileReorderCol = Object.keys(poInfo[0]).filter(x => x != "isRemoved" && x != "id" && x != "supplier" && x != "user" && x != "category");
  const renderMobileReorderCol = mobileReorderCol.map((column) => ({
    id: column,
    label: column.toUpperCase()
  }));


const mobileTableInfo = {
  renderMobileSupplierCol: renderMobileSupplierCol,
  renderMobileReorderCol: renderMobileReorderCol

}

  const tableInfo = {
    existingSuppliers: {
      info: existingSuppliers,
      rows: existingSuppliers ? Object.values(existingSuppliers) : null,
      columns: renderExistingSupplierColumns ? () => renderExistingSupplierColumns() : () => []
    },
    removedSuppliers: {
      info: removedSuppliers,
      rows: removedSuppliers ? Object.values(removedSuppliers) : null,
      columns: renderRemovedSupplierColumns ? () => renderRemovedSupplierColumns() : () => []
    },
    purchaseRecords: {
      rows: purchaseInfo ? Object.values(purchaseInfo) : null,
      columns: renderPurchaseRecColumns ? () => renderPurchaseRecColumns() : () => []
    },
    poInfo: {
      rows: poInfo ? Object.values(poInfo) : null,
      columns: renderPoColumns ? () => renderPoColumns() : () => []
    }
  };

  const reducers = {
    postSupplierInfoApi: postSupplierInfoApi,
    putSupplierInfoApi: putSupplierInfoApi,
    removeSupplierInfoApi: removeSupplierInfoApi,
    postPurchaseInfoApi: postPurchaseInfoApi,
    putPurchaseInfoApi: putPurchaseInfoApi,
    deletePurchaseInfoApi: deletePurchaseInfoApi,
    restoreSupplierInfoApi: restoreSupplierInfoApi
  };

  const sliceStates = {
    supplierInfo: supplierInfo,
    purchaseInfo: purchaseInfo,
    stockInfo: stockInfo
  };

  useEffect(() => {
    dispatch(getSupplierInfoApi());
  }, [fetchStatus]);

  useEffect(() => {
    dispatch(getPOInfoApi());
    dispatch(getStockInfoApi());
  }, [fetchStatus2]);

  const { openAddPurchaseRecord, purchaseRecNotifInfo } = useSelector(state => state.purchaseRec);


  return (
    <Suppliers
      dispatch={dispatch}
      supplierInfo={supplierInfo}
      stockInfo={stockInfo}
      renderMobileSupplierCol={renderMobileSupplierCol}
      //Supplier API
      putSupplierInfoApi={putSupplierInfoApi}
      //PurchaseRec API
      postPurchaseInfoApi={postPurchaseInfoApi}
      putPurchaseInfoApi={putPurchaseInfoApi}
      reducers={reducers}
      tableInfo={tableInfo}
      mobileTableInfo={mobileTableInfo}
      purchaseRecNotifInfo={purchaseRecNotifInfo}
    />
  );
};

export default SuppliersContainer;