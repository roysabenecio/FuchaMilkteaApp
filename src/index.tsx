import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { SnackbarProvider } from 'notistack';
import store from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './app';
import theme from './theme';

import "@fontsource/poppins";

ReactDOM.render(
  <SnackbarProvider
    maxSnack={3}
    anchorOrigin={{
      horizontal: "right",
      vertical: "top"
    }}>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider >
    </Provider>
  </SnackbarProvider>
  ,
  document.getElementById('root')
);

