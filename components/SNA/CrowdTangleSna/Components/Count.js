import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import useMyStyles from "../../../shared/styles/useMyStyles";
import React, { useEffect, useState } from "react";
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import {useSelector} from "react-redux";

export default function Count({ result}) {
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
            keyword("ct_counter_title")
          }
          
        </Typography>
      </AccordionSummary>
      <AccordionDetails>

        <Box alignItems="center" justifyContent="center" width={"100%"}>
          <Grid
            container
            justifyContent="space-around"
            spacing={2}
            alignContent={"center"}
          >
            <Grid item>
              <Typography variant={"h6"}>{keyword("ct_sna_publications")}</Typography>
              <Typography variant={"h2"}>{result.countSna.count}</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>{keyword("ct_sna_total_interactions")}</Typography>
              <Typography variant={"h2"}>
                {result.countSna.total_interactions}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>{keyword("ct_sna_likes")}</Typography>
              <Typography variant={"h2"}>{result.countSna.likes}</Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>{keyword("ct_sna_comments")}</Typography>
              <Typography variant={"h2"}>{result.countSna.comments}</Typography>
            </Grid>
            {result.countSna.shares && (
              <Grid item>
                <Typography variant={"h6"}>{keyword("ct_sna_shares")}</Typography>
                <Typography variant={"h2"}>{result.countSna.shares}</Typography>
              </Grid>
            )}

            </Grid>
            
            <OnClickInfo keyword={"ct_sna_timeline_tip"} />
        </Box>
        

      </AccordionDetails>
    </Accordion>
  );
}
