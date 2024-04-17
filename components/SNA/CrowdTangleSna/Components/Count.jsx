import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";



export default function Count({ result }) {
  const snatsv = useSelector((state) => state.sna.tsv);
  const keyword = useLoadLanguage(snatsv);
  const classes = useMyStyles();
  const [countVisible, setCountVisible] = useState(true);
  const [state, setState] = useState({
    result: result,
  });
  useEffect(() => {
    setState({
      ...state,
      result: result,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.countSna]);

  return (

    <Card>
      <CustomCardHeader title={keyword("ct_counter_title")} showHelp={true} helpText={"ct_sna_timeline_tip"} />

      <Box alignItems="center" justifyContent="center" width={"100%"} p={3}>
        <Grid
          container
          justifyContent="center"
          spacing={0}
          alignContent={"center"}
        >
          <Grid item style={{ minWidth: "160px", display: "flex", flexDirection: "column", alignItems: "center" }} >
            <Typography style={{ fontSize: "36px" }}>{result.countSna.count}</Typography>
            <Typography variant={"body1"} style={{ color: "#818B95", fontWeight: "600" }}>{keyword("ct_sna_publications")}</Typography>

          </Grid>
          <Grid item style={{ minWidth: "160px", display: "flex", flexDirection: "column", alignItems: "center" }} >

            <Typography style={{ fontSize: "36px" }}>{result.countSna.total_interactions}</Typography>
            <Typography variant={"body1"} style={{ color: "#818B95", fontWeight: "600" }}>{keyword("ct_sna_total_interactions")}</Typography>

          </Grid>
          <Grid item style={{ minWidth: "160px", display: "flex", flexDirection: "column", alignItems: "center" }} >

            <Typography style={{ fontSize: "36px" }}>{result.countSna.likes}</Typography>
            <Typography variant={"body1"} style={{ color: "#818B95", fontWeight: "600" }}>{keyword("ct_sna_likes")}</Typography>

          </Grid>
          <Grid item style={{ minWidth: "160px", display: "flex", flexDirection: "column", alignItems: "center" }} >

            <Typography style={{ fontSize: "36px" }}>{result.countSna.comments}</Typography>
            <Typography variant={"body1"} style={{ color: "#818B95", fontWeight: "600" }}>{keyword("ct_sna_comments")}</Typography>

          </Grid>
          {result.countSna.shares && (
            <Grid item style={{ minWidth: "160px", display: "flex", flexDirection: "column", alignItems: "center" }} >

              <Typography style={{ fontSize: "36px" }}>{result.countSna.shares}</Typography>
              <Typography variant={"body1"} style={{ color: "#818B95", fontWeight: "600" }}>{keyword("ct_sna_shares")}</Typography>

            </Grid>
          )}

        </Grid>
      </Box>


    </Card>
  );
}
