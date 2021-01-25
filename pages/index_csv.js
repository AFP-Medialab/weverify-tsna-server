import Head from "next/head"
import React from 'react';
import Layout from '../components/layout';
import TwitterSna from '../components/shared/TwitterSna/TwitterSna';
import Footer from "../components/shared/Footer/Footer";
import useMyStyles from "../components/shared/styles/useMyStyles";


const Index = props => {
  const classes = useMyStyles();
  return (
    
      
        <Layout>
          <Head>
            <title>WeVerify CSV SNA</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <main>
          <TwitterSna />
          </main>
          <footer>
          <Footer/>
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
      
     
    );
};


export default Index;
