import { default as color } from '../../../util/color-palette';

export default {
    overviewCard: {
        padding: '1em',

    },
    actionBarWrapper: {
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'right',
        ml: 1,
        p: 3
    },
    overviewContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overviewIcon: {
        fontSize: '6ch',
        m: 1,
        color: color.secondaryRedColor
    },
    overviewTextWrap: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        pt: 1,
        lineHeight: 0
    },

    overviewText: {
        color: 'rgba(0, 0, 0, 0.70)',
        fontWeight: 700,
    },

    overviewSubText: {
        color: '#000000',
        fontWeight: 600,
        fontSize: '2em',
        padding: 0
    },

    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        bgcolor: 'white',
        border: '0px solid #000',
        borderRadius: 1,
        p: 4,
    },

    qtyModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgcolor: 'white',
        border: '0px solid #000',
        borderRadius: 1,
        p: 4,
    },

    iconBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    numberInputField: {
        "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
        },
        "& input[type=number]": {
            MozAppearance: "textfield",
        },

    }

}
