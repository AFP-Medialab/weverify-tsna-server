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
import HistoTweetsTable from "../Components/HistoTweetsTable";



const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {ssr: false});


export default function TwitterSnaResult(props) {

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    
    const [result, setResult] = useState(null);
    const [histoVisible, setHistoVisible] = useState(true);
    const [histoTweets, setHistoTweets] = useState(null);

    const [pieCharts0, setPieCharts0] = useState(null);
    const [pieCharts1, setPieCharts1] = useState(null);
    const [pieCharts2, setPieCharts2] = useState(null);
    const [pieCharts3, setPieCharts3] = useState(null);

    const hideTweetsView = (index) => {
        switch (index) {
            case 0:
                setPieCharts0(null);
                break;
            case 1:
                setPieCharts1(null);
                break;
            case 2:
                setPieCharts2(null);
                break;
            case 3:
                setPieCharts3(null);
                break;
            default:
                break;
        }
    };

    const pieCharts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];


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
        setPieCharts0(null);
        setPieCharts1(null);
        setPieCharts2(null);
        setPieCharts3(null);

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
                                <HistoTweetsTable histoTweets={histoTweets} />
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
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
            
            {/*
                result.pieCharts &&
                result.pieCharts.map((obj, index) => {
                    if ((props.request.userList.length === 0 || index === 3))
                        return (
                            <Accordion key={index}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={"panel" + index + "a-content"}
                                    id={"panel" + index + "a-header"}
                                >
                                    <Typography className={classes.heading}>{keyword(obj.title)}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                                        {
                                            (obj.json === null || (obj.json[0].values.length === 1 && obj.json[0].values[0] === "")) &&
                                                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                                        }
                                        {
                                            obj.json !== null && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                            <Grid container justify="space-between" spacing={2}
                                                alignContent={"center"}>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadAsPNG(obj.title)}>
                                                        {
                                                            keyword('twittersna_result_download_png')
                                                        }
                                                    </Button>

                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadClick(createCSVFromPieChart(obj), 
                                                                                    keyword(obj.title), 
                                                                                    false, 
                                                                                    "")}>
                                                        
                                                        CSV
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button
                                                        variant={"contained"}
                                                        color={"primary"}
                                                        onClick={() => downloadAsSVG(obj.title)}>
                                                        {
                                                            keyword('twittersna_result_download_svg')
                                                        }
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        }
                                        {
                                            (obj.json !== null) && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                            <div>
                                                <Plot
                                                    data={obj.json}
                                                    layout={obj.layout}
                                                    config={obj.config}
                                                    onClick={e => {
                                                        onDonutsClick(e, index)
                                                    }}
                                                    divId={obj.title}
                                                />
                                                <Box m={1} />
                                                <OnClickInfo keyword={obj.tip}/>
                                            </div>
                                        }
                                        {
                                            pieCharts[index] &&
                                            <div>
                                                <Grid container justify="space-between" spacing={2}
                                                    alignContent={"center"}>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"secondary"}
                                                            onClick={() => hideTweetsView(index)}>
                                                            {
                                                                keyword('twittersna_result_hide')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            variant={"contained"}
                                                            color={"primary"}
                                                            onClick={() => downloadClick(pieCharts[index].csvArr, (index === 3) ? "mentioned_" + pieCharts[index].selected : pieCharts[index].selected)}>
                                                            {
                                                                keyword('twittersna_result_download')
                                                            }
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                                <Box m={2} />
                                                <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                                    colums={pieCharts[index].columns}
                                                    data={pieCharts[index].data}
                                                    actions={goToTweetAction}
                                                />
                                            </div>
                                        }
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        )
                    else
                        return null;
                })*/
            }
        </Paper>
    );
};