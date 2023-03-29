import { useState } from "react";
import { default as styles } from './styles';
import { itemCategory } from '../constants';
//icons
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded';
import {
  Grid,
  Typography,
  Card,
  Grow,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button
} from '@mui/material';

const MenuCard = ({
  menuItem,
  addToBill,
  sliceStates,
  validations,
  getPrice
}) => {
  //add ons
  const [addOn, setAddOn] = useState(sliceStates.addOnInfo[0].name);
  const handleAddOn = (event) => {
    setAddOn(event.target.value)
  };

  //sizes
  const [size, setSize] = useState(sliceStates.sizeInfo[1].id);
  const handleSize = (event, newSize) => {
    setSize(event.target.value)
  };

  const classicSize = sliceStates.sizeInfo.map(s => s);
  const premiumSize = sliceStates.sizeInfo.filter(s => s.id !== 1);

  return (
    <>
      {/* // Every Menu Item is diffirent
        //so the key should be its ID */}
      <Grow in={true} timeout={1500} key={menuItem.id}>
        <Card>
          <Grid container spacing={2} p={2}>
            <Grid item md={4} sx={styles.iconWrapper}>
              <FastfoodRoundedIcon />
            </Grid>

            <Grid item md={8}>
              {/* Menu Name */}
              <Typography sx={styles.overviewText} variant='subtitle1'>
                {menuItem.name}
              </Typography>

              {/* Menu Category !TEMPORARY! */}
              {itemCategory.map((cat, index) => (
                menuItem.menuCategoryId === cat.id ?
                  <Typography key={index} variant='subtitle2'>
                    {cat.label}
                  </Typography> : null
              ))}
            </Grid>

            {/* Price */}
            <Grid item md={12}>
              <Typography sx={styles.overviewText} variant='subtitle1'>
                {`Php ${validations.isMilkTea(menuItem.menuCategoryId) ? 
                   getPrice.milkTea(menuItem.menuCategoryId, size)
                : getPrice.menu(menuItem.id, menuItem.menuCategoryId)}`}
              </Typography>
            </Grid>

            {/* Size */}
            {validations.isMilkTea(menuItem.menuCategoryId) ?
              <Grid item md={12}>
                <FormControl sx={{ width: 130 }}>
                  <InputLabel sx={{ fontSize: 13 }}>Size</InputLabel>
                  <Select
                    value={size}
                    label="Size"
                    onChange={handleSize}
                    size='small'>
                    {menuItem.menuCategoryId === 1 ? classicSize.map(size => (
                      <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                    )) :
                      premiumSize.map(size => (
                        <MenuItem key={size.id} value={size.id}>{size.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid> : null }

            {/* Add Ons */}
            {validations.isMilkTea(menuItem.menuCategoryId) ?
              <Grid item md={12}>
                <FormControl sx={{ width: 130 }}>
                  <InputLabel sx={{ fontSize: 13 }}>Add On</InputLabel>
                  <Select
                    id="demo-simple-select"
                    value={addOn}
                    label="Add on"
                    onChange={handleAddOn}
                    size='small'>
                    {sliceStates.addOnInfo.map(addOn => (
                      <MenuItem key={addOn.id} value={addOn.name}>{addOn.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid> : null }

            <Grid item md={12}>
              <Button
                fullWidth
                variant="menuCard"
                // sx={{ backgroundColor: "#FFFFFF"}}
                onClick={() => addToBill(menuItem, menuItem.menuCategoryId, addOn, size, 0)}>
                Add to bill
              </Button>
            </Grid>

          </Grid>
        </Card>
      </Grow>
    </>
  );
};

export default MenuCard;