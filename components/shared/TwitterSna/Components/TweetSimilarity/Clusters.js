import React, { useEffect, useState } from "react";
import ClusterTable from "./ClusterTable";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import useMyStyles from "../../../styles/useMyStyles";
import useLoadLanguage from "../../../hooks/useRemoteLoadLanguage";
import { useSelector } from "react-redux";
// import UserClusterSankey from "./UserClusterSankey";
import dynamic from "next/dynamic";
import { Button } from "@material-ui/core";
const UserClusterSankey = dynamic(() => import("./UserClusterSankey"), {
  ssr: false,
});
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

const Clusters = (props) => {
  const keyword = useLoadLanguage(tsv);
  const tweetSimilarityClusters = useSelector(
    (state) => state.twitterSna.tweetSimilarityClusters
  );

  // if (tweetSimilarityClusters) {
  const [filteredClusters, setFilteredClusters] = useState(null);
  const [showAllClustersBtn, setShowAllClustersBtn] = React.useState(false);

  // }

  /**
   * This function is called by UserClusterSankey component to filter out the clusters
   * which related to the node clicked on the Sankey plot.
   * i.e., If a cluster or a user node is selected from the Sankey plot, only the clusters related to
   * that node will be displayed in the cluster table.
   * @param {array} clusterIds The ids of clusters that will be shown on the cluster table
   */
  function filterClusters(clusterIds) {
    let filteredClusters;
    if (clusterIds?.length > 0) {
      filteredClusters = tweetSimilarityClusters.clusters.filter((cluster) => {
        return clusterIds.includes(cluster.cluster_id);
      });
      setShowAllClustersBtn(true);
    } else {
      filteredClusters = tweetSimilarityClusters.clusters;
      setShowAllClustersBtn(false);
    }
    console.log("filteredClusters", filteredClusters);
    setFilteredClusters(filteredClusters);
  }

  const classes = useMyStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>
          {keyword("tweet_similarity_title")}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {tweetSimilarityClusters &&
          tweetSimilarityClusters.clusters.length !== 0 && (
            <Paper style={{ width: "100%" }}>
              <UserClusterSankey
                clusters={[...tweetSimilarityClusters.clusters]}
                filterClustersFnc={filterClusters}
              />
              {showAllClustersBtn ? (
                <Button
                  variant={"contained"}
                  color={"secondary"}
                  onClick={() => filterClusters([])}
                >
                  Show all Clusters
                </Button>
              ) : null}
              <ClusterTable
                clusters={
                  filteredClusters
                    ? filteredClusters
                    : tweetSimilarityClusters.clusters
                }
                // style={{ width: "100%", height:"2100" }}
              />
            </Paper>
          )}
        {tweetSimilarityClusters &&
          tweetSimilarityClusters.clusters.length === 0 && (
            <Typography className={classes.heading}>
              {"No similar tweets to form clusters!"}
            </Typography>
          )}
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
