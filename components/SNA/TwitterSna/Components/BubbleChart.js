import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import CircularProgress from "@material-ui/core/CircularProgress";
import { displayPosts } from "../../lib/displayTweets";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, {useEffect, useState} from 'react';
import { useSelector } from "react-redux";
import plotly from 'plotly.js-dist';
import {createBubbleChartOfMostActiveUsers} from "../Hooks/bubbleChart"
import createPlotComponent from 'react-plotly.js/factory';
import PostViewTable from "../../Components/PostViewTable";
import { CardHeader } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";

const Plot = createPlotComponent(plotly);

export default function BubbleChart(props) {
    
    const [bubbleTweets, setBubbleTweets] = useState(null);
    const topUserProfile = useSelector(state => state.twitterSna.topUser);

    const sna = useSelector(state => state.sna)
    const keyword = useLoadLanguage(sna.tsv);
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
    }, [props.result.bubbleChart]);

    useEffect(() => {
        setBubbleTweets(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request])

    const onBubbleChartClick = (data, result) => {
        let selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
        let filteredTweets = result.tweets.filter(function (tweetObj) {
            return tweetObj._source.screen_name.toLowerCase() === selectedUser.toLowerCase();
        });
        setBubbleTweets(displayPosts(filteredTweets, keyword));
    
    }

    return (


        <Card >
            <CustomCardHeader title={keyword("bubble_chart_title")} showHelp={true} helpText={"twittersna_bubble_chart_tip"} />
                
            {
                topUserProfile && topUserProfile.length !== 0 &&
                <div style={{ width: '100%', }} className={classes.cardsResults}>
                    { 
                        [createBubbleChartOfMostActiveUsers(topUserProfile, props.request, props.result, keyword)].map((bubbleChart) => {
                            return (
                                <div key={Math.random()}>
                                    <Plot useResizeHandler
                                        style={{ width: '100%', height: "600px" }}
                                        data={bubbleChart.data}
                                        layout={bubbleChart.layout}
                                        config={bubbleChart.config}
                                        onClick={(e) => onBubbleChartClick(e, props.result)}
                                        
                                    />
                                    <Box m={1} />
                                    <Box m={2} />
                                </div>
                            )
                        })
                    }
                    {
                        bubbleTweets &&
                        <PostViewTable 
                            snatype={sna} 
                            setTypeValue={setBubbleTweets} 
                            data={bubbleTweets} 
                            downloadEnable={true} 
                            request={props.request}
                            csvArr={bubbleTweets.csvArr} 
                            selected={bubbleTweets.selected}/>
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
        </Card>
        
    )
}