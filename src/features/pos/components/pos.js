import { useState } from "react";
import { default as styles } from './styles';
import { itemCategory } from '../constants';
import MenuCard from './MenuCard';
import Bill from './Bill';
import {
  Grid,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';

const POS = ({ dispatch, sliceStates }) => {

  const [orders, setOrders] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  //category
  const [category, setCategory] = useState(1);
  const handleCategory = (event, newCategory) => {
    setCategory(newCategory)
  };

  const validations = {
    isMilkTea: (categoryId) => categoryId === 1 || categoryId === 2 ? true : false
  };

  const getPrice = {
    milkTea:
      (categoryId, sizeId) => sliceStates.priceInfo.find(mt =>
        mt.menuCategoryId === categoryId &&
        mt.sizeId === sizeId).price,
    menu:
      (menuId, categoryId) => sliceStates.priceInfo.find(m =>
        m.menuId === menuId &&
        m.menuCategoryId === categoryId).price,
    addOn:
      (addOn) => sliceStates.addOnInfo.find(a => a.name === addOn).addOnPrice
  };

  const getExistingOrder = {
    milkTea: (menuId, categoryId, sizeId, addOn) => orders.find(order =>
      order.id === menuId &&
      order.menuCategoryId === categoryId &&
      order.sizeId === sizeId &&
      order.addOn === addOn),
    menu: (menuId, categoryId) => orders.find(order =>
      order.id === menuId &&
      order.menuCategoryId === categoryId)
  };

  const getStockMeasure = (id) => {
    const quantity = sliceStates.stockInfo.find(s => s.id === id);
    return quantity.measure;
  };

  const addToBill = (menuItem, menuCategoryId, addOn, size, qty) => {
    if (validations.isMilkTea(menuCategoryId)) {

      let milkTeaPrice = getPrice.milkTea(menuCategoryId, size);
      let addOnPrice = parseFloat(getPrice.addOn(addOn));
      let orderExists = getExistingOrder.milkTea(menuItem.id, menuCategoryId, size, addOn) ? getExistingOrder.milkTea(menuItem.id, menuCategoryId, size, addOn): null ;

      if (orderExists) {
        orders.map(order => {
          if (order === orderExists) {
            let priceBefore = totalPrice - order.price - order.addOnPrice;
            order = {
              ...order,
              quantity: qty == 0 ? order.quantity += 1 : qty,
              price: order.price = milkTeaPrice * order.quantity,
              addOnPrice: order.addOnPrice = addOnPrice * order.quantity
            };
            setTotalPrice(priceBefore + order.price + order.addOnPrice); // compute in backend
          } else { return order }
        });

        setOrders([...orders]);
      } else {

        const addOnPrice = getPrice.addOn(addOn);
        const newMenuItem = {
          ...menuItem,
          sizeId: size,
          addOn: addOn,
          addOnPrice: addOnPrice,
          menuCategoryId: menuCategoryId,
          price: milkTeaPrice,
          quantity: 1
        };

        setTotalPrice(totalPrice + newMenuItem.price + newMenuItem.addOnPrice); // compute in backend
        setOrders([...orders, newMenuItem]);

      }

    } else {

      const orderExists = getExistingOrder.menu(menuItem.id, menuCategoryId) ? getExistingOrder.menu(menuItem.id, menuCategoryId) : null;

      if (orderExists) {

        const menuPrice = getPrice.menu(menuItem.id, menuCategoryId);
        orders.map(order => {
          if (order === orderExists) {
            const priceBefore = totalPrice - order.price;
            order = {
              ...order,
              quantity: order.quantity += 1,
              price: order.price = menuPrice * order.quantity
            };

            setTotalPrice(priceBefore + order.price); // compute in backend

          } else { return order; }
        })

        setOrders([...orders]);

      } else {

        const menuPrice = getPrice.menu(menuItem.id, menuCategoryId);
        const newMenuItem = {
          ...menuItem,
          menuCategoryId: menuCategoryId,
          price: menuPrice,
          quantity: 1
        };

        setOrders([...orders, newMenuItem]);
        setTotalPrice(totalPrice + menuPrice); // compute in backend
        
      }
    }
  };

  const deductToBill = (menuItem, menuCategoryId, addOn, size) => {
    if (validations.isMilkTea(menuCategoryId)) {
      const milkTeaPrice = getPrice.milkTea(menuCategoryId, size);
      const addOnPrice = getPrice.addOn(addOn);
      const orderExists = getExistingOrder.milkTea(menuItem.id, menuCategoryId, size, addOn);

      if (orderExists) {
        orders.map(order => {
          if (order === orderExists) {
            const priceBefore = totalPrice - order.price - order.addOnPrice;
            order = {
              ...order,
              quantity: order.quantity -= 1,
              price: order.price = milkTeaPrice * order.quantity,
              addOnPrice: order.addOnPrice = addOnPrice * order.quantity
            };
            setTotalPrice(priceBefore + order.price + order.addOnPrice); // compute in backend
          } else {
            return order;
          }
        });
        setOrders([...orders]);
      } else {
        const milkTeaPrice = getPrice.milkTea(menuCategoryId, size);
        const addOnPrice = getPrice.addOn(addOn);
        const newMenuItem = {
          ...menuItem,
          sizeId: size,
          addOn: addOn,
          addOnPrice: addOnPrice,
          menuCategoryId: menuCategoryId,
          price: milkTeaPrice,
          quantity: 1
        };
        setTotalPrice(totalPrice + milkTeaPrice + addOnPrice); // compute in backend
        setOrders([...orders, newMenuItem]);
      }
    } else {
      const orderExists = getExistingOrder.menu(menuItem.id, menuCategoryId);

      if (orderExists) {
        const menuPrice = getPrice.menu(menuItem.id, menuCategoryId);
        orders.map(order => {
          if (order === orderExists) {
            const priceBefore = totalPrice - order.price;
            order = {
              ...order,
              quantity: order.quantity -= 1,
              price: order.price = menuPrice * order.quantity
            };
            setTotalPrice(priceBefore + order.price); // compute in backend
          } else {
            return order;
          }
        });
        setOrders([...orders]);
      } else {
        const menuPrice = getPrice.menu(menuItem.id, menuCategoryId);
        const newMenuItem = {
          ...menuItem,
          menuCategoryId: menuCategoryId,
          price: menuPrice,
          quantity: 1
        };
        setOrders([...orders, newMenuItem]);
        setTotalPrice(totalPrice + menuPrice); // compute in backend
      }
    }
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ height: '100%' }}>
      <Grid item container spacing={2} md={8}>
        <Grid item md={12}>
          <Typography
            mt={2}
            sx={styles.overviewText}
            variant='h6'>
            {`Welcome, ${sliceStates.userInfo.firstName}!`}
          </Typography>
          {/* Category */}
          <Grid item md={12} mt={2}>
            <ToggleButtonGroup
              sx={styles.toggleBtnGroup}
              exclusive
              value={category}
              onChange={handleCategory}>
              {itemCategory.map((category) => (
                <ToggleButton key={category.id} value={category.value}>
                  {category.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Grid>
          {/* Menu Item */}
          <Grid item container spacing={2} md={12} mt={1} maxHeight={550} overflow={'auto'}>
            {sliceStates.menuInfo.map((menuItem, index) => (
              menuItem.menuCategoryId === category ?
                <Grid item key={index} md={4}>
                  <MenuCard
                    sliceStates={sliceStates}
                    menuItem={menuItem}
                    addToBill={addToBill}
                    validations={validations}
                    getPrice={getPrice} />
                </Grid> : null
            ))}
          </Grid>
        </Grid>
      </Grid>
      {/* Bill */}
      <Bill
        dispatch={dispatch}
        sliceStates={sliceStates}
        orders={orders} setOrders={setOrders}
        totalPrice={totalPrice} setTotalPrice={setTotalPrice}
        validations={validations}
        addToBill={addToBill}
        deductToBill={deductToBill} 
        />
    </Grid>
  );
};

export default POS;