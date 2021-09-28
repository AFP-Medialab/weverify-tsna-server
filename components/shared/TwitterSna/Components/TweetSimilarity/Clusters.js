import { useEffect, useState } from "react";
import ClusterTable from "./ClusterTable";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMyStyles from "../../../styles/useMyStyles";
import useLoadLanguage from "../../../hooks/useRemoteLoadLanguage";
import { useSelector } from "react-redux";

const tsv = "/components/NavItems/tools/TwitterSna.tsv";

const Clusters = (props) => {
  // const [clusters, setClusters] = useState(null);
  const keyword = useLoadLanguage(tsv);
  const tweetSimilarityClusters = useSelector(
    (state) => state.twitterSna.tweetSimilarityClusters
  );
  const classes = useMyStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {keyword("tweet_similarity_title")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {tweetSimilarityClusters && tweetSimilarityClusters.clusters.length!==0 && (
          <ClusterTable clusters={tweetSimilarityClusters.clusters} style={{ width: "100%" }}/>
        )}
        {(tweetSimilarityClusters && tweetSimilarityClusters.clusters.length===0) &&
               ( <Typography className={classes.heading}>
                {"No similar tweets to form clusters!"}
              </Typography>)
        }
        {!tweetSimilarityClusters &&
          props.result.tweetCount &&
          props.result.tweetCount.count !== "0" && (
            <CircularProgress className={classes.circularProgress} />
          )}
      </AccordionDetails>
    </Accordion>
  );
};

export default Clusters;
