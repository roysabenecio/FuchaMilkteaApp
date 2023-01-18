import { height } from '@mui/system';
import { default as color } from '../../../util/color-palette';

export default {
    overviewCard: {
        padding: '1em',
    },
    iconWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    billPrice: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right',
        justifyContent: 'right',
        m: 1
    },

    counter: {
        width: '30%',
        alignItems: 'right',
        border: '2px solid rgba(0, 0, 0, 0.2)',
        borderRadius: '5px'
    },

    removeBtn: {
        'MuiButtonBase-root': {
            width: .5,
        }
    },

    overviewText: {
        color: 'rgba(0, 0, 0, 0.70)',
        fontWeight: 700,
    },

    toggleBtnGroup: {
        '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            mr: 2,
            fontWeight: 600,
        },

    },
    qtyButton : {
        border: 'none',
        cursor: 'pointer',
    },
    changeField : {
        width: 50,
        textAlign: 'right',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'right',
        justifyContent: 'right'
    },

}
