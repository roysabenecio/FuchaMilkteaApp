import { default as color } from '../../../util/color-palette';

export default {
    header: {
        height: '3em',
    },
    overviewCard: {
        padding: '1em',
        
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
    inventoryIcons: {
        fontSize: '5.5ch',
        m: 1,
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
        pt: 1
    },

    specialText: {
        color:'rgba(0, 0, 0, 0.70)',
        fontWeight: 700,  
        pt: 1
    },

    overviewSubText: {
        color:'#000000',
        fontWeight: 600,
        fontSize:'2em',
        padding: 0
    },
};