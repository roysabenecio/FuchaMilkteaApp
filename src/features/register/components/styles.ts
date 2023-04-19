import { css } from "@emotion/react";
import { default as color } from '../../../util/color-palette';

const loginCss = {

    parent: css({
        marginTop: '15%',
        "@media (min-width: 900px)": {
            display: 'flex',
            textAlign: 'left',
            margin: '0 auto',
        }
    }),
    formDiv: css({
        margin: '0 auto',
        "@media (min-width: 900px)": {
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            left: '0',
            bottom: '0',
            top: '0',
            width: '45%',
        }
    }),
    logoDiv: css({
        padding: '1rem',
        textAlign: 'center',
    }),
    logoImg: css({
        objectFit: 'cover',
        width: '70px',
        height: '70px',
    }),
    loginTitle: css({
        marginBottom: '.3rem',
        fontWeight: '700',
        fontSize: '1.7rem',
    }),
    formFields: css({
        width: '85%',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        "@media (min-width: 900px)": {
            display: 'flex',
            flexDirection: 'column',
            width: '75%',
        }
    }),
    textField: css({
        'label.Mui-focused': {
            color: color.primaryRedColor,
        },
        ".MuiOutlinedInput-root.Mui-focused": {
            " > fieldset": {
                border: '1.5px solid',
                borderColor: color.primaryRedColor
            }
        }
    }),
    button: css({
        backgroundColor: color.primaryRedColor,
        fontWeight: 'bold',
        textTransform: 'none',
        marginTop: '1rem',

        ":hover": {
            backgroundColor: color.whiteBgColor,
            color: color.primaryRedColor,
            border: '2px solid',
            borderColor: color.primaryRedColor
        }
    }),
    displayImgPane: css({
        display: 'none',
        "@media (min-width: 900px)": {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: color.darkRedColor,
            position: 'absolute',
            right: '0',
            bottom: '0',
            top: '0',
            width: '50%',
            borderTopLeftRadius: '40px',
            borderBottomLeftRadius: '40px',
        }
    }),
    displayImgDiv: css({
        padding: '1rem',
        textAlign: 'center',
    }),
    displayImg: css({
        objectFit: 'cover',
        width: '75%',
        height: '75%',
        margin: '1rem',
    }),
}

export default loginCss

