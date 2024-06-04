import React from 'react';
import {Provider} from "react-redux"
import '../styles/global.css';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import { useStore } from "../redux";
import { persistStore } from 'redux-persist';
import "react-datetime/css/react-datetime.css";
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import * as ga from '../lib/ga';

const theme = createTheme({
    palette: {
      primary: {
        light: '#fff',
        main: '#00926c',
        dark: '#00926c'
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
  const router = useRouter()

    useEffect(() => {
      document.body.style.backgroundColor = "#fafafa";
    }, [])
  
    useEffect(() => {
      const handleRouteChange = (url) => {
        ga.pageview(url)
      }
      //When the component is mounted, subscribe to router changes
      //and log those page views
      router.events.on('routeChangeComplete', handleRouteChange)
  
      // If the component is unmounted, unsubscribe
      // from the event with the `off` method
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }, [router.events])

    const store = useStore(pageProps.initialReduxState)
    const persistor = persistStore(store, {}, function () {
      persistor.persist()
    })
        return (
          <Provider store={store}>
              <ThemeProvider theme={theme} >
                <PersistGate loading={<div>loading</div>} persistor={persistor}>
                    <Component {...pageProps} />
                  </PersistGate>
              </ThemeProvider>
          </Provider>
        );
};


export default MyApp;
