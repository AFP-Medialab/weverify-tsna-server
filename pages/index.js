import Head from "next/head";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout";
import AllTools from "../components/Navigation/AllTools";
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
import TwitterSnaIcon from "../images/SVG/DataAnalysis/Twitter_sna.svg"
import TwitterSnaIconBig from "../images/SVG/DataAnalysis/Twitter_sna_big.svg"
import CsvSnaIcon  from "../images/SVG/DataAnalysis/CSV_SNA.svg"
import CsvSnaIconBig from "../images/SVG/DataAnalysis/CSV_SNA_big.svg"

const tsv = "/components/NavItems/tools/TwitterSna.tsv";



const Index = () => {
  const keyword = useLoadLanguage(tsv);
  const drawerValue = useSelector(state => state.tool.selected);
  
  
  
  const drawerItems = [
    {
      title: "navbar_twitter_sna",
      description: "navbar_twitter_sna_description",
      icon: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title="Twitter SNA"/>,
      iconColored: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA"/>,
      iconBig: <TwitterSnaIconBig width="75px" height="75px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />,
      tsvPrefix: "twitter_sna",
      path: "twitterSna"
  },
  {
    title: "navbar_csv_sna",
    description: "navbar_csv_sna_description",
    icon: <CsvSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title="CSV SNA"/>,
    iconColored: <CsvSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="CSV SNA"/>,
    iconBig: <CsvSnaIconBig width="75px" height="75px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />,
    tsvPrefix: "csv_sna",
    path: "csvSna"
  },
  ];
  return (
    <Layout title={"SOCIAL NETWORK ANALYSIS"}>
      <Head>
        <title>WeVerify Twitter SNA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>        
        <AllTools tools={drawerItems}/>
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
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
};

export default Index;
