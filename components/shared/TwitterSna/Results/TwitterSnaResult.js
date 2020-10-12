import { useDispatch, useSelector } from "react-redux";
import CloseResult from "../../CloseResult/CloseResult"
import { cleanTwitterSnaState } from "../../../../redux/actions/tools/twitterSnaActions";
import { Paper } from "@material-ui/core";
import useMyStyles from "../../styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../hooks/useLoadLanguage"

import CustomTable from "../../CustomTable/CustomTable";
import CustomTableURL from "../../CustomTable/CustomTableURL";

import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import Grid from "@material-ui/core/Grid";

import dynamic from "next/dynamic"
import TweetCount from "../Components/TweetCount";



const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {ssr: false});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {ssr: false});
const BubbleChart = dynamic(import("../Components/BubbleChart"), {ssr: false});
const HeatMap = dynamic(import("../Components/HeatMap"), {ssr: false});

export default function TwitterSnaResult(props) {

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    
    const [result, setResult] = useState(null);

    //Set result 
    useEffect(() => {
        setResult(props.result);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.result), props.result]);


   
    if (result === null)
        return <div />;
    
    return (
        <div className={classes.all}>
            <Paper className={classes.root}>
                <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
                {
                    result.histogram &&
                    <PlotTimeLine result={result} />
                    
                }
                {
                    result && result.tweetCount &&
                    <TweetCount result={result} />
                }
                
                {
                    result.pieCharts &&
                    <PlotPieChart result={result} />
                }
                {
                    //vérifier que correct, une fois l'authentification active
                    props.request.userList.length === 0 && 
                    result &&
                    <BubbleChart result={result} />
                }
                {
                    <HeatMap result={result} />
                }
            </Paper>
        </div>
    );
};