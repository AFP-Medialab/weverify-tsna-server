import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfo';
import {displayPostsInsta,displayPostsFb} from "./lib/displayPosts"
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import plotly from 'plotly.js-dist';
import {createBubbleChartOfMostActiveUsers} from "./hooks/bubbleChart"
import createPlotComponent from 'react-plotly.js/factory';
import {isNumeric} from "./hooks/bubbleChart"
import PostViewTable from "../../Components/PostViewTable";
const Plot = createPlotComponent(plotly);
//const tsv = "/localDictionary/tools/TwitterSna.tsv";
//const tsv = "/components/NavItems/tools/TwitterSna.tsv";

export default function BubbleChart(props) {
    
    const dispatch = useDispatch();
    const [bubbleTweets, setBubbleTweets] = useState(null);
    //const topUserProfile = useSelector(state => state.twitterSna.topUser);

    const sna = useSelector((state) => state.sna);

    console.log("SNATYPE ", sna)
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

    const onBubbleChartClick = (data, result) => {       
        var selectedUser;
        var filteredTweets;
        
        if(result.data[0].facebook_id) {
            selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
            filteredTweets = state.result.data.filter(function (tweetObj) {
                if (isNumeric(tweetObj.page_name)===false) {
                    return tweetObj.page_name.toLowerCase() === selectedUser.toLowerCase();

                }
                else{
                    return tweetObj.page_name.toString().toLowerCase() === selectedUser.toString().toLowerCase();
                } 
            });
            setBubbleTweets(displayPostsFb(filteredTweets));
        }
        else{
          //  console.log("INSTAAAAAAA")
            selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
            filteredTweets = state.result.data.filter(function (tweetObj) {
                if (isNumeric(tweetObj.user_name)===false) {
                    return tweetObj.user_name.toLowerCase() === selectedUser.toLowerCase();

                }
                else{
                    return tweetObj.user_name.toString().toLowerCase() === selectedUser.toString().toLowerCase();
                } 
                
            });
            setBubbleTweets(displayPostsInsta(filteredTweets));
        }

    }


    return (

        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel0a-content"}
                id={"panel0a-header"}
            >
                <Typography className={classes.heading}>{keyword("ct_bubble_chart_title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                   // topUserProfile && topUserProfile.length !== 0 &&
                    <div style={{ width: '100%', }}>
                        { 
                            [createBubbleChartOfMostActiveUsers(/*topUserProfile,*/ props.result, keyword)].map((bubbleChart) => {
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
                                        <OnClickInfo keyword={"twittersna_bubble_chart_tip"} />
                                        <Box m={2} />
                                    </div>
                                )
                            })
                        }
                        {
                            bubbleTweets &&
                            <PostViewTable snatype={sna} setTypeValue={setBubbleTweets} data={bubbleTweets} downloadEnable={false} />
                        }
                    </div>
                }
            </AccordionDetails>
        </Accordion>
        
    )
}