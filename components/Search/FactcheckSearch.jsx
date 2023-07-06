import React, { useEffect } from "react";
import useMyStyles from "../shared/styles/useMyStyles";
import Box from "@mui/material/Box";
import useLoadLanguage from "../shared/hooks/useRemoteLoadLanguage";
import OnClickInfo from "../shared/OnClickInfo/OnClickInfo";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import FactcheckIcon from "../../images/SVG/Search/Factcheck_big.svg";
import HeaderTool from "../shared/HeaderTool/HeaderTool";

const FactcheckSearch = () => {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(
    "/components/NavItems/tools/FactcheckSearch.tsv",
  );
  const keywordAllTools = useLoadLanguage(
    "/components/NavItems/tools/AllTools.tsv",
  );
  const tsvinfo = "/components/Shared/OnClickInfo.tsv";

  useEffect(() => {
    const script = document.createElement("script");

    script.src =
      "https://cse.google.com/cse.js?cx=000556916517770601014:" +
      keyword("factcheck_search_engines");
    script.async = true;

    if (
      script.src !== "https://cse.google.com/cse.js?cx=000556916517770601014:"
    ) {
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [keyword]);

  return (
    <div className={classes.all}>
      <HeaderTool
        name={keywordAllTools("navbar_factcheck")}
        description={keywordAllTools("navbar_factcheck_description")}
        icon={<FactcheckIcon style={{ fill: "#51A5B2" }} />}
      />

      <Card>
        <CardHeader
          title={keyword("navbar_factcheck")}
          className={classes.headerUpladedImage}
        />
        <div className={classes.root2}>
          <div className="gcse-search"></div>
          <Box m={1} />
          <OnClickInfo keyword={"factcheck_tip"} tsvInfo={tsvinfo} />
        </div>
      </Card>
    </div>
  );
};
export default FactcheckSearch;
