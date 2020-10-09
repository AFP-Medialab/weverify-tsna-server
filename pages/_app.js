import React from 'react';

import { wrapper } from "../redux";
import {Provider} from "react-redux"
import '../styles/global.css';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { MuiThemeProvider } from "@material-ui/core";
import { useStore } from "react-redux";
import "react-datetime/css/react-datetime.css";


const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#fff',
        main: 'rgb(0,170,180)',
        dark: '#00707e'
      },
      secondary: {
        main: '#ffaf33',
      },
      error: {
        main: 'rgb(198,57,59)'
      }
    },
    typography: {
      useNextVariants: 'true',
    },
    overrides: {
      MuiButton: {
        containedPrimary: {
          color: 'white',
        },
      },
      MuiIcon: {
        root: {
          overflow: "visible"
        }
      }
    },
    zIndex: {
      drawer: 1099
    }
  });


const MyApp = ({ Component, pageProps }) => {
  
    const store = useStore(pageProps.initialReduxState);
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <Component {...pageProps} />
                </MuiThemeProvider>
            </Provider>
        );
};


export default wrapper.withRedux(MyApp);
