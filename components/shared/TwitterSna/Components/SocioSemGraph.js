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

import useMyStyles from "../../styles/useMyStyles";
import useLoadLanguage from "../../hooks/useLoadLanguage";

//possible error, same as plot
import { Sigma, RandomizeNodePositions, ForceAtlas2 } from 'react-sigma';


export default function SocioSemGraph (props) {


    const dispatch = useDispatch();

    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const classes = useMyStyles();

    const [socioSemantic4ModeGraphTweets, setSocioSemantic4ModeGraphTweets] = useState(null);
    const [socioSemantic4ModeGraphReset, setSocioSemantic4ModeGraphReset] = useState(null);
    const [socioSemantic4ModeGraphClickNode, setSocioSemantic4ModeGraphClickNode] = useState(null);

    return (
    //props.request.userList.length === 0 && result &&
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
                                    filename={"Nodes_" + keyword("sosem_4mode_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"} 
                                    className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    {
                                        "CSV Nodes"
                                    }
                                </CSVLink>
                            </Grid>
                            <Grid item>
                                <CSVLink
                                    data={props.result.socioSemantic4ModeGraph.data.edges}
                                    filename={"Edges_" + keyword("sosem_4mode_graph_title") + '_' + props.request.keywordList.join('&') + '_' + props.request.from + "_" + props.request.until + ".csv"} 
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
                                        onClick={() => downloadClick(socioSemantic4ModeGraphTweets.csvArr, socioSemantic4ModeGraphTweets.selected)}>
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
