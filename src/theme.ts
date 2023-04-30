import { createTheme } from '@mui/material/styles';
import color from './util/color-palette';

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    loginBtn: true;
    delete: true;
  }
}

const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      'sans-serif',
    ].join(','),
    // fontFamily: 'Poppins, sans-serif',

  },
  mixins: {
    toolbar: {
      minHeight: 56,
    },
  },
  palette: {
    primary: {
      main: '#222222', // Black
    },
    background: {
      default: '#F5F5F5 ', // dirty white
    },
  },
});

export default createTheme(theme, {
  components: {
    // MuiCssBaseline:{
    //   stylesOverrides: `
    //   @font-face {
    //     font
    //   }
    //   `
    // },
    MuiTextField: {
      styleOverrides: {
        root: {
          // size: 'small'
        }
      },
      defaultProps: {
        size: 'small',
        margin: 'dense',
        required: true,
        fullWidth: true
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
        },
      },
      defaultProps: {
        color: 'inherit',
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          border: '1px solid !important',
          borderColor: '#F4F4F4',
          borderRadius: '4px !important',
          '&:not(:last-child)': {
            borderBottom: 0,
          },
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
          borderRadius: 7,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '.5rem',
          boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(2),
          fontWeight: theme.typography.fontWeightBold,
          textTransform: 'none',

        },
        textPrimary: {
          backgroundColor: '#ffffff',
        },
        contained: {
          boxShadow: '0 .125rem .25rem rgba(0,0,0,.075)',
        },
      },
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            backgroundColor: '#FFFFFF',
            color: '#980000',
            border: '2px solid #980000',
            '&:hover': {
              border: '2px solid #980000',
              backgroundColor: '#FFFFFF',
            }
          }
        },
        {
          props: { variant: 'contained' },
          style: {
            backgroundColor: "#018221",
            fontWeight: 'bold',
            border: '2px solid',
            borderColor: "#018221",
            '&:hover': {
              backgroundColor: color.whiteBgColor,
              color: "#018221",
              border: '2px solid',
              borderColor: "#018221"
            },
            "&.Mui-disabled": {
              backgroundColor: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26',
            }
          }
        },
        {
          props: { variant: 'menuCard' },
          style: {
            backgroundColor: color.whiteBgColor,
            color: "#018221",
            border: '2px solid',
            borderColor: "#018221",
            fontWeight: 'bold',
            // '&:hover': {
            //   backgroundColor: color.whiteBgColor,
            //   color: "#018221",
            //   border: '2px solid',
            //   borderColor: "#018221"
            // }
          }
        },
        {
          props: { variant: 'delete' },
          style: {
            backgroundColor: "#980000",
            color: "#FFFFFF",
            fontWeight: 'bold',
            // border: '2px solid',
            // borderColor: "#980000",
            '&:hover': {
              backgroundColor: color.whiteBgColor,
              color: "#980000",
              border: '2px solid',
              borderColor: "#980000"
            },
            "&.Mui-disabled": {
              backgroundColor: '#FFFFFF',
              color: 'rgba(0,0,0,0.26',
            }
          }
        },
        {
          props: { variant: 'tableBtn' },
          style: {
            backgroundColor: color.whiteBgColor,
            // backgroundColor: "#980000",
            color: "#FF8C00",
            fontWeight: 'bold',
            // border: '2px solid',
            // borderColor: "#FF8C00",
            // '&:hover': {
            //   backgroundColor: color.whiteBgColor,
            //   color: "#FF8C00",
            //   border: '2px solid',
            //   borderColor: "#FF8C00"
            // }
          }
        },
        {
          props: { variant: 'loginBtn' },
          style: {
            backgroundColor: "#980000",
            fontWeight: 'bold',
            border: '2px solid',
            borderColor: "#980000",
            color: color.whiteBgColor,
            '&:hover': {
              backgroundColor: color.whiteBgColor,
              color: "#980000",
              border: '2px solid',
              borderColor: "#980000"
            },
          }
        },
      ]
    },
    MuiCheckbox: {
      defaultProps: {
        color: 'warning',
      },
    },
    MuiRadio: {
      defaultProps: {
        color: 'warning',
      },
    },
    MuiBadge: {
      styleOverrides: {
        colorSecondary: {
          backgroundColor: '#676766',
        },
      },
    },
  },
});
