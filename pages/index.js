import Head from "next/head";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/layout";
import AllTools from "../components/Navigation/AllTools";
import Footer from "../components/shared/Footer/Footer";
import useLoadLanguage from "../components/shared/hooks/useRemoteLoadLanguage";
import TwitterSnaIcon from "../images/SVG/DataAnalysis/Twitter_sna.svg"

const tsv = "/components/NavItems/tools/TwitterSna.tsv";

const Index = () => {
  const keyword = useLoadLanguage(tsv);
  const drawerValue = useSelector(state => state.tool.selected);
  
  const drawerItems = [
    {
      title: "navbar_twitter_sna",
      description: "navbar_twitter_sna_description",
      icon: (drawerValue === 10) ? <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA"/>
          : <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title="Twitter SNA"/>,
      iconColored: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA"/>,
      tsvPrefix: "twitter_sna",
      path: "twitterSna"
  },
  ];
  return (
    <Layout keyword={keyword}>
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
