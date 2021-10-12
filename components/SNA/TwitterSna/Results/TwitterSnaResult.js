import { useDispatch, useSelector } from "react-redux";
import CloseResult from "../../../shared/CloseResult/CloseResult";
import { cleanTwitterSnaState } from "../../../../redux/actions/tools/twitterSnaActions";
import { Paper } from "@material-ui/core";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@material-ui/core/Box";

import dynamic from "next/dynamic"
import TweetCount from "../Components/TweetCount";
import UrlList from "../../Components/UrlList";
import GexfExport from "../Components/GexfExport";

const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {ssr: false});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {ssr: false});
const BubbleChart = dynamic(import("../Components/BubbleChart"), {ssr: false});
const HeatMap = dynamic(import("../Components/HeatMap"), {ssr: false});
const HashtagGraph = dynamic(import("../Components/HashtagGraph"), {ssr: false});
const SocioSemGraph = dynamic(import("../Components/SocioSemGraph"), {ssr: false});
const CloudChart = dynamic(import("../Components/CloudChart"), {ssr: false});

export default function TwitterSnaResult(props) {

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const request = useSelector(state => state.twitterSna.request);
    const resultStore = useSelector(state => state.twitterSna.result);
    const [result, setResult] = useState(null);
    const [histogram, setHistogram] = useState(null);

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
       
            <Paper className={classes.root}>
                <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
                {
                    <TweetCount result={result} />
                }
                {
                    <PlotTimeLine result={result} />                    
                }
               
                {
                    request && request.userList && request.userList.length === 0 &&
                    result && result.pieCharts &&
                    <PlotPieChart result={result} request={request}/>
                }
                {
                    request && request.userList && request.userList.length === 0 &&
                    result && result.tweetCount &&
                    <BubbleChart result={result} request={request}/>
                }
                {
                    
                    <HeatMap result={result} request={request} />
                }
                {
                    request &&
                    <HashtagGraph result={result} request={request}/>
                }
                {
                    request &&
                    <SocioSemGraph result={result} request={request}/>
                }        
                {
                   request && 
                    <CloudChart result={result} request={request} />
                }   
                {
                    request &&
                    <GexfExport result={result} request={request} />
                }
                <Box m={3} />
                {
                    result.urls && 
                    <UrlList result={result} request={request} title_message={'twittersna_result_url_in_tweets'} 
                        tooltip_message={'twittersna_result_submit_twitter_sna'} downloadable={true}/>
                }     
            </Paper>
       
    );
};