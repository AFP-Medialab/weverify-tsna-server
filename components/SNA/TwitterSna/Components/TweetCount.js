import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import React, { useEffect, useState } from "react";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../../shared/styles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";


export default function TweetCount(props) {
  const sna = useSelector(state => state.sna)
  const keyword = useLoadLanguage(sna.tsv);
  const classes = useMyStyles();
  const [countVisible, setCountVisible] = useState(true);
  const [tweetCount, setTweetCount] = useState({
    count: 0,
    retweet: 0,
    like: 0,
  });
  
  useEffect(() => {
    if(!_.isNil(props.result.tweetCount))
    setTweetCount({
        ...tweetCount,
        count: props.result.tweetCount.count,
        retweet: props.result.tweetCount.retweet,
        like: props.result.tweetCount.like,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.result.tweetCount]);

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
          {keyword("tweetCounter_title")}
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
              <Typography variant={"h6"}>Tweets</Typography>
              <Typography variant={"h2"}>
                {tweetCount.count}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>Retweets</Typography>
              <Typography variant={"h2"}>
                {tweetCount.retweet}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={"h6"}>Likes</Typography>
              <Typography variant={"h2"}>
                {tweetCount.like}
              </Typography>
            </Grid>
          </Grid>
          <Box m={3} />
          <OnClickInfo keyword={"twittersna_tweetnb_tip"} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
