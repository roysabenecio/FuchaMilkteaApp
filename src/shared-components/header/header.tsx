import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  IconButton,
  Avatar,
  Typography,
  Box,
  Card,
  Button,
  MenuItem,
  MenuList,
  Menu,
  Badge,
} from "@mui/material";
import { WarningNotif, ErrorNotif, InfoNotif, OutNotif } from './notif-variants';
import { default as styles } from "./styles";
import { getStockInfoApi } from '../../features/inventory/slice';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';

const Header = ({ menuList, userInfo }) => {
  const dispatch = useDispatch();
  const { stockInfo, fetchStatus } = useSelector((state) => state.inventory);

  //CONTROL STATES
  const clearNotifBadge = () => setBadgeContent(0);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const openProfile = Boolean(anchorEl);
  const openNotif = Boolean(anchorEl2);
  const handleProfileClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleNotifClick = (e) => {
    setAnchorEl2(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  //COUNT ALL STOCKS WITH CRITICAL LEVELS
  const stockStatusCount = () => {
    const status = stockInfo !== null ? stockInfo.map(s => s.status) : 0;
    let totalNotif = 0;
    if (status !== 0) {
      status.map(c => {
        if (c == "Low") totalNotif += 1;
        if (c == "Critical") totalNotif += 1;
        if (c == "OverStock") totalNotif += 1;
        if (c == "OutOfStock") totalNotif += 1;
      });
      return totalNotif;
    }
    else return totalNotif;
  };
  const [badgeContent, setBadgeContent] = useState(stockStatusCount());

  let notifications = stockInfo !== null ? stockInfo.map((stock, index) => {
    switch (stock.status) {
      case 'Low':
        return <WarningNotif
          key={index}
          index={stock.id}
          handleClose={handleClose}
          content={stock.name}
          clearNotifBadge={clearNotifBadge}
          description={"Item low in stock"}
        />
      case 'OutOfStock':
        return <OutNotif
          key={index}
          index={stock.id}
          clearNotifBadge={clearNotifBadge}
          handleClose={handleClose}
          content={stock.name}
          description={"Item out of stock"}
        />
      case 'OverStock':
        return <InfoNotif
          key={index}
          index={stock.id}
          clearNotifBadge={clearNotifBadge}
          handleClose={handleClose}
          content={stock.name}
          description={"Item Overstocked"}
        />
      case 'Critical':
        return <ErrorNotif
          key={index}
          index={stock.id}
          clearNotifBadge={clearNotifBadge}
          handleClose={handleClose}
          content={stock.name}
          description={"Item critical stock"}
        />
      default:
        return null;
    }
  }) : null;

  useEffect(() => {
    setBadgeContent(stockStatusCount);
  }, [stockInfo]);

  useEffect(() => {
    // dispatch(getStockInfoApi());
    setBadgeContent(stockStatusCount);
  }, [fetchStatus]);

  return (
    <Card sx={styles.headerCard}>
      <Grid container>
        <Grid item md={12} sx={styles.headerItems}>
          {/* AnchorEl2 NOTIF BTN */}
          <Box display={'flex'} alignItems={'center'}>
            <IconButton
              padding={1}
              sx={styles.menuButton}
              onClick={handleNotifClick}>
              <Badge badgeContent={badgeContent} color={'error'}>
                <NotificationsNoneRoundedIcon />
              </Badge>
            </IconButton>
          </Box>
          {/* AnchorEl PROFILE BTN */}
          <Box>
            <Button
              sx={styles.menuButton}
              onClick={handleProfileClick}>
              <Avatar sx={styles.avatar}>{userInfo.userName[0].toUpperCase()}</Avatar>
              <Box sx={styles.headerTextWrapper}>
                <Typography variant="subtitle2" fontWeight={700}> {userInfo.firstName} {userInfo.lastName}</Typography>
                <Typography variant="caption">{userInfo.role}</Typography>
              </Box>
            </Button>
          </Box>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={openProfile}
            onClose={handleClose}
            sx={styles.notifContainer}
          >
            <Box width={320}>
              <MenuList dense>
                {menuList.map((item) => (
                  <MenuItem
                    key={item?.id}
                    onClick={() => item?.action()}>
                    {item?.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Box>
          </Menu>

          <Menu
            id="notif-menu"
            anchorEl={anchorEl2}
            open={openNotif}
            onClose={handleClose}
            sx={styles.notifContainer}
          >
            <Box width={320}>
              <MenuList dense>
                {notifications}
              </MenuList>
            </Box>
          </Menu>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Header;