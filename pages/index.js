import Head from "next/head";
import React from "react";
import TwitterSna from "../components/shared/TwitterSna/TwitterSna";
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";
import Typical from 'react-typical';
import Intro from './intro/Text';
import {Helmet} from 'react-helmet';
import {makeStyles} from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import Header from './intro/Header';
import BottomPart from './intro/BottomPart';



const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundImage: `url(${'images/intro_image.jpeg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
}));
export default function App() {

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header />
      <BottomPart />
     
     


    </div>
  );
}
