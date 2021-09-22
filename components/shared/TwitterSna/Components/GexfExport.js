import { Paper } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import useMyStyles from "../../styles/useMyStyles";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import OnClickInfo from "../../OnClickInfo/OnClickInfo";
import React, { useEffect, useState } from "react";
import SaveIcon from "@material-ui/icons/Save";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";

//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

export default function GexfExport(props) {
  const keyword = useLoadLanguage(tsv);
  const classes = useMyStyles();
  const request = useSelector((state) => state.twitterSna.request);

  const gexfExport = useSelector((state) => state.twitterSna.gexfExport);

  const [state, setState] = useState({
    result: props.result,
  });
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {keyword("export_graph_title")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {gexfExport && props.request.userList.length === 0 && props.result && (
          <Paper style={{ width: "100%" }}>
            <Toolbar>
              <div style={{ flexGrow: 1 }} />
              {gexfExport &&
                gexfExport.map((gexfRes, index) => {
                  return (
                    <Button
                      key={index}
                      aria-label="download"
                      disabled={_.isEmpty(gexfExport)}
                      startIcon={<SaveIcon />}
                      href={gexfExport ? gexfRes.getUrl : undefined}
                      tooltip={keyword("twittersna_result_download")}
                    >
                      {keyword("twittersna_result_download") +
                        " " +
                        gexfRes.title}
                    </Button>
                  );
                })}
            </Toolbar>
            <Box pb={2}>
              <Box alignItems="center" justifyContent="center" width={"100%"}>
                <div style={{ margin: 20 }}>
                  <Grid
                    container
                    justify="space-between"
                    spacing={2}
                    alignContent={"center"}
                  >
                    {gexfExport &&
                      gexfExport.map((gexfRes, index) => {
                        return (
                          <Grid item key={Math.random()}>
                            <Button
                              key={index}
                              variant={"contained"}
                              color={"primary"}
                              startIcon={<BubbleChartIcon />}
                              disabled={_.isEmpty(gexfExport)}
                              href={
                                gexfExport
                                  ? gexfRes.visualizationUrl
                                  : undefined
                              }
                              target="_blank"
                              rel="noopener"
                              tooltip={gexfExport ? gexfRes.message : undefined}
                            >
                              {
                                gexfRes.title /* {keyword("twittersna_result_view_graph")} */
                              }
                            </Button>
                          </Grid>
                        );
                      })}
                  </Grid>
                </div>
              </Box>
            </Box>
            <Box m={1} />
            <OnClickInfo keyword={"twittersna_export_graph_tip"} />
          </Paper>
        )}
        {!gexfExport &&
          props.result.tweetCount &&
          props.result.tweetCount.count !== "0" && (
            <CircularProgress className={classes.circularProgress} />
          )}
      </AccordionDetails>
    </Accordion>
  );
}
