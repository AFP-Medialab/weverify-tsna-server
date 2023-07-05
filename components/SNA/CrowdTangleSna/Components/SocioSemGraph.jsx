import Card from '@mui/material/Card';
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from '@mui/material/Grid';
import { Typography } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
import { ForceAtlas2, RandomizeNodePositions, Sigma } from 'react-sigma';
import IconEdges from "../../../../images/SVG/CardHeader/Edges.svg";
import IconNodes from "../../../../images/SVG/CardHeader/Nodes.svg";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import { createGraphWhenClickANode } from "../../../shared/lib/sigmaGraph";
import useMyStyles from "../../../shared/styles/useMyStyles";
import PostViewTable from "../../Components/PostViewTable";
import { displayPostsFb, displayPostsInsta } from "./lib/displayPosts";
//const tsv = "/localDictionary/tools/TwitterSna.tsv";

export default function SocioSemGraph (props) {
    
    const sna = useSelector((state) => state.sna);
    const keyword = useLoadLanguage(sna.tsv);
    const type = sna.type;

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
            //console.log("selectedHashtag ",selectedHashtag)

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
            //console.log("selectedUser ",selectedUser)
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
            //console.log("selectedURL ",selectedURL)

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
        <Card>
            {props.result.socioSemantic4ModeGraph && props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 &&
                <CustomCardHeader
                    title={keyword("ct_sosem_4mode_graph_title")}
                    showHelp={true}
                    helpText={"twittersna_sosem_4mode_graph_tip"}
                    showNodes={true}
                    functionNodes={
                        <Grid item>
                            <CSVLink
                                data={props.result.socioSemantic4ModeGraph.data.nodes}
                                filename={"Nodes_" + keyword("ct_sosem_4mode_graph_title") + '_' /*+ request.keywordList.join('&') + '_' + request.from + "_" + request.until */ + ".csv"} 
                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                {
                                    <IconNodes />
                                }
                            </CSVLink>
                        </Grid>
                    }
                    showEdges={true}
                    functionEdges={
                        <Grid item>
                            <CSVLink
                                data={props.result.socioSemantic4ModeGraph.data.edges}
                                filename={"Edges_" + keyword("ct_sosem_4mode_graph_title") + '_' /*+ request.keywordList.join('&') + '_' + request.from + "_" + request.until */ + ".csv"} 
                                className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                {
                                    <IconEdges style={{  marginLeft: "6px" }} />
                                }
                            </CSVLink>
                        </Grid>
                    } />
            }


        {
            props.result.socioSemantic4ModeGraph && props.result.socioSemantic4ModeGraph.data.nodes.length !== 0 &&
                <div style={{ width: '100%' }}>
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
                    {
                        socioSemantic4ModeGraphTweets &&
                        <PostViewTable snatype={sna} setTypeValue={setSocioSemantic4ModeGraphTweets} data={socioSemantic4ModeGraphTweets} downloadEnable={false} />
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
        </Card>
    )
}
