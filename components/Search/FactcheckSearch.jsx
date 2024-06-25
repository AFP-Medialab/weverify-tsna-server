import React, { useEffect } from "react";
import useMyStyles from "../shared/styles/useMyStyles";
import Box from "@mui/material/Box";
import OnClickInfo from "../shared/OnClickInfo/OnClickInfo"
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import FactcheckIcon from '../../images/SVG/Search/Factcheck_big.svg'
import HeaderTool from "../shared/HeaderTool/HeaderTool";
import { i18nLoadNamespace } from "../shared/languages/i18nLoadNamespace";
import { FACTCHECKSEARCH_PATH } from "../shared/languages/LanguagePaths";


const FactcheckSearch = () => {
  const classes = useMyStyles();
  const keyword = i18nLoadNamespace(FACTCHECKSEARCH_PATH);
  const keywordAllTools = i18nLoadNamespace("/components/NavItems/tools/Alltools");
  const tsvinfo = "/components/Shared/OnClickInfo";
  const keywordInfo = i18nLoadNamespace(tsvinfo);

  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://cse.google.com/cse.js?cx=" + keyword("factcheck_search_engines");
    script.async = true;

    if (script.src !== "https://cse.google.com/cse.js?cx=") {
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      }
    }

  }, [keyword]);


  return (
    <div className={classes.all}>
      <HeaderTool name={keywordAllTools("navbar_factcheck")} description={keywordAllTools("navbar_factcheck_description")} icon={<FactcheckIcon style={{ fill: "#00926c" }} />} />

      <Card>
        <CardHeader
          title={keyword("navbar_factcheck")}
          className={classes.headerUpladedImage}
        />
        <div className={classes.root2}>
          <div className="gcse-search"></div>
          <Box m={1} />
          <OnClickInfo keyword={"factcheck_tip"} keywordInfo={keywordInfo} tsvInfo={tsvinfo}/>
        </div>

      </Card>

    </div>);
};
export default FactcheckSearch;