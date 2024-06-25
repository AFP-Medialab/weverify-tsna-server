import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../../shared/CustomTable/CustomTable";
import { getLabelsColumns } from "../../../shared/lib/StringUtil";
import { setHistoview } from "../CrowdTangleSnaComponent";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";
import { CROWDTANGLE_PATH, SNA_PATH } from "../../../shared/languages/LanguagePaths";

export default function HistoTweetsTable(props) {
  
  const dispatch = useDispatch();
  const type = useSelector((state) => state.sna.type)
  const keyword = i18nLoadNamespace(CROWDTANGLE_PATH);
  const keywordSNA = i18nLoadNamespace(SNA_PATH);
 
  var goToAction = [
    {
      icon: (type === "INSTA" ? InstagramIcon: FacebookIcon),
      tooltip: keyword("ct_result_go_to_tweet"),
      onClick: (event, rowData) => {
        window.open(rowData.link.props.href, "_blank");
      },
    },
  ];

  var columns = getLabelsColumns(keyword, props.data.columns);

  return (
    <div>
      <Grid
        container
        justifyContent="space-between"
        spacing={2}
        alignContent={"center"}
      >
        <Grid item>
          <Button
            startIcon={<ExpandLessIcon />}
            color={"primary"}
            onClick={() =>  
              setHistoview(props.from, null, dispatch) 
            }
            >
            {keywordSNA("sna_result_hide")}
          </Button>
        </Grid>
       
      </Grid>
      <Box m={2} />
      <CustomTable
        title={keyword("sna_result_selected_posts")}
        columns={columns}
        data={props.data.data}
        actions={goToAction}
      />
    </div>
  );
}
