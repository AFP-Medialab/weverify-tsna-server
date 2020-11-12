import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CustomTable from "../../CustomTable/CustomTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import {displayTweets} from "../lib/displayTweets"
import useLoadLanguage from "../../hooks/useLoadLanguage";
import useMyStyles from "../../styles/useMyStyles";
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import {setTweetsDetailPanel} from "../../../../redux/actions/tools/twitterSnaActions";
import plotly from 'plotly.js-dist';
import {createBubbleChartOfMostActiveUsers} from "../Hooks/bubbleChart"
import createPlotComponent from 'react-plotly.js/factory';
import TwitterIcon from '@material-ui/icons/Twitter';
import {downloadClick} from "../lib/downloadClick";

const Plot = createPlotComponent(plotly);
let from = "SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE";
export default function BubbleChart(props) {
    
    const dispatch = useDispatch();
    const [bubbleTweets, setBubbleTweets] = useState(null);
    const topUserProfile = useSelector(state => state.twitterSna.topUser);

    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const classes = useMyStyles();

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
    }, [props.result]);

    useEffect(() => {
        setBubbleTweets(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request])

    const onBubbleChartClick = (data, result) => {
        let selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
        let filteredTweets = result.tweets.filter(function (tweetObj) {
            return tweetObj._source.screen_name.toLowerCase() === selectedUser.toLowerCase();
        });
        setBubbleTweets(displayTweets(filteredTweets, keyword));
    
    }

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

    

    return (

        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel0a-content"}
                id={"panel0a-header"}
            >
                <Typography className={classes.heading}>{keyword("bubble_chart_title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                
                {
                    topUserProfile && topUserProfile.length !== 0 &&
                    <div style={{ width: '100%', }}>
                        { 
                            [createBubbleChartOfMostActiveUsers(topUserProfile, props.request, props.result, keyword)].map((bubbdleChart) => {
                                return (
                                    <div key={Math.random()}>
                                        <Plot useResizeHandler
                                            style={{ width: '100%', height: "600px" }}
                                            data={bubbdleChart.data}
                                            layout={bubbdleChart.layout}
                                            config={bubbdleChart.config}
                                            onClick={(e) => onBubbleChartClick(e, props.result)}
                                        />
                                        <Box m={1} />
                                        <OnClickInfo keyword={"twittersna_bubble_chart_tip"} />
                                        <Box m={2} />
                                    </div>
                                )
                            })
                        }
                        {
                            bubbleTweets &&
                            <div>
                                <Grid container justify="space-between" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"secondary"}
                                            onClick={() => setBubbleTweets(null)}>
                                            {
                                                keyword('twittersna_result_hide')
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadClick(props.request, bubbleTweets.csvArr, bubbleTweets.selected)}>
                                            {
                                                keyword('twittersna_result_download')
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Box m={2} />
                                <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                    colums={bubbleTweets.columns}
                                    data={bubbleTweets.data}
                                    actions={goToTweetAction}
                                />
                            </div>
                        }
                    </div>
                }
                {
                    ((topUserProfile && topUserProfile.length === 0) || props.result.tweetCount.count === "0") &&
                    <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                }
                {
                    (!topUserProfile && props.result.tweetCount.count !== "0") &&
                    <CircularProgress className={classes.circularProgress} />
                }
            </AccordionDetails>
        </Accordion>
        
    )
}