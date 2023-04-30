import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, Box, ListItemIcon, ListItemButton, ListItemText, Collapse, Divider, Grid } from '@mui/material';
import { default as styles } from './styles';
import { reportSubItems, userNavItems } from './constants';
//icons
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowDropUpRoundedIcon from '@mui/icons-material/ArrowDropUpRounded';
import { useUser } from '../../app/hooks/useUser';

const Navbar = () => {
  // let userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const user = useUser();
  let userInfo = user;
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleSubItemClick = () => {
    setOpen(!open);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleListItemClick = (event, index, route) => {
    navigate(`/${route}`);
    setSelectedIndex(index);
  };

  return (
    <Grid item>
      <Drawer
        sx={styles.drawer}
        variant="permanent"
        anchor="left"
      >
        <Box sx={styles.logoBox}>
          <Box component='img' src="/images/fucha-logo-transparent.png" sx={styles.logoImg} />
        </Box>
        <Divider />

        <List sx={styles.selected}>
          {userNavItems[userInfo.role].map((item, index) => ( // userInfo.role
            item.id !== 4 ?
              <ListItemButton
                key={index}
                selected={selectedIndex === item.id}
                onClick={(event) => handleListItemClick(event, item.id, item.route)}>
                <ListItemIcon sx={styles.icons}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
              :
              <React.Fragment key={item.id}>
                <ListItemButton
                  onClick={handleSubItemClick} >
                  <ListItemIcon sx={styles.icons}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {open ? <ArrowDropUpRoundedIcon /> : <ArrowDropDownRoundedIcon />}
                </ListItemButton>

                <Collapse in={open} mountOnEnter={true}>
                  <List>
                    {reportSubItems.map((item, index) => (
                      <ListItemButton
                        onClick={handleSubItemClick}
                        sx={{ pl: 7 }}
                        key={item.id}>
                        <ListItemText
                          button="true"
                          onClick={(event) => handleListItemClick(event, item.id, item.route)}>
                          {item.label}
                        </ListItemText>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Grid>
  );
};

export default Navbar;