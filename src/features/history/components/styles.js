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
        color:'rgba(0, 0, 0, 0.70)',
        fontWeight: 700,  
    },

    overviewSubText: {
        color:'#000000',
        fontWeight: 600,
        fontSize:'2em',
        padding: 0
    },


}
