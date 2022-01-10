import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";
import Plot from "react-plotly.js";
import { getFreq } from "./Constants";

//TODO once only 4 user has been shown instead of 10, check why?
var topN = 10; //number of users to be shown in sankey chart
function getSankeyChartStructure() {
  let data = {
    type: "sankey",
    valueformat: ".0f",
    orientation: "v",
    node: {
      pad: 5,
      thickness: 50,
      // line: {
      //   width: 0.1,
      // },
      // hoverlabel:{namelength:3},
      hovertemplate: "%{customdata.hoverText}",
    },

    link: {
      // line: {
      //   width: 0.5,
      // },
      hoverlabel: { namelength: 3 },
      hovertemplate: "%{source.customdata.id} contributed %{value} tweets",
    },
    arrangement: "fixed",
  };
  let layout = {
    title: "<b>Top " + topN + " most tweeted user of the clusters.</b>",
    font: {
      size: 8,
    },
    margin: { b: 10, l: 0, r: 0, t: 30 },
    // width: 1000,
    height: 250,
    autosize: true,
  };
  const config = {
    // displayModeBar: false, // this is the line that hides the bar.
    // responsive: true
  };
  return { data, layout, config };
}

/**
 * Finds the topN most tweeted users within the clusters together with the total
 * number of times they tweeted
 * @param clusters
 * @returns [[user1,#tweets],[user2,#tweets]...]
 */
function getTopNUserFreq(clusters) {
  let screenNames = "";
  for (let i = 0; i < clusters.length; i++) {
    let screenName = clusters[i]["screen_name"];
    screenNames += screenName;
    //if it is not the last element then append a comma
    if (i + 1 < clusters.length) screenNames += ", ";
  }
  screenNames = screenNames.split(", ");
  let screenNamesFreq = getFreq(screenNames);
  //number of users to be shown on user-cluster sankey (max 10 users)
  topN = screenNamesFreq.length >= topN ? topN : screenNamesFreq.length;
  let topNUsersFreq = screenNamesFreq.slice(0, topN);
  return topNUsersFreq;
}

/**
 * returns the first 4 chars of the screen name, appended with two dots
 * e.g. gateteam will be converted to gate..
 * @param {String} screenName
 */
function shortenHandle(screenName) {
  let upperBound = topN;
  if (topN >= 10) {
    upperBound = 5;
  } else if (topN <= 7) {
    upperBound = 10;
  }
  if (upperBound + 2 < screenName.length)
    return screenName.substring(0, upperBound) + "..";
  else return screenName;
}

/**
 * Form node labels, source and target nodes and links weight from the clusters.
 * TODO: It might look better if the most tweeted user be shown on the first node!
 * @param {*} clusters
 * @param {*} topNUsersFreq
 * @returns
 */
function formSankeyData(clusters, topNUsersFreq) {
  //label contains list of users and clusters respectively
  // 1. build nodes data
  // label holds the id used for identifying nodes and the label used for displaying, i.e. each [{id:id, dispayName:"an explanatory name"}]
  let label = [];
  let customdata = [];
  topNUsersFreq.forEach((e) => {
    let screenName = e[0]; //screen name
    label.push({ id: screenName, displayName: shortenHandle(screenName) });
    let hoverText = screenName + " sent " + e[1] + " tweets in total";
    customdata.push({ nodeType: "userNode", id: screenName, hoverText });
  });
  let sankeyDataArr = [];
  // if a cluster contains one of the top user's tweet, then include the cluster in the sankey plot
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i];
    //for each cluster get the screen_names with their frequencies
    const clusterUsersFreq = getFreq(cluster["screen_name"].split(", "));
    for (const topUser of topNUsersFreq) {
      let element = null;
      for (let j = 0; j < clusterUsersFreq.length; j++) {
        const clusterUserFreq = clusterUsersFreq[j];
        //topUser[0] is screenName, topUser[1] is the frequency
        if (topUser[0] === clusterUserFreq[0]) {
          let clusterId = cluster.cluster_id;
          let clusterUserScreenName = clusterUserFreq[0];

          //create an empty object that holds source, target and weight (value) of a sankey node-link
          element = {
            sourceIndex: null,
            targetIndex: null,
            userTweetCnt: null,
          };

          element.userTweetCnt = clusterUserFreq[1];
          // if label with the clusterId is not added yet
          if (!label.some((l) => l.id == clusterId)) {
            // label.push(clusterId);
            label.push({
              id: clusterId,
              displayName: cluster.description
                .split(", ")
                .slice(0, 2)
                .join(", "),
            });
            //add custom data to cluster node
            let hoverText =
              "Total tweets in this cluster:" +
              cluster.tweet_count +
              "<br>Description:<br>" +
              cluster.description.split(", ").slice(0, 5).join(", ");
            customdata.push({
              nodeType: "clusterNode",
              id: clusterId,
              hoverText,
            });
          }

          //find the indices of user and clusters within the label array
          const sourceIndex = label.findIndex(
            (l) => l.id === clusterUserScreenName
          );
          const targetIndex = label.findIndex((l) => l.id === clusterId);
          element.sourceIndex = sourceIndex;
          element.targetIndex = targetIndex;
          break;
        }
      }
      if (element) sankeyDataArr.push(element);
    }
  }

  let sourceIndices = [];
  let targetIndices = [];
  let values = [];
  for (let sd of sankeyDataArr) {
    sourceIndices.push(sd.sourceIndex);
    targetIndices.push(sd.targetIndex);
    values.push(sd.userTweetCnt);
  }

  let sankeyData = {
    label: label.map((l) => l.displayName),
    customdata,
    sourceIndices,
    targetIndices,
    values,
  };
  return sankeyData;
}

function getSankeyChart(clusters, topNUsersFreq) {
  let sankeyData = formSankeyData(clusters, topNUsersFreq);
  let sankeyChart = getSankeyChartStructure();
  sankeyChart.data.node.label = sankeyData.label;
  sankeyChart.data.node.customdata = sankeyData.customdata;
  sankeyChart.data.link.source = sankeyData.sourceIndices;
  sankeyChart.data.link.target = sankeyData.targetIndices;
  sankeyChart.data.link.value = sankeyData.values;
  return sankeyChart;
}

const UserClusterSankey = (props) => {
  const clusters = props.clusters;
  const filterClustersFnc = props.filterClustersFnc;
  const topNUsersFreq = getTopNUserFreq(clusters);
  const sankey = getSankeyChart(clusters, topNUsersFreq);

  /**
   * On sankey node clicks, if the node is a user node, then gets the user screen name and
   * find the cluster that includes the user, then filters the ClusterTable component to show only these clusters.
   * if a cluster node is clicked then leaves only that cluster on the ClusterTable component.
   * If link is clicked then ignores it.
   * @param {*} event
   */
  const handleClick = (event) => {
    const customdata = event.points[0].customdata;
    //customdata is assigned only to the nodes, so clicking the links will be ignored.
    if (customdata) {
      const id = customdata.id;
      let clusterIds;
      console.log(customdata.nodeType);
      if (customdata.nodeType === "userNode") {
        // debugger;
        clusterIds = clusters
          .filter((cluster) => {
            return cluster.screen_name.includes(id);
          })
          .map((c) => c.cluster_id);
      } else if (customdata.nodeType === "clusterNode") {
        clusterIds = [id];
      }
      console.log("clusterIds", clusterIds);
      filterClustersFnc(clusterIds);
    }
  };
  const otherWay = { marginBottom: "5px" };

  return (
    <Paper style={{ width: "100%" }}>
      <Plot
        style={{ width: "100%" }}
        data={[sankey.data]}
        layout={sankey.layout}
        config={sankey.config}
        useResizeHandler
        onClick={handleClick}
      />
    </Paper>
  );
};

export default UserClusterSankey;
