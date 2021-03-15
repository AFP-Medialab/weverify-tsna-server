import Head from "next/head";
import React from "react";
import Layout from "../components/layout";
import TwitterSna from "../components/shared/TwitterSna/TwitterSna";
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    backgroundImage: `url(${'images/background_twitter&CSV.jpg'})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
}));

const Index = () => {
  const classes = useStyles();
  const keyword = useLoadLanguage(tsv);
  return (

    <div className={classes.root}>
     <Layout title={keyword("twitter_sna_title")}>
      <Head>
        <title>WeVerify Twitter SNA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TwitterSna keyword={keyword} />
      
      </main>
      <footer>
        <Footer />
      </footer>
      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Layout>
    </div>
    
  );
};

export default Index;
