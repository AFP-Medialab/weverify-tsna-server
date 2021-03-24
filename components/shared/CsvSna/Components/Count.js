import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import useMyStyles from "../../styles/useMyStyles";
import React, { useEffect, useState } from "react";
import OnClickInfo from "../../OnClickInfo/OnClickInfo";

export default function Count({ result },  onClickInfoLabel) {
  console.log("label ", onClickInfoLabel);
  const classes = useMyStyles();
  const [countVisible, setCountVisible] = useState(true);
  console.log("echo FB ", JSON.stringify(result));
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
    <Accordion
      expanded={countVisible}
      onChange={() => setCountVisible(!countVisible)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={"panel0a-content"}
        id={"panel0a-header"}
      >
        <Typography className={classes.heading}>
          {
            //keyword("tweetCounter_title")
          }
          Publisher
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box alignItems="center" justifyContent="center" width={"100%"}>
          <Grid
            container
            justify="space-around"
            spacing={2}
            alignContent={"center"}
          >
            <Grid item>
              <Typography variant={"h6"}>Publications</Typography>
              <Typography variant={"h2"}>{result.countSna.count}</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>Total interactions</Typography>
              <Typography variant={"h2"}>
                {result.countSna.total_interactions}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>Likes</Typography>
              <Typography variant={"h2"}>{result.countSna.likes}</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>Comments</Typography>
              <Typography variant={"h2"}>{result.countSna.comments}</Typography>
            </Grid>
            {result.countSna.shares && (
              <Grid item>
                <Typography variant={"h6"}>Shares</Typography>
                <Typography variant={"h2"}>{result.countSna.shares}</Typography>
              </Grid>
            )}
            <Box m={3} />
            {
            <OnClickInfo keyword={onClickInfoLabel} />
            }
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
