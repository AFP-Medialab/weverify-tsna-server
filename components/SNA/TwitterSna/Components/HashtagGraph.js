import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TwitterIcon from '@material-ui/icons/Twitter';
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
//possible error, same as plot
import { ForceAtlas2, RandomizeNodePositions, Sigma } from 'react-sigma';
import IconEdges from "../../../../images/SVG/CardHeader/Edges.svg";
import IconNodes from "../../../../images/SVG/CardHeader/Nodes.svg";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import { createGraphWhenClickANode } from "../../../shared/lib/sigmaGraph";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { displayPosts } from "../../../SNA/lib/displayTweets";
import PostViewTable from "../../Components/PostViewTable";



let from = "PLOT_HASHTAG_GRAPH";

export default function HashtagGraph (props) {

    const sna = useSelector(state => state.sna)
    const keyword = useLoadLanguage(sna.tsv);
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
        let dataToDisplay = displayPosts(filteredTweets, keyword);
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

        <Card>
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length !== 0 &&
            <CustomCardHeader 
                title={"9. " + keyword("hashtag_graph_title")} 
                showHelp={true} 
                helpText={"twittersna_hashtag_graph_tip"}
                showNodes={true}
                functionNodes={
                    <Grid item>
                        <CSVLink
                            data={props.result.coHashtagGraph.data.nodes}
                            filename={"Nodes_" + keyword("hashtag_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"}
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                            {
                                <IconNodes/>
                            }
                        </CSVLink>
                    </Grid>
                }
                showEdges={true} 
                functionEdges={
                    
                    <Grid item>
                        <CSVLink
                            data={props.result.coHashtagGraph.data.edges}
                            filename={"Edges_" + keyword("hashtag_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"}
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                            {
                                <IconEdges />
                            }
                        </CSVLink>
                    </Grid>
                }/>
            }
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length === 0 &&
                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
            }
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length !== 0 &&
                <div style={{ width: '100%' }} className={classes.cardsResults}>
                    <Box pb={3}>
                        
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
                    <Box m={2} />
                    {
                        coHashtagGraphTweets &&
                        <PostViewTable 
                            snatype={sna} 
                            setTypeValue={setCoHashtagGraphTweets} 
                            data={coHashtagGraphTweets} 
                            downloadEnable={true} 
                            request={props.request}
                            csvArr={coHashtagGraphTweets.csvArr} 
                            selected={"#" + coHashtagGraphTweets.selected}/>
    
                    }
                </div>
            }
            {
                props.result.coHashtagGraph === undefined &&
                <CircularProgress className={classes.circularProgress} />
            }

        </Card>
        
    )
}