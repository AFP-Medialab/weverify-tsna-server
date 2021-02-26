import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CustomTable from "../../CustomTable/CustomTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import {displayTweets} from "../lib/displayTweets"
import TwitterIcon from '@material-ui/icons/Twitter';
import {downloadClick} from "../lib/downloadClick";

import useMyStyles from "../../styles/useMyStyles";
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import {createGraphWhenClickANode} from "../../lib/sigmaGraph"

//possible error, same as plot
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from 'react-sigma';

//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

let from = "PLOT_HASHTAG_GRAPH";

export default function HashtagGraph (props) {

    const dispatch = useDispatch();

    const keyword = useLoadLanguage(tsv);
    const classes = useMyStyles();

    const [coHashtagGraphTweets, setCoHashtagGraphTweets] = useState(null);

    const [coHashtagGraphReset, setCoHashtagGraphReset] = useState(null);
    const [coHashtagGraphClickNode, setCoHashtagGraphClickNode] = useState(null);

    const [state, setState] = useState(
        {
            result: props.result        
        }
    );
    useEffect(() => {
        setState({
            ...state,
            result: props.result,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.result.coHashtagGraph]);

    useEffect(() => {
        setCoHashtagGraphTweets(null);
        setCoHashtagGraphReset(null);
        setCoHashtagGraphClickNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request])


    const onClickNodeCoHashtagGraph = (data) => {

        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }

        setCoHashtagGraphClickNode(createGraphWhenClickANode(data));

        setCoHashtagGraphReset(initGraph);

        let selectedHashtag = data.data.node.id;
        let filteredTweets = props.result.tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 0)
            .filter(function (tweet) {
                let hashtagArr = tweet._source.hashtags.map((v) => { return v.toLowerCase();});
                return hashtagArr.includes(selectedHashtag.toLowerCase());
            });
        let dataToDisplay = displayTweets(filteredTweets, keyword);
        dataToDisplay["selected"] = selectedHashtag;
        setCoHashtagGraphTweets(dataToDisplay);
    }

    const onClickStageCoHashtagGraph = (e) => {
        setCoHashtagGraphClickNode(null);
        setCoHashtagGraphTweets(null);
    }

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography className={classes.heading}>{keyword("hashtag_graph_title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length === 0 &&
                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
            }
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length !== 0 &&
                <div style={{ width: '100%' }}>
                    <Box pb={3}>
                        <Grid container justify="space-between" spacing={2}
                            alignContent={"center"}>
                            <Grid item>
                                <CSVLink
                                    data={props.result.coHashtagGraph.data.nodes}
                                    filename={"Nodes_" + keyword("hashtag_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"}
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Nodes"
                                    }
                                </CSVLink>
                            </Grid>
                            <Grid item>
                                <CSVLink
                                    data={props.result.coHashtagGraph.data.edges}
                                    filename={"Edges_" + keyword("hashtag_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"}
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Edges"
                                    }
                                </CSVLink>
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        (coHashtagGraphReset === null && coHashtagGraphClickNode === null && props.result.coHashtagGraph.data.nodes.length !== 0) &&
                        <div>
                            <Sigma graph={props.result.coHashtagGraph.data}
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                onClickNode={(e) => onClickNodeCoHashtagGraph(e)}
                                settings={{
                                    drawEdges: true,
                                    drawEdgeLabels: false,
                                    minNodeSize: 6,
                                    maxNodeSize: 20,
                                    minEdgeSize: 1,
                                    maxEdgeSize: 5,
                                    defaultNodeColor: "#3388AA",
                                    defaultEdgeColor: "#C0C0C0",
                                    edgeColor: "default"
                                }}
                            >
                                <RandomizeNodePositions>
                                    <ForceAtlas2 iterationsPerRender={1} timeout={15000} />
                                </RandomizeNodePositions>
                            </Sigma>
                        </div>
                    }
                    {
                        (coHashtagGraphReset !== null && coHashtagGraphClickNode !== null) &&
                        <div>
                            <Sigma graph={coHashtagGraphClickNode}
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                onClickStage={(e) => onClickStageCoHashtagGraph(e)}
                                settings={{
                                    drawEdges: true,
                                    drawEdgeLabels: false,
                                    minNodeSize: 6,
                                    maxNodeSize: 20,
                                    minEdgeSize: 1,
                                    maxEdgeSize: 5,
                                    defaultNodeColor: "#3388AA",
                                    defaultEdgeColor: "#C0C0C0",
                                    edgeColor: "default"
                                }}
                            >
                            </Sigma>
                        </div>
                    }
                    {
                        (coHashtagGraphReset !== null && coHashtagGraphClickNode === null) &&
                        <div>
                            <Sigma graph={coHashtagGraphReset}
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
                                onClickNode={(e) => onClickNodeCoHashtagGraph(e)}
                                settings={{
                                    drawEdges: true,
                                    drawEdgeLabels: false,
                                    minNodeSize: 6,
                                    maxNodeSize: 20,
                                    minEdgeSize: 1,
                                    maxEdgeSize: 5,
                                    defaultNodeColor: "#3388AA",
                                    defaultEdgeColor: "#C0C0C0",
                                    edgeColor: "default"
                                }}
                            >
                            </Sigma>
                        </div>
                    }
                    <Box m={1} />
                    <OnClickInfo keyword={"twittersna_hashtag_graph_tip"} />
                    <Box m={2} />
                    {
                        coHashtagGraphTweets &&
                        <div>
                            <Grid container justify="space-between" spacing={2}
                                alignContent={"center"}>
                                <Grid item>
                                    <Button
                                        variant={"contained"}
                                        color={"secondary"}
                                        onClick={() => setCoHashtagGraphTweets(null)}>
                                        {
                                            keyword('twittersna_result_hide')
                                        }
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => downloadClick(props.request, coHashtagGraphTweets.csvArr, "#" + coHashtagGraphTweets.selected)}>
                                        {
                                            keyword('twittersna_result_download')
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box m={2} />
                            <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                colums={coHashtagGraphTweets.columns}
                                data={coHashtagGraphTweets.data}
                                actions={goToTweetAction}
                            />
                        </div>
                    }
                </div>
            }
            {
                props.result.coHashtagGraph === undefined &&
                <CircularProgress className={classes.circularProgress} />
            }
            </AccordionDetails>
        </Accordion>
        
    )
}