import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import { ForceAtlas2, RandomizeNodePositions, Sigma } from "react-sigma";
import IconEdges from "../../../../images/SVG/CardHeader/Edges.svg";
import IconNodes from "../../../../images/SVG/CardHeader/Nodes.svg";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import { createGraphWhenClickANode } from "../../../shared/lib/sigmaGraph";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { displayPosts } from "../../lib/displayTweets";
import PostViewTable from "../../Components/PostViewTable";
import { getDomain } from "../../lib/displayTweets";
import { widgetSimpleFilename } from "../Hooks/tsnaUtils";

//const tsv = "/localDictionary/tools/TwitterSna.tsv";

export default function SocioSemGraph(props) {
  const sna = useSelector((state) => state.sna);
  const keyword = useLoadLanguage(sna.tsv);
  const classes = useMyStyles();

  const [socioSemantic4ModeGraphTweets, setSocioSemantic4ModeGraphTweets] =
    useState(null);
  const [socioSemantic4ModeGraphReset, setSocioSemantic4ModeGraphReset] =
    useState(null);
  const [
    socioSemantic4ModeGraphClickNode,
    setSocioSemantic4ModeGraphClickNode,
  ] = useState(null);
  const request = useSelector((state) => state.twitterSna.request);

  const [state, setState] = useState({
    result: props.result,
  });
  useEffect(() => {
    setState({
      ...state,
      result: props.result,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.result.socioSemantic4ModeGraph]);

  useEffect(() => {
    setSocioSemantic4ModeGraphTweets(null);
    setSocioSemantic4ModeGraphReset(null);
    setSocioSemantic4ModeGraphClickNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  const onClickNodeSocioSemantic4ModeGraph = (data) => {
    let initGraph = {
      nodes: data.data.renderer.graph.nodes(),
      edges: data.data.renderer.graph.edges(),
    };

    setSocioSemantic4ModeGraphClickNode(createGraphWhenClickANode(data));

    setSocioSemantic4ModeGraphReset(initGraph);

    if (data.data.node.type === "Hashtag") {
      let selectedHashtag = data.data.node.id.replace("#", "");
      let filteredTweets = props.result.tweets
        .filter(
          (tweet) =>
            tweet._source.hashtags !== undefined &&
            tweet._source.hashtags.length > 0,
        )
        .filter(function (tweet) {
          let hashtagArr = tweet._source.hashtags.map((v) => {
            return v.toLowerCase();
          });
          return hashtagArr.includes(selectedHashtag.toLowerCase());
        });
      let dataToDisplay = displayPosts(filteredTweets, keyword);
      dataToDisplay["selected"] = data.data.node.id;
      setSocioSemantic4ModeGraphTweets(dataToDisplay);
    } else if (data.data.node.type === "Mention") {
      let selectedUser = data.data.node.id.replace("isMTed:@", "");
      let filteredTweets = props.result.tweets
        .filter(
          (tweet) =>
            tweet._source.user_mentions !== undefined &&
            tweet._source.user_mentions.length > 0,
        )
        .filter(function (tweet) {
          let lcMentionArr = tweet._source.user_mentions.map((v) =>
            v.screen_name.toLowerCase(),
          );
          return lcMentionArr.includes(selectedUser.toLowerCase());
        });
      let dataToDisplay = displayPosts(filteredTweets, keyword);
      dataToDisplay["selected"] = data.data.node.id;
      setSocioSemantic4ModeGraphTweets(dataToDisplay);
    } else if (data.data.node.type === "RetweetWC") {
      let selectedUser = data.data.node.id.replace("RT:@", "");
      let filteredTweets = props.result.tweets.filter(
        (tweet) =>
          tweet._source.quoted_status_id_str !== undefined &&
          tweet._source.quoted_status_id_str !== null &&
          tweet._source.screen_name.toLowerCase() === selectedUser,
      );
      let dataToDisplay = displayPosts(filteredTweets, keyword);
      dataToDisplay["selected"] = data.data.node.id;
      setSocioSemantic4ModeGraphTweets(dataToDisplay);
    } else if (data.data.node.type === "TopRT") {
      let selectedUser = data.data.node.id.replace("TopRT:", "");
      let filteredTweets = props.result.tweets.filter(
        (tweet) =>
          tweet._source.screen_name !== undefined &&
          tweet._source.screen_name !== null &&
          tweet._source.screen_name.toLowerCase() === selectedUser,
      );
      let dataToDisplay = displayPosts(filteredTweets, keyword);
      dataToDisplay["selected"] = data.data.node.id;
      setSocioSemantic4ModeGraphTweets(dataToDisplay);
    } else if (data.data.node.type === "Reply") {
      let selectedUser = data.data.node.id.replace("Rpl:@", "");
      let filteredTweets = props.result.tweets.filter(
        (tweet) =>
          tweet._source.in_reply_to_screen_name !== undefined &&
          tweet._source.in_reply_to_screen_name !== null &&
          tweet._source.screen_name.toLowerCase() === selectedUser,
      );
      let dataToDisplay = displayPosts(filteredTweets, keyword);
      dataToDisplay["selected"] = data.data.node.id;
      setSocioSemantic4ModeGraphTweets(dataToDisplay);
    } else if (data.data.node.type === "URL") {
      let selectedURL = data.data.node.id.replace("URL:", "");
      let filteredTweets = props.result.tweets
        .filter(
          (tweet) =>
            tweet._source.urls !== undefined && tweet._source.urls.length > 0,
        )
        .filter(function (tweet) {
          let urlArr = tweet._source.urls.map((url) => {
            return getDomain(url).toLowerCase();
          });
          return urlArr.includes(selectedURL.toLowerCase());
        });
      let dataToDisplay = displayPosts(filteredTweets, keyword);
      dataToDisplay["selected"] = data.data.node.id;
      setSocioSemantic4ModeGraphTweets(dataToDisplay);
    }
  };

  const onClickStageSocioSemantic4ModeGraph = (e) => {
    setSocioSemantic4ModeGraphClickNode(null);
    setSocioSemantic4ModeGraphTweets(null);
  };

  return (
    //request.userList.length === 0 && result &&

    <Card>
      {props.result.socioSemantic4ModeGraph &&
        props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 && (
          <CustomCardHeader
            title={"10. " + keyword("sosem_4mode_graph_title")}
            showHelp={true}
            helpText={"twittersna_sosem_4mode_graph_tip"}
            showNodes={true}
            functionNodes={
              <CSVLink
                data={props.result.socioSemantic4ModeGraph.data.nodes}
                filename={
                  "Nodes_" +
                  keyword("sosem_4mode_graph_title") +
                  "_" +
                  widgetSimpleFilename(request) +
                  ".csv"
                }
                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
              >
                {<IconNodes style={{ marginRight: "8px", marginTop: "2px" }} />}
              </CSVLink>
            }
            showEdges={true}
            functionEdges={
              <Grid item>
                <CSVLink
                  data={props.result.socioSemantic4ModeGraph.data.edges}
                  filename={
                    "Edges_" +
                    keyword("sosem_4mode_graph_title") +
                    "_" +
                    widgetSimpleFilename(request) +
                    ".csv"
                  }
                  className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary"
                >
                  {<IconEdges />}
                </CSVLink>
              </Grid>
            }
          />
        )}
      {props.result.socioSemantic4ModeGraph &&
        props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 && (
          <div style={{ width: "100%" }} className={classes.cardsResults}>
            <Box pb={3}></Box>
            {socioSemantic4ModeGraphReset === null &&
              socioSemantic4ModeGraphClickNode === null &&
              props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 && (
                <div>
                  <Sigma
                    graph={props.result.socioSemantic4ModeGraph.data}
                    renderer={"canvas"}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      height: "800px",
                    }}
                    onClickNode={(e) => onClickNodeSocioSemantic4ModeGraph(e)}
                    settings={{
                      drawEdges: true,
                      drawEdgeLabels: false,
                      minNodeSize: 6,
                      maxNodeSize: 20,
                      minEdgeSize: 1,
                      maxEdgeSize: 5,
                      defaultNodeColor: "#3388AA",
                      defaultEdgeColor: "#C0C0C0",
                      edgeColor: "default",
                    }}
                  >
                    <RandomizeNodePositions>
                      <ForceAtlas2
                        iterationsPerRender={1}
                        timeout={15000}
                        scalingRatio={2}
                      />
                    </RandomizeNodePositions>
                  </Sigma>
                </div>
              )}
            {socioSemantic4ModeGraphReset !== null &&
              socioSemantic4ModeGraphClickNode !== null && (
                <div>
                  <Sigma
                    graph={socioSemantic4ModeGraphClickNode}
                    renderer={"canvas"}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      height: "700px",
                    }}
                    onClickStage={(e) => onClickStageSocioSemantic4ModeGraph(e)}
                    settings={{
                      drawEdges: true,
                      drawEdgeLabels: false,
                      minNodeSize: 6,
                      maxNodeSize: 20,
                      minEdgeSize: 1,
                      maxEdgeSize: 5,
                      defaultNodeColor: "#3388AA",
                      defaultEdgeColor: "#C0C0C0",
                      edgeColor: "default",
                    }}
                  ></Sigma>
                </div>
              )}
            {socioSemantic4ModeGraphReset !== null &&
              socioSemantic4ModeGraphClickNode === null && (
                <div>
                  <Sigma
                    graph={socioSemantic4ModeGraphReset}
                    renderer={"canvas"}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      height: "700px",
                    }}
                    onClickNode={(e) => onClickNodeSocioSemantic4ModeGraph(e)}
                    settings={{
                      drawEdges: true,
                      drawEdgeLabels: false,
                      minNodeSize: 6,
                      maxNodeSize: 20,
                      minEdgeSize: 1,
                      maxEdgeSize: 5,
                      defaultNodeColor: "#3388AA",
                      defaultEdgeColor: "#C0C0C0",
                      edgeColor: "default",
                    }}
                  ></Sigma>
                </div>
              )}
            <Box m={1} />
            <Box m={2} />
            {socioSemantic4ModeGraphTweets && (
              <PostViewTable
                snatype={sna}
                setTypeValue={setSocioSemantic4ModeGraphTweets}
                data={socioSemantic4ModeGraphTweets}
                downloadEnable={true}
                request={request}
                csvArr={socioSemantic4ModeGraphTweets.csvArr}
                selected={socioSemantic4ModeGraphTweets.selected}
              />
            )}
          </div>
        )}
      {props.result.socioSemantic4ModeGraph &&
        props.result.socioSemantic4ModeGraph.data.nodes.length === 0 && (
          <Typography variant={"body2"}>
            {keyword("twittersna_no_data")}
          </Typography>
        )}
      {props.result.socioSemantic4ModeGraph === undefined && (
        <CircularProgress className={classes.circularProgress} />
      )}
    </Card>
  );
}
