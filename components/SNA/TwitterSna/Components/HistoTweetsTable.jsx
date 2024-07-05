import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TwitterIcon from "@mui/icons-material/Twitter";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomTable from "../../../shared/CustomTable/CustomTable";
import { getLabelsColumns } from "../../../shared/lib/StringUtil";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import {widgetSimpleFilename} from "../Hooks/tsnaUtils"
import { setTweetsDetail } from "../TwitterSna";
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";
import { TWITTERSNA_PATH } from "../../../shared/languages/LanguagePaths";
import { TW_SNA_TYPE } from "../../../shared/hooks/SnaTypes";

export default function HistoTweetsTable(props) {
  const dispatch = useDispatch();
  const keyword = i18nLoadNamespace(TWITTERSNA_PATH);
  const request = useSelector((state) => state.twitterSna.request);

  function downloadClick(csvArr, name, histo, type = "Tweets_") {
    let encodedUri = encodeURIComponent(csvArr);
    let link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodedUri);
    link.setAttribute(
      "download",
      type +
        name +
        "_" + widgetSimpleFilename(request) +
        ".csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  let goToTweetAction = [
    {
      icon: () => <TwitterIcon style={{ color: "#00acee" }}/>,
      tooltip: keyword("twittersna_result_go_to_tweet"),
      onClick: (event, rowData) => {
        window.open(rowData.link, "_blank");
      },
    },
  ];

  return (
    <div 
      style={{ 
        padding: "16px",
        margin: "16px", 
        backgroundColor: "#fbfbfb",
        borderRadius: "15px"
        }}>
      <Grid
        container
        justifyContent="space-between"
        spacing={2}
        alignContent={"center"}
      >
        <Grid item>
          <Box ml={1}>
          <Button
            startIcon={<ExpandLessIcon />}
            color={"primary"}
            onClick={() => setTweetsDetail(props.from, null, dispatch)}
          >
            {keyword("twittersna_result_hide")}
          </Button>
          </Box>
        </Grid>
        <Grid item>
          <Button
            startIcon={<SaveAltIcon />}
            color={"primary"}
            onClick={() =>
              downloadClick(
                props.data.csvArr,
                props.data.data[0].date.split(" ")[0],
                true
              )
            }
          >
            {keyword("twittersna_result_download")}
          </Button>
        </Grid>
      </Grid>
      <Box m={2} />
      <CustomTable
        title={"twittersna_result_slected_tweets"}
        //columns={getLabelsColumns(keyword, props.data.columns)}
        columns = {props.data.columns}
        data={props.data.data}
        actions={goToTweetAction}
        type = {TW_SNA_TYPE}
      />
    </div>
  );
}
