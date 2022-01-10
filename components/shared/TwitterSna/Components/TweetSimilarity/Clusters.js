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
import { Consts } from "./Constants";
const UserClusterSankey = dynamic(() => import("./UserClusterSankey"), {
  ssr: false,
});
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

const Clusters = (props) => {
  const keyword = useLoadLanguage(tsv);
  const tweetSimilarity = useSelector(
    (state) => state.twitterSna.tweetSimilarity
  );

  const [filteredClusters, setFilteredClusters] = useState(null);
  const [showAllClustersBtn, setShowAllClustersBtn] = React.useState(false);

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
      filteredClusters = tweetSimilarity.data.clusters.filter((cluster) => {
        return clusterIds.includes(cluster.cluster_id);
      });
      setShowAllClustersBtn(true);
    } else {
      filteredClusters = tweetSimilarity.data.clusters;
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
        {tweetSimilarity &&
          tweetSimilarity.status == Consts.COMPLETED &&
          tweetSimilarity.data?.clusters.length !== 0 && (
            <Paper style={{ width: "100%" }}>
              {tweetSimilarity.data.clusters[0].screen_name && <UserClusterSankey
                clusters={[...tweetSimilarity.data.clusters]}
                filterClustersFnc={filterClusters}
              />}
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
                    : tweetSimilarity.data.clusters
                }
              />
            </Paper>
          )}
        {tweetSimilarity && tweetSimilarity.data?.clusters.length === 0 && (
          <Typography className={classes.heading}>
            {
              tweetSimilarity.status == Consts.COMPLETED
                ? "No similar tweets to form clusters!"
                : tweetSimilarity.message //if not completed then it is failed.
            }
          </Typography>
        )}
        {!tweetSimilarity &&
          props.result.tweetCount &&
          props.result.tweetCount.count !== "0" && (
            <CircularProgress className={classes.circularProgress} />
          )}
      </AccordionDetails>
    </Accordion>
  );
};

export default Clusters;
