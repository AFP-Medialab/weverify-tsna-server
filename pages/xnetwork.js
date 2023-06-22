import Head from "next/head";
import React from "react";
import Layout from "../components/layout";
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
import XNetworkSearch from "../components/Search/XNetworkSearch"
const tsv = "/components/NavItems/tools/XNetwork.tsv";


const XNetwork = () => {
  const keyword = useLoadLanguage(tsv);
  return (
    <Layout title={keyword("navbar_xnetwork")}>
      <Head>
        <title>WeVerify Web Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <XNetworkSearch />
      </main>
      <footer>
        <Footer type={"afp"}/>
      </footer>
      <style jsx>{`
        main {
          padding: 7rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          background-color: #fafafa!important;
        }
        footer {
          width: 100%;
          height: 100px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
};

export default XNetwork;
