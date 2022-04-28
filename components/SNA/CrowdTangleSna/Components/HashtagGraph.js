import AccordionDetails from "@material-ui/core/AccordionDetails";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { useDispatch, useSelector } from "react-redux";
//possible error, same as plot
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

let from = "PLOT_HASHTAG_GRAPH";

export default function HashtagGraph (props) {

    const dispatch = useDispatch();

    const sna = useSelector((state) => state.sna);
    const keyword = useLoadLanguage(sna.tsv);
    const type = sna.type;

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

        if(type==="FB"){ 
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

       if(type==="FB"){

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
    

    return (
        <Card>
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length !== 0 &&
                <CustomCardHeader
                    title={keyword("ct_hashtag_graph_title")}
                    showHelp={true}
                    helpText={"twittersna_hashtag_graph_tip"}
                    showNodes={true}
                    functionNodes={
                        <CSVLink
                            data={props.result.coHashtagGraph.data.nodes}
                            filename={"Nodes_" + keyword("ct_hashtag_graph_title") + ".csv"}
                            className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                            {
                                <IconNodes />
                            }
                        </CSVLink>
                    }
                    showEdges={true}
                    functionEdges={

                        <Grid item>
                            <Grid item>
                                <CSVLink
                                    data={props.result.coHashtagGraph.data.edges}
                                    filename={"Edges_" + keyword("ct_hashtag_graph_title") + ".csv"}
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        <IconEdges style={{ marginBottom: "2px", marginLeft: "10px" }}/>
                                    }
                                </CSVLink>
                            </Grid>
                        </Grid>
                    } />
            }

            <AccordionDetails>
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length === 0 &&
                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
            }
            {
                props.result && props.result.coHashtagGraph && props.result.coHashtagGraph.data.nodes.length !== 0 &&
                <div style={{ width: '100%' }}>

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
                    {
                        coHashtagGraphTweets &&
                        <PostViewTable snatype={sna} setTypeValue={setCoHashtagGraphTweets} data={coHashtagGraphTweets} downloadEnable={false} />
                    }
                </div>
            }
            {
                props.result.coHashtagGraph === undefined &&
                <CircularProgress className={classes.circularProgress} />
            }
            </AccordionDetails>
        </Card>
        
    )
}