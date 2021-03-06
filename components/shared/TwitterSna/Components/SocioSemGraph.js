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
import TwitterIcon from '@material-ui/icons/Twitter';
import {downloadClick} from "../lib/downloadClick";

import useMyStyles from "../../styles/useMyStyles";
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";

import {displayTweets} from "../lib/displayTweets";
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from 'react-sigma';
import {createGraphWhenClickANode} from "../../lib/sigmaGraph";
import {getDomain} from "../Hooks/socioSemGraph"

//const tsv = "/localDictionary/tools/TwitterSna.tsv";

export default function SocioSemGraph (props) {
    
    const tsv = "/components/NavItems/tools/TwitterSna.tsv";
    const keyword = useLoadLanguage(tsv);
    const classes = useMyStyles();

    const [socioSemantic4ModeGraphTweets, setSocioSemantic4ModeGraphTweets] = useState(null);
    const [socioSemantic4ModeGraphReset, setSocioSemantic4ModeGraphReset] = useState(null);
    const [socioSemantic4ModeGraphClickNode, setSocioSemantic4ModeGraphClickNode] = useState(null);
    const request = useSelector(state => state.twitterSna.request);

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
    }, [props.result.socioSemantic4ModeGraph]);

    useEffect(() => {
        setSocioSemantic4ModeGraphTweets(null);
        setSocioSemantic4ModeGraphReset(null);
        setSocioSemantic4ModeGraphClickNode(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request])

    const onClickNodeSocioSemantic4ModeGraph = (data) => {

        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }

        setSocioSemantic4ModeGraphClickNode(createGraphWhenClickANode(data));

        setSocioSemantic4ModeGraphReset(initGraph);

        if (data.data.node.type === "Hashtag") {
            let selectedHashtag = data.data.node.id.replace("#", "");
            let filteredTweets = props.result.tweets.filter(tweet => tweet._source.hashtags !== undefined && tweet._source.hashtags.length > 0)
                .filter(function (tweet) {
                    let hashtagArr = tweet._source.hashtags.map((v) => { return v.toLowerCase(); });
                    return hashtagArr.includes(selectedHashtag.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets, keyword);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "Mention") {
            let selectedUser = data.data.node.id.replace("isMTed:@", "");
            let filteredTweets = props.result.tweets.filter(tweet => tweet._source.user_mentions !== undefined && tweet._source.user_mentions.length > 0)
                .filter(function (tweet) {
                    let lcMentionArr = tweet._source.user_mentions.map(v => v.screen_name.toLowerCase());
                    return lcMentionArr.includes(selectedUser.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets, keyword);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "RetweetWC") {
            let selectedUser = data.data.node.id.replace("RT:@", "");
            let filteredTweets = props.result.tweets.filter(tweet => 
                tweet._source.quoted_status_id_str !== undefined 
                && tweet._source.quoted_status_id_str !== null
                && tweet._source.screen_name.toLowerCase() === selectedUser);
            let dataToDisplay = displayTweets(filteredTweets, keyword);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "TopRT") {
            let selectedUser = data.data.node.id.replace("TopRT:", "");
            let filteredTweets = props.result.tweets.filter(tweet => 
                tweet._source.screen_name !== undefined 
                && tweet._source.screen_name !== null
                && tweet._source.screen_name.toLowerCase() === selectedUser);
            let dataToDisplay = displayTweets(filteredTweets, keyword);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "Reply") {
            let selectedUser = data.data.node.id.replace("Rpl:@", "");
            let filteredTweets = props.result.tweets.filter(tweet => 
                tweet._source.in_reply_to_screen_name !== undefined 
                && tweet._source.in_reply_to_screen_name !== null
                && tweet._source.screen_name.toLowerCase() === selectedUser);
            let dataToDisplay = displayTweets(filteredTweets, keyword);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        } else if (data.data.node.type === "URL") {
            let selectedURL = data.data.node.id.replace("URL:", "");
            let filteredTweets = props.result.tweets.filter(tweet => tweet._source.urls !== undefined && tweet._source.urls.length > 0)
                .filter(function (tweet) {
                    let urlArr = tweet._source.urls.map((url) => {
                        return getDomain(url).toLowerCase();
                    });
                    return urlArr.includes(selectedURL.toLowerCase());
                });
            let dataToDisplay = displayTweets(filteredTweets, keyword);
            dataToDisplay["selected"] = data.data.node.id;
            setSocioSemantic4ModeGraphTweets(dataToDisplay);
        }
    }

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

    const onClickStageSocioSemantic4ModeGraph = (e) => {
        setSocioSemantic4ModeGraphClickNode(null);
        setSocioSemantic4ModeGraphTweets(null);
    }


    return (
    //request.userList.length === 0 && result &&
    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
        >
            <Typography className={classes.heading}>{keyword("sosem_4mode_graph_title")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {
            props.result.socioSemantic4ModeGraph && props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 &&
                <div style={{ width: '100%' }}>
                    <Box pb={3}>
                        <Grid container justify="space-between" spacing={2}
                            alignContent={"center"}>
                            <Grid item>
                                <CSVLink
                                    data={props.result.socioSemantic4ModeGraph.data.nodes}
                                    filename={"Nodes_" + keyword("sosem_4mode_graph_title") + '_' + request.keywordList.join('&') + '_' + request.from + "_" + request.until + ".csv"} 
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Nodes"
                                    }
                                </CSVLink>
                            </Grid>
                            <Grid item>
                                <CSVLink
                                    data={props.result.socioSemantic4ModeGraph.data.edges}
                                    filename={"Edges_" + keyword("sosem_4mode_graph_title") + '_' + request.keywordList.join('&') + '_' + request.from + "_" + request.until + ".csv"} 
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Edges"
                                    }
                                </CSVLink>
                            </Grid>
                        </Grid>
                    </Box>
                    {
                        (socioSemantic4ModeGraphReset === null && socioSemantic4ModeGraphClickNode === null && props.result.socioSemantic4ModeGraph.data.nodes.length !== 0) &&
                        <div>
                            <Sigma graph={props.result.socioSemantic4ModeGraph.data}
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
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
                                    edgeColor: "default"
                                }}
                            >
                                <RandomizeNodePositions>
                                    <ForceAtlas2 iterationsPerRender={1} timeout={15000} scalingRatio={2} />
                                </RandomizeNodePositions>
                            </Sigma>
                        </div>
                    }
                    {
                        (socioSemantic4ModeGraphReset !== null && socioSemantic4ModeGraphClickNode !== null) &&
                        <div>
                            <Sigma graph={socioSemantic4ModeGraphClickNode}
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
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
                                    edgeColor: "default"
                                }}
                            >
                            </Sigma>
                        </div>
                    }
                    {
                        (socioSemantic4ModeGraphReset !== null && socioSemantic4ModeGraphClickNode === null) &&
                        <div>
                            <Sigma graph={socioSemantic4ModeGraphReset}
                                renderer={"canvas"}
                                style={{ textAlign: 'left', width: '100%', height: '700px' }}
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
                                    edgeColor: "default"
                                }}
                            >
                            </Sigma>
                        </div>
                    }
                    <Box m={1}/>
                    <OnClickInfo keyword={"twittersna_sosem_4mode_graph_tip"}/>
                    <Box m={2}/>
                    {
                        socioSemantic4ModeGraphTweets &&
                        <div>
                            <Grid container justify="space-between" spacing={2}
                                alignContent={"center"}>
                                <Grid item>
                                    <Button
                                        variant={"contained"}
                                        color={"secondary"}
                                        onClick={() => setSocioSemantic4ModeGraphTweets(null)}>
                                        {
                                            keyword('twittersna_result_hide')
                                        }
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant={"contained"}
                                        color={"primary"}
                                        onClick={() => downloadClick(request, socioSemantic4ModeGraphTweets.csvArr, socioSemantic4ModeGraphTweets.selected)}>
                                        {
                                            keyword('twittersna_result_download')
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                            <Box m={2} />
                            <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                colums={socioSemantic4ModeGraphTweets.columns}
                                data={socioSemantic4ModeGraphTweets.data}
                                actions={goToTweetAction}
                            />
                        </div>
                    }
                </div>
            }
            {
                props.result.socioSemantic4ModeGraph && props.result.socioSemantic4ModeGraph.data.nodes.length === 0 &&
                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
            }
            {
                props.result.socioSemantic4ModeGraph === undefined &&
                <CircularProgress className={classes.circularProgress} />
            }
        </AccordionDetails>
    </Accordion>
    )
}
