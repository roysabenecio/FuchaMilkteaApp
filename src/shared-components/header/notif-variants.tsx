import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { setOpenAddPurchaseRecord, setOpenAddPurchaseRecord1, setPurchaseRecordNotifInfo } from '../../features/suppliers/slice';
import { setQuantityModal, setRow } from '../../features/inventory/slice';
// import moment from 'moment';
import {
    Typography,
    Box,
    MenuItem,
    Stack
} from "@mui/material"
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';

export const WarningNotif = ({ index, content, description, time, handleClose, clearNotifBadge }) => {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stockInfo } = useSelector(state => state.inventory);
    let stockNotif = stockInfo.find(stock => stock.id === index);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    const clearNotif = () => {
        if (userInfo.role === "Cashier") {
            setIsNotifClicked(true);
            handleClose();
        }
        else {
            // navigate("/inventory");
            // dispatch(setRow(stockNotif));
            // dispatch(setQuantityModal(true));
            navigate("/suppliers");
            dispatch(setOpenAddPurchaseRecord1(true));
            dispatch(setPurchaseRecordNotifInfo(stockNotif));
            setIsNotifClicked(true);
            handleClose();
        }
    };

    return (
        <MenuItem
            divider
            key={index}
            onClick={clearNotif}
            sx={{ backgroundColor: isNotifClicked ? null : '#FFEED2' }}>
            <Box m={1} >
                <WarningRoundedIcon color="warning" />
            </Box>
            <Stack m={1} direction="column">
                <Typography>
                    {content}
                </Typography>
                <Typography variant="caption">
                    {description}
                </Typography>
            </Stack>
            <Typography>
                {time}
            </Typography>
        </MenuItem>
    )
};

export const ErrorNotif = ({ index, content, description, time, handleClose, clearNotifBadge }) => {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stockInfo } = useSelector(state => state.inventory);
    let stockNotif = stockInfo.find(stock => stock.id === index);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    const clearNotif = () => {
        if (userInfo.role === "Cashier") {
            setIsNotifClicked(true);
            handleClose();
        }
        else {
            // navigate("/inventory");
            // dispatch(setRow(stockNotif));
            // dispatch(setQuantityModal(true));
            navigate("/suppliers");
            dispatch(setOpenAddPurchaseRecord1(true));
            dispatch(setPurchaseRecordNotifInfo(stockNotif));
            setIsNotifClicked(true);
            handleClose();
        }
    };
    return (
        <MenuItem
            divider
            key={index}
            onClick={clearNotif}
            sx={{ backgroundColor: isNotifClicked ? null : '#ffc3bf' }}>
            <Box m={1} >
                <ErrorRoundedIcon color="error" />
            </Box>
            <Stack m={1} direction="column">
                <Typography>
                    {content}
                </Typography>
                <Typography variant="caption">
                    {description}
                </Typography>
                <Typography>
                    {time}
                </Typography>
            </Stack>
        </MenuItem>
    )
};

export const OutNotif = ({ index, content, description, time, handleClose, clearNotifBadge }) => {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stockInfo } = useSelector(state => state.inventory);
    let stockNotif = stockInfo.find(stock => stock.id === index);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    const clearNotif = () => {
        if (userInfo.role === "Cashier") {
            setIsNotifClicked(true);
            handleClose();
        }
        else {
            navigate("/suppliers");
            dispatch(setOpenAddPurchaseRecord1(true));
            dispatch(setPurchaseRecordNotifInfo(stockNotif));
            setIsNotifClicked(true);
            handleClose();
        }
    };
    return (
        <MenuItem
            divider
            key={index}
            onClick={clearNotif}
            sx={{ backgroundColor: isNotifClicked ? null : '#f0f1f2' }}>
            <Box m={1} >
                <HighlightOffRoundedIcon color={'#6e6e6e'} />
            </Box>
            <Stack m={1} direction="column">
                <Typography>
                    {content}
                </Typography>
                <Typography variant="caption">
                    {description}
                </Typography>
                <Typography>
                    {time}
                </Typography>
            </Stack>
        </MenuItem>
    )
};

export const InfoNotif = ({ index, content, description, time, handleClose, clearNotifBadge }) => {
    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stockInfo } = useSelector(state => state.inventory);
    let stockNotif = stockInfo.find(stock => stock.id === index);
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    const clearNotif = () => {
        if (userInfo.role === "Cashier") {
            setIsNotifClicked(true);
            handleClose();
        }
        else {
            navigate("/inventory");
            dispatch(setRow(stockNotif));
            dispatch(setQuantityModal(true));
            setIsNotifClicked(true);
            handleClose();
        }
    };
    return (
        <MenuItem
            divider
            key={index}
            onClick={clearNotif}
            sx={{ backgroundColor: isNotifClicked ? null : '#c0dffa' }}>
            <Box m={1} >
                <InfoRoundedIcon color="info" />
            </Box>
            <Stack m={1} direction="column">
                <Typography>
                    {content}
                </Typography>
                <Typography variant="caption">
                    {description}
                </Typography>
                <Typography>
                    {time}
                </Typography>
            </Stack>
        </MenuItem>
    )
};