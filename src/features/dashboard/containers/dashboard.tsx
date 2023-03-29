import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { getStockInfoApi } from '../../inventory/slice';
import { getAllGramSoldApi } from "../slice";
import Dashboard from "../components/dashboard";
import { getSalesTransacInfoApi } from "../../sales-report/slice";


const DashboardContainer = () => {
    //DATA
    const { salesTransacInfo } = useSelector((state) => state.salesReport);
    const { stockInfo } = useSelector((state) => state.inventory);
    const { gramsSoldInfo } = useSelector(state => state.dashboard);

    //DISPATCH(
    const dispatch = useDispatch();
    

    //FOR DAILY SALES 
    let dailySales = salesTransacInfo.map((data) => ({
        itemQuantity: data.itemQuantity,
        dateSold: moment(data.dateSold).format("MMM DD YYYY"),
        totalSales: data.totalSales
    }));
    dailySales = dailySales.filter(i => i.dateSold === moment().format("MMM DD YYYY"));

    let itemSold = dailySales.map(i => i.itemQuantity);
    itemSold = itemSold.reduce((acc, value) => acc + value, 0);

    let totalAmount = dailySales.map(i => i.totalSales);
    totalAmount = totalAmount.reduce((acc, value) => acc + value, 0);

    //FOR SALES OVERVIEW GRAPH 
    let monthlySales = salesTransacInfo.map((data) => ({
        dateSold: moment(data.dateSold).format("MMM YYYY"),
        totalSales: data.totalSales
    }));
    monthlySales = monthlySales.sort((a, b) => moment(a.dateSold).diff(moment(b.dateSold)));

    const salesOverview = monthlySales.reduce((accumulator, cur) => {
        const dateSold = cur.dateSold;
        const foundDuplicate = accumulator.find((elem) => {
            return elem.dateSold == dateSold;
        });

        if (foundDuplicate) foundDuplicate.totalSales += cur.totalSales;
        else accumulator.push(cur);
        return accumulator;
    }, []);

    const monthSoldOverview = salesOverview.map((order) => (
        order.dateSold
    ));
    const totalSalesOverview = salesOverview.map((order) => (
        order.totalSales
    ));
    const salesGraphInfo = {
        labels: monthSoldOverview,
        values: totalSalesOverview
    };

    //FOR INVENTORY SUMMARY
    const status = stockInfo !== null ? stockInfo?.map((d) => d.status) : 0;
    const warningLevels = status !== 0 ? status.reduce((acc, value) => ({
        ...acc,
        [value]: (acc[value] || 0) + 1
    }), {}) : 0;

    //FOR GRAMS SOLD IN MILKTEA FLAVORS
    useEffect(() => {
        dispatch(getStockInfoApi());
        dispatch(getAllGramSoldApi());
    }, []);

    useEffect(() => {
        dispatch(getSalesTransacInfoApi());
    },[salesTransacInfo]);

    return (
        <Dashboard
            salesGraphInfo={salesGraphInfo}
            itemSold={itemSold}
            totalAmount={totalAmount}
            gramsSoldInfo={gramsSoldInfo}
            warningLevels={warningLevels}
        />
    );
};

export default DashboardContainer;