import { useSelector, useDispatch } from 'react-redux';
import { getSalesTransacInfoApi, getOrdersInfoApi } from '../slice';
import SalesReport from '../components/sales-report';
import moment from 'moment';
import { useEffect } from 'react';

const SalesReportContainer = () => {
  const dispatch = useDispatch();


  const { ordersInfo } = useSelector((state) => state.salesReport);

  //FOR PRODUCT PERFORMANCE CHART
  const orderCategories = ordersInfo.map((order) => ({
    category: order.category,
    quantity: order.quantity,
    date: moment(order.date).format("MMM YYYY")
  }));

  //ARRAY OF OBJECTS FOR PROD PERF
  const productPerformance = orderCategories.reduce((accumulator, cur) => {
    const category = cur.category
    const foundDuplicate = accumulator.filter(d => d.date === cur.date).find((elem) => {
      return elem.category == category
    });
    if (foundDuplicate) foundDuplicate.quantity += cur.quantity;
    else {
      accumulator.push(cur);
    }
    return accumulator;
  }, []);


  //FOR SALES PERFORMANCE GRAPH 
  const { salesTransacInfo } = useSelector((state) => state.salesReport);

  let monthlySales = salesTransacInfo.map((data) => ({
    dateSold: moment(data.dateSold).format("MMM YYYY"),
    totalSales: data.totalSales
  }));
  monthlySales = monthlySales.sort((a, b) => moment(a.dateSold).diff(moment(b.dateSold)));

  const salesOverview = monthlySales.reduce((accumulator, cur) => {
    const dateSold = cur.dateSold
    const foundDuplicate = accumulator.find((elem) => {
      return elem.dateSold == dateSold
    });

    if (foundDuplicate) foundDuplicate.totalSales += cur.totalSales;
    else accumulator.push(cur);
    return accumulator;
  }, []);

  const dateSoldOverview = salesOverview.map(order => order.dateSold);
  const totalSalesOverview = salesOverview.map(order => order.totalSales);

  const columns = Object.keys(salesTransacInfo[0]);

  let renderOrderColumns;
  let renderMobiOrderCol = [];
  if (ordersInfo.length != 0) {
    const orderColumns = Object.keys(ordersInfo[0]);
    renderOrderColumns = () => {
      const newObj = orderColumns.map(column => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    };

    const mobileOrderCol = Object.keys(ordersInfo[0]).filter(x => x != "isRemoved" && x != "id" && x != "addOn" && x != "addOnPrice" && x != "cashier");
    renderMobiOrderCol = mobileOrderCol.map(column => ({
      id: column,
      label: column.toUpperCase()
    }));
  };

  //PROPS
  const tableInfo = {
    ordersInfo: {
      rows: Object.values(ordersInfo),
      columns: renderOrderColumns ? renderOrderColumns() : () => []
    },
    rows: Object.values(salesTransacInfo),
    renderColumns: () => {
      const newObj = columns.map(column => ({
        id: column,
        label: column.toUpperCase()
      }));
      return newObj;
    },
  };

  const graphInfo = {
    labels: dateSoldOverview,
    values: totalSalesOverview
  };

  useEffect(() => {
    dispatch(getOrdersInfoApi());
    dispatch(getSalesTransacInfoApi());
  }, []);

  return (
    <SalesReport
      tableInfo={tableInfo}
      ordersInfo={ordersInfo}
      graphInfo={graphInfo}
      productPerformance={productPerformance}
      renderMobiOrderCol={renderMobiOrderCol}
    />
  );
};

export default SalesReportContainer;