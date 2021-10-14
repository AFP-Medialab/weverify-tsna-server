import Head from "next/head";
import React from "react";
import Layout from "../components/layout";
import TwitterSna from "../components/SNA/TwitterSna/TwitterSna";
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
const tsv = "/components/NavItems/tools/SNA.tsv";

const TwitterSnaIndex = () => {
  const keyword = useLoadLanguage(tsv);
  return (
    <Layout title={keyword("twitter_sna_title")}>
    <Head>
      <title>WeVerify Twitter SNA</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main>        
      <TwitterSna />
    </main>
    <footer>
      <Footer />
    </footer>
    <style jsx>{`
      main {
        padding: 7rem 0;
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

export default TwitterSnaIndex;
