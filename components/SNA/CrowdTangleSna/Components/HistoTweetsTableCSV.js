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
import { getLabelsColumns } from "../../../shared/lib/StringUtil";

export default function HistoTweetsTable(props) {
  
  const dispatch = useDispatch();
  const type = useSelector((state) => state.sna.type)
  const tsv = useSelector((state) => state.sna.tsv)
  const keyword = useLoadLanguage(tsv);
  const keywordSNA = useLoadLanguage("/components/NavItems/tools/SNA.tsv");
 
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
            variant={"contained"}
            color={"secondary"}
            onClick={() =>  
              dispatch(setCSVHistoview(props.from, null)) 
            }
            >
            {keywordSNA("sna_result_hide")}
          </Button>
        </Grid>
       
      </Grid>
      <Box m={2} />
      <CustomTable
        title={keyword("ct_result_selected_posts")}
        columns={columns}
        data={props.data.data}
        actions={goToAction}
      />
    </div>
  );
}
