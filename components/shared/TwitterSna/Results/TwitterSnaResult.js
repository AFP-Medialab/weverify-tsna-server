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
import Button from "@material-ui/core/Button";
import TwitterIcon from '@material-ui/icons/Twitter';
import useLoadLanguage from "../../hooks/useLoadLanguage"

import CustomTable from "../../CustomTable/CustomTable";
import CustomTableURL from "../../CustomTable/CustomTableURL";

import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import Grid from "@material-ui/core/Grid";

import dynamic from "next/dynamic"


const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {ssr: false});


export default function TwitterSnaResult(props) {

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    
    const [result, setResult] = useState(null);
    const [histoVisible, setHistoVisible] = useState(true);
    const [histoTweets, setHistoTweets] = useState(null);


    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]
    //Set result 
    useEffect(() => {
        console.log(props.result);
        setResult(props.result);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.result), props.result]);

    //Initialize tweets arrays
    useEffect(() => {
        setHistoTweets(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.request), props.request])

    
    function downloadClick(csvArr, name, histo, type = "Tweets_") {
        let encodedUri = encodeURIComponent(csvArr);
        let link = document.createElement("a");
        link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodedUri);
        link.setAttribute("download", type + name + "_" + props.request.keywordList.join('&') + '_' + ((!histo) ? (props.request.from + "_" + props.request.until) : "") + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
   
    if (result === null)
        return <div />;
    
    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
            {
                result.histogram &&
                <Accordion expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(result.histogram.title)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {}
                        <div style={{ width: '100%', }}>
                            {(result.histogram.json && (result.histogram.json.length === 0) &&
                                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>)}
                            {(result.histogram.json && result.histogram.json.length !== 0) &&
                                <PlotTimeLine result={result} />
                            }
                            <Box m={1} />
                            <OnClickInfo keyword={"twittersna_timeline_tip"}/>
                            <Box m={2} />
                            {
                                histoTweets &&
                                <div>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"secondary"}
                                                onClick={() => setHistoTweets(null)}
                                            >
                                                {
                                                    keyword('twittersna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(histoTweets.csvArr, histoTweets.data[0].date.split(' ')[0], true)}>
                                                {
                                                    keyword('twittersna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable
                                        title={keyword("twittersna_result_slected_tweets")}
                                        colums={histoTweets.columns}
                                        data={histoTweets.data}
                                        actions={goToTweetAction}
                                    />
                                </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            }
        </Paper>
    );
};