import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import OnClickInfo from '../../OnClickInfo/OnClickInfoFB';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CustomTable from "../../CustomTable/CustomTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import {displayPostsInsta} from "./lib/displayPosts"
import {displayPostsFb} from "./lib/displayPosts"
import {downloadClick} from "./lib/downloadClick";

import useMyStyles from "../../styles/useMyStyles";
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import {createGraphWhenClickANode} from "../../lib/sigmaGraph"
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';

//possible error, same as plot
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from 'react-sigma';

//const tsv = "/localDictionary/tools/TwitterSna.tsv";

let from = "PLOT_HASHTAG_GRAPH";

export default function HashtagGraph (props) {

    const dispatch = useDispatch();

    const snatype = useSelector((state) => state.ctSna.result.snaType);
    const keyword = useLoadLanguage(snatype.tsv);
    const typer =useSelector((state) => state.ctSna.result.snaType.snaType)

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

   // console.log("props.data ", props.result)
  

    const onClickNodeCoHashtagGraph = (data) => {
     //   console.log("DATA ", data)


        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }
      //  console.log("initGraph ", initGraph)

        setCoHashtagGraphClickNode(createGraphWhenClickANode(data));

        setCoHashtagGraphReset(initGraph);

        let selectedHashtag = data.data.node.id;
        //console.log("selectedHashtag ", selectedHashtag)

        var filteredTweets4=[]


        let filteredTweets = state.result.data.filter(tweet => tweet.description !== undefined && tweet.description !==null)
        .map((tweet) => { return tweet.description.toLowerCase().includes(selectedHashtag) });

        for (var i=0; i<filteredTweets.length ;i++){
            if (filteredTweets[i]==true){
                filteredTweets4.push(state.result.data[i])
            }
        }
       //console.log("FILTER-1 ",filteredTweets4.length)
      //  console.log("FILTER-1 ", filteredTweets4)

        let filteredTweets2 = state.result.data.filter(tweet => tweet.image_text !== undefined && tweet.image_text !==null)
        .map((tweet) => { return tweet.image_text.toLowerCase().includes(selectedHashtag) });

        for (var i=0; i<filteredTweets2.length ;i++){
            if (filteredTweets2[i]==true){
                if(filteredTweets4.includes(state.result.data[i])) {
        //            console.log("IT contains it-filteredtweets2")
                    continue
                  }
                  else{
            //        console.log("IT does NOT contain it-filteredtweets2 ",state.result.data[i])
                    filteredTweets4.push(state.result.data[i])
                  }
            }
        }
       // console.log("FILTER-2 ",filteredTweets4.length)
      //  console.log("FILTER-2 ", filteredTweets4)

       //console.log("TYPER ", typer)

        if(typer==="FB"){ 
        //console.log("FBBBBBBB ")

        let filteredTweets3 = state.result.data.filter(tweet => tweet.message !== undefined && tweet.message !==null)
        .map((tweet) => { return tweet.message.toLowerCase().includes(selectedHashtag) });

        for (var i=0; i<filteredTweets3.length ;i++){
            if (filteredTweets3[i]==true){
                if(filteredTweets4.includes(state.result.data[i])) {
               //     console.log("IT contains it-filteredtweets3")
                    continue
                  }
                  else{
               //     console.log("IT does NOT contain it-filteredtweets2 ",state.result.data[i])
                    filteredTweets4.push(state.result.data[i])
                  }
                
            }
        }
       // console.log("FILTER-3 ",filteredTweets4.length)
     //   console.log("FILTER-3 ", filteredTweets4)
        }
         
     //  console.log("filteredTweets4 ", filteredTweets4)

       if(typer==="FB"){

        let dataToDisplay = displayPostsFb(filteredTweets4, keyword);
        //console.log("displayFB ", dataToDisplay)

        dataToDisplay["selected"] = selectedHashtag;
        setCoHashtagGraphTweets(dataToDisplay);
       }
       else{

        let dataToDisplay = displayPostsInsta(filteredTweets4, keyword);
        //console.log("displayInsta ", dataToDisplay)

        dataToDisplay["selected"] = selectedHashtag;
        setCoHashtagGraphTweets(dataToDisplay);
       }
        
    }




    const onClickStageCoHashtagGraph = (e) => {
        setCoHashtagGraphClickNode(null);
        setCoHashtagGraphTweets(null);
    }
    var goToAction;
  
    if(typer=="INSTA"){
      goToAction = [
        {
         icon: InstagramIcon,
          tooltip: keyword("twittersna_result_go_to_tweet"),
          onClick: (event, rowData) => {
            window.open(rowData.link.props.href, "_blank");
          },
        },
      ];
    }
    else {
      goToAction = [
        {
         icon: FacebookIcon,
          tooltip: keyword("twittersna_result_go_to_tweet"),
          onClick: (event, rowData) => {
           window.open(rowData.link.props.href, "_blank");
          },
        },
      ];
    }

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
                        <Grid container justifyContent="space-between" spacing={2}
                            alignContent={"center"}>
                            <Grid item>
                                <CSVLink
                                    data={props.result.coHashtagGraph.data.nodes}
                                    filename={"Nodes_" + keyword("hashtag_graph_title")+ ".csv"}
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Nodes"
                                    }
                                </CSVLink>
                            </Grid>
                            <Grid item>
                                <CSVLink
                                    data={props.result.coHashtagGraph.data.edges}
                                    filename={"Edges_" + keyword("hashtag_graph_title") + ".csv"}
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
                            <Grid container justifyContent="space-between" spacing={2}
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
                                actions={goToAction}
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