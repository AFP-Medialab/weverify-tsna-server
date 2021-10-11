import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfoFB';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from 'react';
import {useSelector } from "react-redux";
import { CSVLink } from "react-csv";
import useMyStyles from "../../../shared/styles/useMyStyles";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import {displayPostsInsta} from "./lib/displayPosts"
import {displayPostsFb} from "./lib/displayPosts"
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from 'react-sigma';
import {createGraphWhenClickANode} from "../../../shared/lib/sigmaGraph";

import PostViewTable  from "../../Components/PostViewTable";
//const tsv = "/localDictionary/tools/TwitterSna.tsv";

export default function SocioSemGraph (props) {
    
    const snatype = useSelector((state) => state.ctSna.result.snaType);
    const keyword = useLoadLanguage(snatype.tsv);
    const type =useSelector((state) => state.ctSna.result.snaType.snaType)

    const classes = useMyStyles();

    const [socioSemantic4ModeGraphTweets, setSocioSemantic4ModeGraphTweets] = useState(null);
    const [socioSemantic4ModeGraphReset, setSocioSemantic4ModeGraphReset] = useState(null);
    const [socioSemantic4ModeGraphClickNode, setSocioSemantic4ModeGraphClickNode] = useState(null);

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

    const onClickNodeSocioSemantic4ModeGraph = (data) => {

        let initGraph = {
            nodes: data.data.renderer.graph.nodes(),
            edges: data.data.renderer.graph.edges()
        }
      
        setSocioSemantic4ModeGraphClickNode(createGraphWhenClickANode(data));

        setSocioSemantic4ModeGraphReset(initGraph);


        if (data.data.node.type === "Hashtag") {
            let selectedHashtag = data.data.node.id;
            console.log("selectedHashtag ",selectedHashtag)

            var filteredTweets4=[]


        let filteredTweets = state.result.data.filter(tweet => tweet.description !== undefined && tweet.description !==null)
        .map((tweet) => { return tweet.description.toLowerCase().includes(selectedHashtag) });

        for (var i=0; i<filteredTweets.length ;i++){
            if (filteredTweets[i]==true){
                filteredTweets4.push(state.result.data[i])
            }
        }
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
        if(type==="FB"){

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
          //  console.log("FILTER-3 ",filteredTweets4.length)
         //   console.log("FILTER-3 ", filteredTweets4)
            }
            if(type==="FB"){
                let dataToDisplay = displayPostsFb(filteredTweets4);
             //   console.log("dataToDisplay ", dataToDisplay)
        
                dataToDisplay["selected"] = selectedHashtag;
                setSocioSemantic4ModeGraphTweets(dataToDisplay);
               }
               else{
                let dataToDisplay = displayPostsInsta(filteredTweets4);
              //  console.log("dataToDisplay ", dataToDisplay)
        
                dataToDisplay["selected"] = selectedHashtag;
                setSocioSemantic4ModeGraphTweets(dataToDisplay);
               }
        } 
        else if (data.data.node.type === "Mention") {
            let selectedUser = data.data.node.id
        //   let selectedUser = data.data.node.id
            console.log("selectedUser ",selectedUser)
            var filteredTweets4=[]


        let filteredTweets = state.result.data.filter(tweet => tweet.description !== undefined && tweet.description !==null)
        .map((tweet) => { return tweet.description.toLowerCase().includes(selectedUser) });

        for (var i=0; i<filteredTweets.length ;i++){
            if (filteredTweets[i]==true){
                filteredTweets4.push(state.result.data[i])
            }
        }
        let filteredTweets2 = state.result.data.filter(tweet => tweet.image_text !== undefined && tweet.image_text !==null)
        .map((tweet) => { return tweet.image_text.toLowerCase().includes(selectedUser) });

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
        if(type==="FB"){

            let filteredTweets3 = state.result.data.filter(tweet => tweet.message !== undefined && tweet.message !==null)
            .map((tweet) => { return tweet.message.toLowerCase().includes(selectedUser) });
    
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
          //  console.log("FILTER-3 ",filteredTweets4.length)
         //   console.log("FILTER-3 ", filteredTweets4)
            }
            if(type==="FB"){
                let dataToDisplay = displayPostsFb(filteredTweets4);
        
                dataToDisplay["selected"] = selectedUser;
                setSocioSemantic4ModeGraphTweets(dataToDisplay);
               }
               else{
                let dataToDisplay = displayPostsInsta(filteredTweets4);
              //  console.log("dataToDisplay ", dataToDisplay)
        
                dataToDisplay["selected"] = selectedUser;
                setSocioSemantic4ModeGraphTweets(dataToDisplay);
               }
        }
        else if (data.data.node.type === "URL") {
            let selectedURL = data.data.node.id.replace("URL:", "");;
            console.log("selectedURL ",selectedURL)

            var filteredTweets4=[]


        let filteredTweets = state.result.data.filter(tweet => tweet.description !== undefined && tweet.description !==null)
        .map((tweet) => { return tweet.description.includes(selectedURL) });

        for (var i=0; i<filteredTweets.length ;i++){
            if (filteredTweets[i]==true){
                filteredTweets4.push(state.result.data[i])
            }
        }
        let filteredTweets2 = state.result.data.filter(tweet => tweet.image_text !== undefined && tweet.image_text !==null)
        .map((tweet) => { return tweet.image_text.includes(selectedURL) });

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
        if(type==="FB"){

            let filteredTweets3 = state.result.data.filter(tweet => tweet.message !== undefined && tweet.message !==null)
            .map((tweet) => { return tweet.message.includes(selectedURL) });
    
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
          //  console.log("FILTER-3 ",filteredTweets4.length)
         //   console.log("FILTER-3 ", filteredTweets4)
            }
            if(type==="FB"){
                let dataToDisplay = displayPostsFb(filteredTweets4);
             //   console.log("dataToDisplay ", dataToDisplay)
        
                dataToDisplay["selected"] = selectedURL;
                setSocioSemantic4ModeGraphTweets(dataToDisplay);
               }
               else{
                let dataToDisplay = displayPostsInsta(filteredTweets4);
              //  console.log("dataToDisplay ", dataToDisplay)
        
                dataToDisplay["selected"] = selectedURL;
                setSocioSemantic4ModeGraphTweets(dataToDisplay);
               }
            
        }
      
    }

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
            <Typography className={classes.heading}>{keyword("ct_sosem_4mode_graph_title")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
        {
            props.result.socioSemantic4ModeGraph && props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 &&
                <div style={{ width: '100%' }}>
                    <Box pb={3}>
                        <Grid container justifyContent="space-between" spacing={2}
                            alignContent={"center"}>
                            <Grid item>
                                <CSVLink
                                    data={props.result.socioSemantic4ModeGraph.data.nodes}
                                    filename={"Nodes_" + keyword("ct_sosem_4mode_graph_title") + '_' /*+ request.keywordList.join('&') + '_' + request.from + "_" + request.until */ + ".csv"} 
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Nodes"
                                    }
                                </CSVLink>
                            </Grid>
                            <Grid item>
                                <CSVLink
                                    data={props.result.socioSemantic4ModeGraph.data.edges}
                                    filename={"Edges_" + keyword("ct_sosem_4mode_graph_title") + '_' /*+ request.keywordList.join('&') + '_' + request.from + "_" + request.until */ + ".csv"} 
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
                        <PostViewTable snatype={snatype} setTypeValue={setSocioSemantic4ModeGraphTweets} data={socioSemantic4ModeGraphTweets} downloadEnable={false} />
                    }
                </div>
            }
            {
                props.result.socioSemantic4ModeGraph && props.result.socioSemantic4ModeGraph.data.nodes.length === 0 &&
                <Typography variant={"body2"}>{keyword("ct_sna_no_data")}</Typography>
            }
            {
                props.result.socioSemantic4ModeGraph === undefined &&
                <CircularProgress className={classes.circularProgress} />
            }
        </AccordionDetails>
    </Accordion>
    )
}
