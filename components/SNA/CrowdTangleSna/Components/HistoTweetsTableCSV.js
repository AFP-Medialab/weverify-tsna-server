import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CustomTable from "../../../shared/CustomTable/CustomTable";
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import {setCSVHistoview} from "../../../../redux/actions/tools/crowdTangleSnaActions";

//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/CsvFb.tsv";

export default function HistoTweetsTable(props) {
  
  const dispatch = useDispatch();
  const snatype = useSelector((state) => state.ctSna.result.snaType);
  const keyword = useLoadLanguage(snatype.tsv);
  const typer =useSelector((state) => state.ctSna.result.snaType.snaType)

  var goToAction;

  if(typer=="INSTA"){
    goToAction = [
      {
       icon: InstagramIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
          window.open(rowData.link.props.href, "_blank");
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
         window.open(rowData.link.props.href, "_blank");
        },
      },
    ];
  }


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
          
            variant={"contained"}
            color={"secondary"}
            
            onClick={() => 
              
                //dispatch(setTweetsDetailPanel(props.from, null)) ,
              dispatch(
                setCSVHistoview(
                  props.from, null
                  )) 
            }
            
          >
            {keyword("twittersna_result_hide")}
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
