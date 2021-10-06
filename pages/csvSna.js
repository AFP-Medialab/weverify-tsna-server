import Head from "next/head";
import React from "react";
import Layout from "../components/layoutCSV";
import CrowdTangleSnaComponent from "../components/shared/CrowdTangleSna/CrowdTangleSnaComponent"
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";


const CsvSnaIndex = () => {
  const keyword = useLoadLanguage(tsv);
  return (
    <Layout title={keyword("fbinsta_sna_title")}>
      <Head>
        <title>Csv Reader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
       <CrowdTangleSnaComponent />
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
  );
};

export default CsvSnaIndex;
