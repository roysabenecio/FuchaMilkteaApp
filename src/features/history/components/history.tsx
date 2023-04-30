import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Typography, Box, Stack, Button, Card, Menu, Grow } from '@mui/material';

//Date
import moment from 'moment';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { default as styles } from './styles'
import BasicTable from '../../../shared-components/table/table';

//icons
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';

const History = ({ tableInfo, loginHistoryInfo, activityHistoryInfo }) => {
  //MENU DROPDOWN FOR DATE 
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dateRange, setDateRange] = useState([{
    startDate: moment().startOf('day')._d,
    endDate: moment()._d,
    key: 'selection'
  }]);

  const from = moment(dateRange[0].startDate);
  const to = moment(dateRange[0].endDate);

  const selectActivityHist = (data, from, to) => {
    return data.filter(history => {
      let date = moment(history.date);
      if (moment(date._d).isBetween(from._d, to._d, 'days', '[]')) {
        return history;
      };
    });
  };

  const selectTransacHist = (state, from, to) => {
    return state.history.saleTransactionInfo.filter(sale => {
      let date = moment(sale.dateSold);
      if (moment(date._d).isBetween(from._d, to._d, 'days', '[]')) {
        return sale;
      };
    });
  };

  const selectLoginHistoryInfo = (data, from, to) => {
    return data.filter(log => {
      let date = moment(log.date);
      if (moment(date._d).isBetween(from._d, to._d, 'days', '[]')) {
        return log;
      };
    });
  };

  const filteredTransacHist = useSelector(state => selectTransacHist(state, from, to));
  // const filteredActivityHist = useSelector(state => selectActivityHist(state, from, to));
  const filteredActivityHist = selectActivityHist(activityHistoryInfo, from, to);
  // const filteredLoginHist = useSelector(state => selectLoginHistoryInfo(state, from, to));
  const filteredLoginHist = selectLoginHistoryInfo(loginHistoryInfo, from, to);


  const clearDateFilter = () => {
    setDateRange([{
      startDate: moment()._d,
      endDate: moment()._d,
      key: 'selection'
    }]);
    handleClose();
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={6}>
        <Typography
          mt={2}
          sx={styles.overviewText}
          variant='h6'
        >History
        </Typography>
      </Grid>
      <Grid item xs={6} md={6}>
        <Stack
          direction="row"
          sx={styles.actionBarWrapper
          }>
          <Button
            onClick={handleClick}
            size='small'
            startIcon={<DateRangeRoundedIcon />}
            endIcon={<ExpandMoreRoundedIcon />} >
            Select date
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}>
            <Stack direction="column" spacing={2} p={2} >
              <DateRange
                editableDateInputs={true}
                onChange={item => setDateRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={dateRange}
                maxDate={new Date()}
                minDate={new Date("2021-01-01")}
                rangeColors={["grey"]} />
              <Button variant='outlined' onClick={clearDateFilter}>Clear Filter</Button>
            </Stack>
          </Menu>
        </Stack>
      </Grid>

      <Grid item container spacing={2} xs={12} sm={12} md={6}>
        <Grid item md={12}>
          <Grow in={true} timeout={800}>
            <Card>
              <Box p={'1em'}>
                <Typography
                  pb={1}
                  variant='subtitle1'
                  sx={styles.overviewText}>
                  Transaction History
                </Typography>
                {filteredTransacHist.length !== 0 ?
                  <BasicTable maxHeight={440} rows={filteredTransacHist} columns={tableInfo.saleTransaction.columns()} tableToModule={''} /> :
                  <Typography>No data to show.</Typography>
                }
              </Box>
            </Card>
          </Grow>
        </Grid>

        <Grid item md={12}>
          <Grow in={true} timeout={900}>
            <Card>
              <Box p={'1em'}>
                <Typography
                  pb={1}
                  variant='subtitle1'
                  sx={styles.overviewText}>Activity History
                </Typography>
                {filteredActivityHist.length !== 0 ?
                  <BasicTable maxHeight={370} rows={filteredActivityHist} columns={tableInfo.activityHistory.columns()} tableToModule={''} /> :
                  <Typography>No data to show.</Typography>
                }
              </Box>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      <Grid item md>
        <Grow in={true} timeout={1000}>
          <Card>
            <Box p={'1em'}>
              <Typography
                pb={1}
                variant='subtitle1'
                sx={styles.overviewText}>Login History
              </Typography>
              {filteredLoginHist.length !== 0 ?
                <BasicTable maxHeight={955} rows={filteredLoginHist} columns={tableInfo.loginHistory.columns()} tableToModule={''} /> :
                <Typography>No data to show.</Typography>
              }
            </Box>

          </Card>
        </Grow>
      </Grid>
    </Grid>
  );
};

export default History;