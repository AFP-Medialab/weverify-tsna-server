import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CustomTable from "../../CustomTable/CustomTable";
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import { setTweetsDetailPanel } from "../../../../redux/actions/tools/twitterSnaActions";
import {setCSVHistoview} from "../../../../redux/actions/tools/csvSnaActions";

//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/CsvFb.tsv";

export default function HistoTweetsTable(props) {
  
  const dispatch = useDispatch();
  const request = useSelector((state) => state.twitterSna.request);
  const snatype = useSelector((state) => state.csvSna.result.snaType);
  const keyword = useLoadLanguage(snatype.tsv);
  const typer =useSelector((state) => state.csvSna.result.snaType.snaType)
  console.log("PROPS ",typer)
  var goToAction;

  if(typer=="INSTA"){
    goToAction = [
      {
       icon: InstagramIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
          window.open("https://www.instagram.com/", "_blank");
        },
      },
    ];
  }
  else {
    goToAction = [
      {
       icon: FacebookIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
          window.open("https://facebook.com/", "_blank");
        },
      },
    ];
  }


  


  function downloadClick(csvArr, name, histo, type = "Tweets_") {

    let encodedUri = encodeURIComponent(csvArr);
    let link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodedUri);
    link.setAttribute(
      "download",
      type +
        name +
        "_" +
        request.keywordList.join("&") +
        "_" +
        (!histo ? request.from + "_" + request.until : "") +
        ".csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  

  return (
    <div>
      <Grid
        container
        justify="space-between"
        spacing={2}
        alignContent={"center"}
      >
        <Grid item>
          <Button
          
            variant={"contained"}
            color={"secondary"}
            
            onClick={() => 
              dispatch(
                setCSVHistoview(
                  props.from, null
                  )) 
            }
            
          >
            {keyword("twittersna_result_hide")}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant={"contained"}
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
        title={keyword("twittersna_result_slected_tweets")}
        colums={props.data.columns}
        data={props.data.data}
        actions={goToAction}
      />
    </div>
  );
}
