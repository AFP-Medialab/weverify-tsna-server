import { useDispatch, useSelector } from "react-redux";
import CloseResult from "../../../shared/CloseResult/CloseResult";
import { cleanTwitterSnaState } from "../../../../redux/actions/tools/twitterSnaActions";
import { IconButton, Paper } from "@material-ui/core";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@material-ui/core/Box";

import dynamic from "next/dynamic"
import TweetCount from "../Components/TweetCount";
import UrlList from "../../Components/UrlList";
import GexfExport from "../Components/GexfExport";
import Grid from "@material-ui/core/Grid";
import { CardHeader } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), { ssr: false });
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), { ssr: false });
const BubbleChart = dynamic(import("../Components/BubbleChart"), { ssr: false });
const HeatMap = dynamic(import("../Components/HeatMap"), { ssr: false });
const HashtagGraph = dynamic(import("../Components/HashtagGraph"), { ssr: false });
const SocioSemGraph = dynamic(import("../Components/SocioSemGraph"), { ssr: false });
const CloudChart = dynamic(import("../Components/CloudChart"), { ssr: false });

export default function TwitterSnaResult(props) {

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const request = useSelector(state => state.twitterSna.request);
    const resultStore = useSelector(state => state.twitterSna.result);
    const [result, setResult] = useState(null);
    const [histogram, setHistogram] = useState(null);

    const [widthIndex, setWidthIndex] = useState(4);
    const [widthCards, setWidthCards] = useState(8);
    const [collapsed, setCollapsed] = useState(false);
    function onClickCollapseIndex() {
        if (widthIndex == 4){
            setCollapsed(true);
            setWidthIndex(1);
            setWidthCards(11);
        }else{
            setCollapsed(false);
            setWidthIndex(4);
            setWidthCards(8);
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
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />

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
                                    justifyContent="space-between"
                                    alignItems="center"
                                    spacing={2}>

                                    <Grid item xs>
                                        <span>{!collapsed &&
                                            "Index"
                                        }</span>
                                    </Grid>

                                    {!collapsed &&
                                        <Grid item>
                                            <IconButton onClick={props.functionNodes} onClick={onClickCollapseIndex}>
                                                <ArrowBackIosIcon style={{marginRight: "-5px"}} />
                                            </IconButton>
                                        </Grid>
                                    }
                                    {collapsed &&
                                        <Grid item>
                                            <IconButton onClick={props.functionNodes} onClick={onClickCollapseIndex}>
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
                            >

                                <a href="#tweets" style={{textDecoration: "none", color: "black"}}>
                                    <Typography variant={"h6"} >
                                        {"1. "}
                                        {!collapsed &&
                                            "Tweets number"
                                        }
                                        
                                    </Typography>
                                    <Box m={1}/>
                                </a>

                                <a href="#propagation" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"2. "}
                                        {!collapsed &&
                                            "Propagation timeline"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble0" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"3. "}
                                        {!collapsed &&
                                            "Most retweeted users"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble1" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"4. "}
                                        {!collapsed &&
                                            "Most liked users"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble2" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"5. "}
                                        {!collapsed &&
                                            "Most active users"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble3" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"6. "}
                                        {!collapsed &&
                                            "Most mentioned accounts"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#bubble" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"7. "}
                                        {!collapsed &&
                                            "Top 100 most active accounts"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#heatmap" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"8. "}
                                        {!collapsed &&
                                            "Heatmap of tweets distribution"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#hastag" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"9. "}
                                        {!collapsed &&
                                            "Most associated hastags"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#sociosemantic" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"10. "}
                                        {!collapsed &&
                                            "Socio-semantic graph"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#words" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"11. "}
                                        {!collapsed &&
                                            "Most used words in tweets"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#interaction" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"12. "}
                                        {!collapsed &&
                                            "Interaction graph"
                                        }
                                    </Typography>
                                    <Box m={1} />
                                </a>

                                <a href="#urls" style={{ textDecoration: "none", color: "black" }}>
                                    <Typography variant={"h6"} >
                                        {"13. "}
                                        {!collapsed &&
                                            "URLs in tweets"
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
                                tooltip_message={'twittersna_result_submit_twitter_sna'} downloadable={true} action={true} />
                        </div>
                    }


                </Grid>

            </Grid>
            
        </Box>

    );
};