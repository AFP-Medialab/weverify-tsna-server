import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfoFB';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CustomTable from "../../CustomTable/CustomTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import {displayPostsInsta,displayPostsFb} from "./lib/displayPosts"
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import useMyStyles from "../../styles/useMyStyles";
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import {setTweetsDetailPanel} from "../../../../redux/actions/tools/twitterSnaActions";
import {setCSVHistoview} from "../../../../redux/actions/tools/crowdTangleSnaActions"
import plotly from 'plotly.js-dist';
import {createBubbleChartOfMostActiveUsers} from "./hooks/bubbleChart"
import createPlotComponent from 'react-plotly.js/factory';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import {downloadClick} from "./lib/downloadClick";
import {isNumeric} from "./hooks/bubbleChart"
const Plot = createPlotComponent(plotly);
//const tsv = "/localDictionary/tools/TwitterSna.tsv";
//const tsv = "/components/NavItems/tools/TwitterSna.tsv";
let from = "PLOT_BUBBLE_CHART";

export default function BubbleChart(props) {
    
    const dispatch = useDispatch();
    const [bubbleTweets, setBubbleTweets] = useState(null);
    //const topUserProfile = useSelector(state => state.twitterSna.topUser);

    const snatype = useSelector((state) => state.ctSna.result.snaType);

    console.log("SNATYPE ", snatype)
    const keyword = useLoadLanguage(snatype.tsv);
    //console.log("KEYWORD ", keyword)
    const typer =useSelector((state) => state.ctSna.result.snaType.snaType)

    const classes = useMyStyles();
    const request = useSelector(state => state.twitterSna.request);

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

    /*
    useEffect(() => {
        setBubbleTweets(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request])
*/
    const onBubbleChartClick = (data, result) => {
        //console.log("BUBBLE_DATA ", data)
        //console.log("BUBBLE_result ", result)
        var selectedUser;
        var filteredTweets;
        
        if(result.data[0].facebook_id) {
            //console.log("FACEEEEE")
            selectedUser = data.points[0].text.split("<br>")[0].replace("@","");
            filteredTweets = state.result.data.filter(function (tweetObj) {
                if (isNumeric(tweetObj.page_name)===false) {
                    return tweetObj.page_name.toLowerCase() === selectedUser.toLowerCase();

                }
                else{
                    return tweetObj.page_name.toString().toLowerCase() === selectedUser.toString().toLowerCase();
                } 
            });
            setBubbleTweets(displayPostsFb(filteredTweets, keyword));
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
            setBubbleTweets(displayPostsInsta(filteredTweets, keyword));
        }

    }
        var goToAction;

    if(typer=="INSTA"){
        goToAction = [
            {
             icon: InstagramIcon,
              tooltip: keyword("twittersna_result_go_to_tweet"),
              onClick: (event, rowData) => {
               window.open(rowData.link.props.href, "_blank");
              },
            },
          ];
      }
      else {
        goToAction = [
          {
           icon: FacebookIcon,
            tooltip: keyword("twittersna_result_go_to_tweet"),
            onClick: (event, rowData) => {
             window.open(rowData.link.props.href, "_blank");
            },
          },
        ];
      }

    

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
                            <div>
                                <Grid container justifyContent="space-between" spacing={2}
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
                                            onClick={() => downloadClick(request, bubbleTweets.csvArr, bubbleTweets.selected)}>
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
                                    actions={goToAction}
                                />
                            </div>
                        }
                    </div>
                }
                
                {/*
                    ((topUserProfile && topUserProfile.length === 0) || props.result.countSna.count === "0") &&
                    <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                */}
                {
                    (/*!topUserProfile && */props.result.countSna.count !== "0")
                }
            </AccordionDetails>
        </Accordion>
        
    )
}