import React, { useEffect } from "react";
import useMyStyles from "../shared/styles/useMyStyles";
import Box from "@mui/material/Box";
import useLoadLanguage from "../shared/hooks/useRemoteLoadLanguage";
import OnClickInfo from "../shared/OnClickInfo/OnClickInfo";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import XNetworkIcon from "../../images/SVG/Search/Xnetwork_big.svg";
import HeaderTool from "../shared/HeaderTool/HeaderTool";

const XNetwork = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage("/components/NavItems/tools/XNetwork.tsv");
  const keywordAllTools = useLoadLanguage(
    "/components/NavItems/tools/AllTools.tsv",
  );
  const tsvinfo = "/components/Shared/OnClickInfo.tsv";

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cse.google.com/cse.js?cx=000556916517770601014:k08mmqlnmih";
    script.async = true;

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className={classes.all}>
      <HeaderTool
        name={keywordAllTools("navbar_xnetwork")}
        description={keywordAllTools("navbar_xnetwork_description")}
        icon={<XNetworkIcon style={{ fill: "#51A5B2" }} />}
      />

      <Card>
        <CardHeader
          title={keyword("navbar_xnetwork")}
          className={classes.headerUpladedImage}
        />
        <div className={classes.root2}>
          <div className="gcse-search"></div>
          <Box m={1} />
          <OnClickInfo keyword={"xnetwork_tip"} tsvInfo={tsvinfo} />
        </div>
      </Card>
    </div>
  );
};
export default XNetwork;
