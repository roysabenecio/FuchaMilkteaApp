import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Grid,
  Typography,
  Box,
  Card,
  Grow,
  Menu,
  Stack,
  Button,
  MenuItem
} from '@mui/material';
import DonutChart from '../../../shared-components/donut-chart/donut-chart';
import { default as styles } from './styles';
import BasicTable from '../../../shared-components/table/table';
//PDF and XLXS
import { utils, writeFile } from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
//Date
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
//icons
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

const InventoryReport = ({
  tableInfo,
  renderMobileReorderCol,
  warningLevels }) => {
  const [currRow, setRow] = useState('');
  const tableToInventoryReport = (tableData) => {
    setRow(tableData)
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
    window.addEventListener("resize", handleResize);
  });

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

  const selectReorderDate = (state, from, to) => {
    return state.purchaseRec.poInfo.filter(stock => {
      let datePurchased = moment(stock.datePurchased);
      if (moment(datePurchased._d).isBetween(from._d, to._d, 'days', '[]')) {
        return stock;
      };
    });
  };

  const selectActivityHist = (state, from, to) => {
    return state.history.activityHistoryInfo.filter(history => {
      let date = moment(history.date);
      if (moment(date._d).isBetween(from._d, to._d, 'days', '[]')) {
        return history;
      };
    });
  };

  const filteredReorderDate = useSelector(state => selectReorderDate(state, from, to));
  let filteredActivityHist = useSelector(state => selectActivityHist(state, from, to));
  filteredActivityHist = filteredActivityHist.filter(d => d.module === "Inventory");

  const clearDateFilter = () => {
    setDateRange([
      {
        startDate: moment()._d,
        endDate: moment()._d,
        key: 'selection'
      }
    ]);
    handleClose();
  };

  //HANDLE EXPORTS
  const [exportMenu, setExportMenu] = useState(null);
  const openExportMenu = Boolean(exportMenu);
  const handleExportClick = (event) => {
    setExportMenu(event.currentTarget);
  };

  const handleDownloadXLSX = () => {
    const activityWs = utils.json_to_sheet(filteredActivityHist);
    const reorderWs = utils.json_to_sheet(filteredReorderDate);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, activityWs, "Activity");
    utils.book_append_sheet(workbook, reorderWs, "Reorder List");
    utils.sheet_add_aoa(activityWs, [["ID", "USER", "ACTIVITY", "DATE",]], { origin: "A1" });
    utils.sheet_add_aoa(reorderWs, [["ID", "STOCK", "CATEGORY", "MEASURE ", "UNIT", "COST", "DATE", "SUPPLIER", "USER"]], { origin: "A1" });
    writeFile(workbook, "Sales_Report.xlsx");
  };

  //TO PDF TEST !TEMP!
  const printTable = useRef();
  const printChart = useRef();

  /* COLLAPSE THIS */
  const handleDownloadPDF = async () => {
    //CHART TO IMAGE
    const chart = printChart.current;
    const chartCanvas = await html2canvas(chart);
    const chartData = chartCanvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const chartImgProps = pdf.getImageProperties(chartData);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (chartImgProps.height * pdfWidth) / chartImgProps.width;

    pdf.text(20, 20, "Inventory Report");
    pdf.addImage(chartData, 'PNG', 0, 40, pdfWidth, pdfHeight);
    pdf.addPage('landscape');
    pdf.text(14, 20, "Reorder Record");
    autoTable(pdf, {
      head: [["ID", "Stock Name", "Measure", "Measurement Unit", "Category", "Status", "Date Added", "Supplier"]],
      body: reorder,
      startY: 30,
    });
    pdf.addPage('landscape');
    pdf.text(14, 20, "Activity History");
    autoTable(pdf, {
      head: [["ID", "User", "Activity", "Date"]],
      body: activityHist,
      startY: 30,
    });

    pdf.save('Inventory_Report.pdf');
  };

  let reorder = filteredReorderDate.map((data) => ([
    data.id,
    data.stock,
    data.category,
    data.measure,
    data.measurementUnit,
    data.price,
    data.datePurchased,
    data.supplier,
  ]));

  let activityHist = filteredActivityHist.map((data) => ([
    data.id,
    data.user,
    data.activity,
    data.date
  ]));

  const chartData = {
    labels: Object.keys(warningLevels),
    datasets: [{
      label: 'line1',
      data: Object.values(warningLevels),
      backgroundColor: ["green", "orange", "red", "purple", "gray"],
      borderColor: 'white',
    }],
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <Typography
          mt={2}
          sx={styles.overviewText}
          variant='h6'
        >Inventory Report
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
              sx={styles.overviewText}>Inventory Activities
            </Typography>
            <Box p={'1em'} height={'78%'} sx={styles.center}>
              {filteredActivityHist.length !== 0 ?
                <BasicTable maxHeight={370} rows={filteredActivityHist} columns={tableInfo.activityHistory.columns()} tableToModule={''} /> :
                <Typography>No data to show.</Typography>
              }
            </Box>

          </Card>
        </Grow>
      </Grid>

      <Grid item xs={12} md={5}>
        <Grow in={true} timeout={800}>
          <Card>
            <Typography
              ml={2}
              mt={2}
              variant='subtitle1'
              sx={styles.overviewText}>Current Stock
            </Typography>
            <div ref={printChart}>
              <Box sx={styles.chartWrapper}>
                <DonutChart data={chartData} />
              </Box>
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
                sx={styles.overviewText}>Reorders
              </Typography>
            </Grid>
            <Grid item md={12} m={2} sx={styles.center} >
              <div ref={printTable} >
                {isMobile ?

                  filteredReorderDate.length !== 0 ?
                    <BasicTable maxHeight={440} rows={filteredReorderDate} columns={renderMobileReorderCol} tableToModule={tableToInventoryReport} /> :
                    <Typography>No data to show.</Typography>
                  :
                  filteredReorderDate.length !== 0 ?
                    <BasicTable maxHeight={440} rows={filteredReorderDate} columns={tableInfo.renderColumns()} tableToModule={tableToInventoryReport} /> :
                    <Typography>No data to show.</Typography>
                }
              </div>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid >
  );
};

export default InventoryReport;
