import { useEffect, useState } from "react";
import ClusterTable from "./ClusterTable";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import useMyStyles from "../../../styles/useMyStyles";
import useLoadLanguage from "../../../hooks/useRemoteLoadLanguage";

//TODO the following path is not exist.
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

const Clusters = () => {
  const [clusters, setClusters] = useState(null);
  const keyword = useLoadLanguage(tsv);

  const classes = useMyStyles();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/similarity/", {
      method: "POST",
      body: JSON.stringify(
        {"esQuery":{"size":1000,"query":{"bool":{"must":[{"query_string":{"query":"NOT _exists_:likes NOT _exists_:retweets NOT _exists_:replies","analyze_wildcard":true,"time_zone":"Europe/Paris"}},
        {"match_phrase":{"full_text":{"query":"hypercapnia"}}},
        {"range":{"datetimestamp":{"format":"epoch_second","gte":1630450800,"lte":1630537200}}}],"filter":[],"should":[],"must_not":[]}},
        "sort":[{"datetimestamp":{"order":"asc"}},{"id_str":{"order":"asc"}}]}}
      ),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("Similarity", data);
        setClusters(data.clusters);
      });
  }, []);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {/* TODO: tweet_similarity_title does not show the text. */}
          {keyword("tweet_similarity_title")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {clusters && <ClusterTable clusters={clusters} />};
      </AccordionDetails>
    </Accordion>
  );
};

export default Clusters;
