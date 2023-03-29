import LineChart from '../../../shared-components/line-chart/line-chart';
import DonutChart from '../../../shared-components/donut-chart/donut-chart'
import BasicTable from '../../../shared-components/table/table';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Grid, Typography, Box, Card, Grow, Stack, Button, Menu, MenuItem } from '@mui/material';
import { default as styles } from './styles';
import { utils, writeFile } from 'xlsx';
//Date
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
//icons
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

const SalesReport = ({
  tableInfo,
  ordersInfo,
  graphInfo,
  productPerformance,
  renderMobiOrderCol }) => {
  const [currRow, setRow] = useState('');
  const tableToSalesReport = (tableData) => {
    setRow(tableData);
  };

  //MENU DROPDOWN FOR DATE 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setExportMenu(null);
  };

  //HANDLE TABLE ON MOBILE VIEW
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    if (window.screen.width < 1050 || window.innerWidth < 1050) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize)
  });

  //DATE TO FIELD
  const [dateRange, setDateRange] = useState([
    {
      startDate: moment().startOf('month')._d,
      endDate: moment()._d,
      key: 'selection'
    }
  ]);

  const from = moment(dateRange[0].startDate);
  const to = moment(dateRange[0].endDate);
  let selectedMonth = moment(from).format("MMM YYYY");
  let selectedYear = moment(from).format("YYYY");

  const selectDateRange = (state, from, to) => {
    return state.salesReport.ordersInfo.filter(sale => {
      let dateSold = moment(sale.date);
      if (moment(dateSold._d).isBetween(from._d, to._d, 'days', '[]')) {
        return sale
      };
    });
  };
  const filteredDate = useSelector(state => selectDateRange(state, from, to));

  const clearDateFilter = () => {
    tableInfo.ordersInfo.rows = Object.values(ordersInfo);
    setDateRange([
      {
        startDate: moment()._d,
        endDate: moment()._d,
        key: 'selection'
      }
    ]);
    handleClose();
  };

  const salesByYear = () => {
    const months = graphInfo.labels.filter(y => y.includes(selectedYear));
    const salesInfo = graphInfo.labels.reduce((o, k, i) => ({ ...o, [k]: graphInfo.values[i] }), {});
    let filteredValues = [];

    loop1:
    for (const month of months) {
      for (let [key, value] of Object.entries(salesInfo)) {
        if (month === key) {
          filteredValues.push(value);
          continue loop1;
        }
      }
      filteredValues.push(0);
    };

    const data = {
      labels: months,
      datasets: [{
        label: "Sales (PHP)",
        data: filteredValues,
        borderColor: "green",
        tension: 0.5
      },
      ],
    };
    return data;
  };

  const monthlyPerformance = () => {
    const filteredData = productPerformance.filter(d => d.date === selectedMonth).map(o => ({ category: o.category, quantity: o.quantity }))
    const category = filteredData.map(c => c.category);
    const qty = filteredData.map(q => q.quantity);
    const info = category.reduce((o, k, i) => ({ ...o, [k]: qty[i] }), {});

    const data = {
      labels: Object.keys(info),
      datasets: [{
        label: 'line1',
        data: Object.values(qty),
        backgroundColor: ["green", "orange", "blue", "purple", "red", "yellow", "pink", "turquoise"],
        borderColor: 'white',
      }],
    };

    return data;
  };


  //EXPORT DATA TO EXCEL
  const [exportMenu, setExportMenu] = useState(null);
  const openExportMenu = Boolean(exportMenu);
  const handleExportClick = (event) => {
    setExportMenu(event.currentTarget)
  };

  const handleDownloadXLSX = () => {
    const worksheet = utils.json_to_sheet(filteredDate);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sales");
    utils.sheet_add_aoa(worksheet, [["ID", "NAME", "CATEGORY", "QUANTITY", "PRICE", "ADD ON", "ADD ON PRICE", "SIZE", "DATE", "CASHIER", "SALED ID"]], { origin: "A1" });
    writeFile(workbook, "Sales_Report.xlsx");
  };

  //TO PDF TEST !TEMP!
  const printGraph = useRef();
  const printChart = useRef();

  /* COLLAPSE THIS */
  const handleDownloadPDF = async () => {
    //GRAPH TO IMAGE
    const graph = printGraph.current;
    const canvas = await html2canvas(graph);
    const data = canvas.toDataURL('image/png');
    //CHART TO IMAGE
    const chart = printChart.current;
    const chartCanvas = await html2canvas(chart);
    const chartData = chartCanvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const graphImgProps = pdf.getImageProperties(data);
    const chartImgProps = pdf.getImageProperties(chartData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight1 =
      (graphImgProps.height * pdfWidth) / graphImgProps.width;

    const pdfHeight2 =
      (chartImgProps.height * pdfWidth) / chartImgProps.width;

    pdf.text(20, 10, "Sales Report");
    pdf.addImage(data, 'PNG', 0, 20, pdfWidth, pdfHeight1);
    pdf.addImage(chartData, 'PNG', 0, 130, pdfWidth, pdfHeight2);
    pdf.addPage('landscape');
    autoTable(pdf, {
      head: [["ID", "Name", "Category", "Size", "Quantity", "Price", "Add-On", "Add-On Price", "Date", "Cashier"]],
      body: salesValToPdf,
    })
    pdf.save('sales_report.pdf');
  };

  let salesValToPdf = filteredDate.map((data) => ([
    data.id,
    data.name,
    data.category,
    data.size,
    data.quantity,
    data.price,
    data.addOn,
    data.addOnPrice,
    moment(data.date).format("MM/DD/YYYY h:mm A"),
    data.cashier
  ]));

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <Typography
          mt={2}
          sx={styles.overviewText}
          variant='h6'
        >Sales Report
        </Typography>
      </Grid>
      <Grid item xs={6} md={6}>
        <Stack
          direction="row"
          spacing={1}
          mt={2}
          sx={styles.actionBarWrapper}>
          <Button
            onClick={handleClick}
            size='small'
            startIcon={<DateRangeRoundedIcon />}
            endIcon={<ExpandMoreRoundedIcon />}
          >
            Select date
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <Stack direction="column" spacing={2} p={2}>
              <DateRange
                editableDateInputs={true}
                onChange={item => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
                minDate={new Date("2021-01-01")}
                rangeColors={["grey"]}
              />
              <Button variant='outlined' onClick={clearDateFilter}>Clear Filter</Button>
            </Stack>
          </Menu>
          <Button
            size='small'
            onClick={handleExportClick}
            startIcon={<FileUploadRoundedIcon />}>
            Export
          </Button>
          <Menu
            anchorEl={exportMenu}
            open={openExportMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDownloadPDF}>Export to PDF</MenuItem>
            <MenuItem onClick={handleDownloadXLSX}>Export to XLSX</MenuItem>
          </Menu>
        </Stack>
      </Grid>

      <Grid item xs={12} md={7}>
        <Grow in={true} timeout={800}>
          <Card>
            <Typography
              ml={2}
              mt={2}
              variant='subtitle1'
              sx={styles.overviewText}>Sales Overview
            </Typography>
            <Typography ml={2} variant='caption'>{moment(from).format("YYYY")}</Typography>
            <div ref={printGraph}>
              <LineChart data={salesByYear()} />
            </div>
          </Card>
        </Grow>
      </Grid>
      <Grid item xs={12} md={5}>
        <Grow in={true} timeout={800}>
          <Card>
            <Stack>
              <Typography
                ml={2}
                mt={2}
                variant='subtitle1'
                sx={styles.overviewText}>Product Performance
              </Typography>
              <Typography ml={2} variant='caption' >{moment(from).format("MMMM")}</Typography>
            </Stack>
            <div ref={printChart}>
              {filteredDate.length !== 0 ?
                <Box width={'78%'} height={'78%'} m={'0 auto'} p={2} >
                  <DonutChart data={monthlyPerformance()} />
                </Box>
                :
                <Grid item md={12} sx={styles.center} minHeight={365}>
                  <Typography>No data to show</Typography>
                </Grid>
              }
            </div>
          </Card>
        </Grow>
      </Grid>
      <Grid item xs md>
        <Card>
          <Grid item container xs md >
            <Grid item md={6} >
              <Typography
                ml={2}
                mt={2}
                variant='subtitle1'
                sx={styles.overviewText}>Daily Sales
              </Typography>
            </Grid>
            <Grid item md={12} m={2} sx={styles.center}>
              {isMobile ?
                filteredDate.length !== 0 ?
                  <BasicTable maxHeight={440} rows={filteredDate} columns={renderMobiOrderCol} tableToModule={tableToSalesReport} /> :
                  <Typography>No data to show.</Typography>
                :
                filteredDate.length !== 0 ?
                  <BasicTable maxHeight={440} rows={filteredDate} columns={tableInfo.ordersInfo.columns} tableToModule={tableToSalesReport} /> :
                  <Typography>No data to show.</Typography>
              }
            </Grid>
          </Grid>
        </Card>
      </Grid>

    </Grid >

  );
};

export default SalesReport;
