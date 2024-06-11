import { useDispatch, useSelector } from "react-redux";
import CloseResult from "../../../shared/CloseResult/CloseResult";
import { IconButton, Paper } from "@mui/material";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@mui/material/Box";

import dynamic from "next/dynamic"
import TweetCount from "../Components/TweetCount";
import UrlList from "../../Components/UrlList";
import GexfExport from "../Components/GexfExport";
import Grid from "@mui/material/Grid";
import { CardHeader } from "@mui/material";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


import { twitterSnaCleanedState } from "../../../../redux/slices/tools/twitterSnaSlice";
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";
const tsv = "/components/NavItems/tools/TwitterSna";

const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), { ssr: false });
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), { ssr: false });
const BubbleChart = dynamic(import("../Components/BubbleChart"), { ssr: false });
const HeatMap = dynamic(import("../Components/HeatMap"), { ssr: false });
const HashtagGraph = dynamic(import("../Components/HashtagGraph"), { ssr: false });
const SocioSemGraph = dynamic(import("../Components/SocioSemGraph"), { ssr: false });
const CloudChart = dynamic(import("../Components/CloudChart"), { ssr: false });


export default function TwitterSnaResult(props) {

    const dispatch = useDispatch();
    const keyword = i18nLoadNamespace(tsv);
    const classes = useMyStyles();
    const request = useSelector(state => state.twitterSna.request);
    const resultStore = useSelector(state => state.twitterSna.result);
    const topic = useSelector(state => state.twitterSna.request.keywordList[0]);
    const [result, setResult] = useState(null);
    const [histogram, setHistogram] = useState(null);

    const [widthIndex, setWidthIndex] = useState(4);
    const [widthCards, setWidthCards] = useState(8);
    const [collapsed, setCollapsed] = useState(false);
    const [alignIndex, setAlignIndex] = useState("flex-start");
    function onClickCollapseIndex() {
        if (widthIndex == 4){
            setCollapsed(true);
            setWidthIndex(1);
            setWidthCards(11);
            setAlignIndex("center");
        }else{
            setCollapsed(false);
            setWidthIndex(4);
            setWidthCards(8);
            setAlignIndex("flex-start");
        }
    } 

    //Set result 
    useEffect(() => {
        setResult(resultStore);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultStore]);
    useEffect(() => {
        setHistogram(resultStore.histogram);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultStore.histogram]);

    if (result === null)
        return <div />;

    return (


        <Box>
            <CloseResult onClick={() => dispatch(twitterSnaCleanedState())} />

            <Box m={4} />

            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={3}
                >

                <Grid item xs={widthIndex} style={{position: "sticky", top: "100px"}}>
                    <Card>
                        <CardHeader
                            className={classes.headerCard}
                            title={
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center">

                                    {!collapsed &&
                                    <Grid item xs>
                                        <span>
                                            {keyword("twitter_sna_index")}
                                        </span>
                                    </Grid>
                                    }

                                    {!collapsed &&
                                        <Grid item>
                                            <IconButton onClick={onClickCollapseIndex}>
                                                <ArrowBackIosIcon style={{marginRight: "-5px"}} />
                                            </IconButton>
                                        </Grid>
                                    }
                                    {collapsed &&
                                        <Grid item>
                                            <IconButton onClick={onClickCollapseIndex}>
                                                <ArrowForwardIosIcon/>
                                            </IconButton>
                                        </Grid>
                                    }

                                </Grid>
                            }
                        />

                        <Box p={3}>

                            <Grid
                                container
                                direction="column"
                                alignItems={alignIndex}
                            >

                                <a href="#tweets" style={{textDecoration: "none", color: "black"}}>
                                    <Typography variant={"h6"} >
                                        {"1."}
                                        {!collapsed &&
                                            " " + keyword("tweetCounter_title")
                                        }
                                        
                                    </Typography>
                                    <Box m={1}/>
                                </a>

                                <a href="#propagation" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"2."}
                                        {!collapsed &&
                                            " " + keyword("user_time_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble0" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"3."}
                                        {!collapsed &&
                                            " " + keyword("retweets_cloud_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble1" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"4."}
                                        {!collapsed &&
                                            " " + keyword("likes_cloud_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble2" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"5."}
                                        {!collapsed &&
                                            " " + keyword("top_users_pie_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble3" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"6."}
                                        {!collapsed &&
                                            " " + keyword("mention_cloud_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"7. "}
                                        {!collapsed &&
                                            " " + keyword("bubble_chart_title_index")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#heatmap" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"8."}
                                        {!collapsed &&
                                            " " + keyword("heatmap_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#hastag" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"9."}
                                        {!collapsed &&
                                            " " + keyword("hashtag_graph_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#sociosemantic" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"10."}
                                        {!collapsed &&
                                            " " + keyword("sosem_graph_title2")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#words" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"11."}
                                        {!collapsed &&
                                            " " + keyword("top_words_cloud_chart_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#interaction" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"12."}
                                        {!collapsed &&
                                            " " + keyword("export_graph_title")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#urls" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"13."}
                                        {!collapsed &&
                                            " " + keyword("twittersna_result_url_in_tweets")
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>
                                
                            </Grid>

                        </Box>


                       

                    </Card>


                </Grid>


                <Grid item xs={widthCards}>
                    {
                        <div style={{ position: "relative" }}>
                            <span id="tweets" style={{ position: "absolute", top: "-112px" }}></span>
                            <TweetCount result={result} />
                        </div>
                    }
                    {
                        <div style={{ position: "relative" }}>
                            <span id="propagation" style={{ position: "absolute", top: "-112px" }}></span>
                            <Box m={3} />
                            <PlotTimeLine result={result} />
                        </div>
                    }

                    {
                        request && request.userList && request.userList.length === 0 &&
                        result && result.pieCharts &&
                        <div style={{ position: "relative" }}>
                            <Box m={3} />
                            <PlotPieChart result={result} request={request} />
                        </div>
                    }
                    {
                        request && request.userList && request.userList.length === 0 &&
                        result && result.tweetCount &&
                        <div style={{ position: "relative" }}>
                            <span id="bubble" style={{ position: "absolute", top: "-112px" }}></span>
                            <Box m={3} />
                            <BubbleChart result={result} request={request} />
                        </div>
                    }
                    {
                        <div style={{ position: "relative" }}>
                            <span id="heatmap" style={{ position: "absolute", top: "-112px" }}></span>
                            <Box m={3} />
                            <HeatMap result={result} request={request} />
                        </div>
                    }
                    {
                        request &&
                        <div style={{position:"relative"}}>
                            <span id="hastag" style={{position:"absolute", top:"-112px"}}></span>
                            <Box m={3} />
                            <HashtagGraph result={result} request={request} />
                        </div>
                    }
                    {
                        request &&
                        <div style={{ position: "relative" }}>
                            <span id="sociosemantic" style={{ position: "absolute", top: "-112px" }}></span>
                            <Box m={3} />
                            <SocioSemGraph result={result} request={request} />
                        </div>
                    }
                    {
                        request &&
                        <div style={{ position: "relative" }}>
                            <span id="words" style={{ position: "absolute", top: "-112px" }}></span>
                            <Box m={3} />
                            <CloudChart result={result} request={request} />
                        </div>
                    }
                    {
                        request &&
                        <div style={{ position: "relative" }}>
                            <span id="interaction" style={{ position: "absolute", top: "-112px" }}></span>
                            <Box m={3} />
                            <GexfExport result={result} request={request} />
                        </div>
                    }

                    <Box m={3} />
                    {
                        result.urls &&
                        <div style={{ position: "relative" }}>
                            <span id="urls" style={{ position: "absolute", top: "-112px" }}></span>
                            <UrlList result={result} request={request} title_message={'twittersna_result_url_in_tweets'}
                                tooltip_message={'twittersna_result_submit_twitter_sna'} downloadable={true} action={true} topic={topic}
                                type={"TW"}
                                />
                        </div>
                    }


                </Grid>

            </Grid>
            
        </Box>

    );
};