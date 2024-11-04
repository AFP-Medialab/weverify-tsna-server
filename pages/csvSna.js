import Head from "next/head";
import React from "react";
import Layout from "../components/layout";
import Footer from "../components/shared/Footer/Footer";
import CrowdTangleSnaComponent from "../components/SNA/CrowdTangleSna/CrowdTangleSnaComponent";
import { i18nLoadNamespace } from "../components/shared/languages/i18nLoadNamespace";
import { SNA_PATH } from "../components/shared/languages/LanguagePaths";


const CsvSnaIndex = () => {
  const keyword = i18nLoadNamespace(SNA_PATH);
  return (
    <Layout title={keyword("ct_sna_title")}>
      <Head>
        <title>WeVerify Web Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
       <CrowdTangleSnaComponent />
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

export default CsvSnaIndex;
