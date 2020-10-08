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



const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {ssr: false});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {ssr: false});

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
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
            {
                result.histogram &&
                <PlotTimeLine result={result} />
                
            }
            {
                result && result.tweetCount &&
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading} >{keyword("tweetCounter_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                            <Grid container justify="space-around" spacing={2}
                                alignContent={"center"}>
                                <Grid item>
                                    <Typography variant={"h6"}>Tweets</Typography>
                                    <Typography variant={"h2"}>{result.tweetCount.count}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Retweets</Typography>
                                    <Typography variant={"h2"}>{result.tweetCount.retweet}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Likes</Typography>
                                    <Typography variant={"h2"}>{result.tweetCount.like}</Typography>
                                </Grid>
                            </Grid>
                            <Box m={3}/>
                            <OnClickInfo keyword={"twittersna_tweetnb_tip"}/>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            }
            
            {
                result.pieCharts &&
                <PlotPieChart result={result} />
            }
        </Paper>
    );
};