import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfoFB';
import HistoTweetsTable from "../Components/HistoTweetsTableCSV";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../styles/useMyStyles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {setTweetsDetailPanel} from "../../../../redux/actions/tools/twitterSnaActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {displayTweets} from "../../TwitterSna/lib/displayTweets";
import {setCSVHistoview} from "../../../../redux/actions/tools/csvSnaActions";
import { displayPostsFb,displayPostsInsta} from "./lib/displayPosts";


const Plot = createPlotComponent(plotly);
let from = "PLOT_PIE_CHART";


export default function PlotPieChart (props) { 
    const snatype = useSelector((state) => state.csvSna.result.snaType);
    const keyword = useLoadLanguage(snatype.tsv);
    const dispatch = useDispatch();  
    

   // const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const [pieCharts0, setPieCharts0] = useState(null);
    const [pieCharts1, setPieCharts1] = useState(null);
    const [pieCharts2, setPieCharts2] = useState(null);
    const [pieCharts3, setPieCharts3] = useState(null);
    //const charts = useSelector(state => state.twitterSna.pieCharts);
    const charts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];
    const donutIndex = useSelector(state => state.csvSna.result.donutIndex);
    const classes = useMyStyles();

    const [filesNames, setfilesNames] = useState(null);
    //Set the file name for wordsCloud export
    useEffect(() => {
        setfilesNames('PlotChart_' +  "_" + "props.request.from" + "_" + "props.request.until");
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request]);
///////// props.result.pieCharts
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
    }, [props.result.pieCharts, props.result.data]);

    useEffect(()=> {
        switch (donutIndex) {
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
    }, [donutIndex]);

    function downloadAsSVG(elementId, keyword, filesNames) {

        if (elementId === "top_words_cloud_chart") {
            let name = filesNames + '.svg';
            var svgEl = document.getElementById("top_words_cloud_chart").children[0].children[0];
            svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            var svgData = svgEl.outerHTML;
            var preface = '<?xml version="1.0" standalone="no"?>\r\n';
            var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
            var svgUrl = URL.createObjectURL(svgBlob);
            var downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = name;
            downloadLink.click();
        } else {
            let element = document.getElementById(elementId);
            let positionInfo = element.getBoundingClientRect();
            let height = positionInfo.height;
            let width = positionInfo.width;
            let name = keyword(elementId) + filesNames.replace("WordCloud", "");
            plotly.downloadImage(elementId,
                { format: 'svg', width: width * 1.2, height: height * 1.2, filename: name }
            );
        }
      }
       //Download as PNG
       function downloadAsPNG(elementId, keyword, filesNames) {
        let element = document.getElementById(elementId);
    
        if (elementId === "top_words_cloud_chart") {
            let name = filesNames + '.png';
            saveSvgAsPng(element.children[0].children[0], name, { backgroundColor: "white", scale: 2 });
        } else {
            let positionInfo = element.getBoundingClientRect();
            let height = positionInfo.height;
            let width = positionInfo.width;
            let name = keyword(elementId) + filesNames.replace("WordCloud", "") + '.png';
            plotly.downloadImage(elementId,
                { format: 'png', width: width * 1.2, height: height * 1.2, filename: name }
            );
        }
    }
    const typer =useSelector((state) => state.csvSna.result.snaType.snaType)
      //   console.log("PROPS ",typer)
    
    var onDonutsClick=(null,null);
    if(typer=="INSTA"){
      //  console.log("INSTAAAAAA")

         onDonutsClick = (data, index) => {
        
            console.log("DONUTS-DATA ", data)
            //console.log("DONUTS-CSV-tweets ", tweets)
    
            //For mention donuts
            if (index === 3) {
                console.log("INDEX=3")
    
                
                    let selectedUser = data.points[0].label;
                    let filteredTweets = state.result.data.filter(tweet => tweet.account !== undefined /*&& tweet.account.length > 0 && tweet.account.length !== null*/)
                        .filter(function (tweet) {
                            return tweet.account/*.toLowerCase()*/ === selectedUser/*.toLowerCase()*/;
                        });
                        console.log("filtered tweets  ",filteredTweets)
    
                    let dataToDisplay = displayPostsInsta(filteredTweets, keyword);
                    dataToDisplay["selected"] = selectedUser;
                    setPieCharts3(dataToDisplay);
                    dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
                
            }
            // For retweets, likes, top_user donut; typeof condition to avoid error when click on the center
            else {
            //    console.log("CENTER ")
                let selectedUser = data.points[0].label;
               // console.log("DONUT ", data)
               // console.log("DATA0 ",data.points[0].label)
                
                
    
                    let filteredTweets = state.result.data.filter(function (tweetObj) {
                        return tweetObj.account === selectedUser;
                    });
                    console.log("filtered tweets  ",filteredTweets)
    
                    
                    let dataToDisplay = index === 0 ? displayPostsInsta(filteredTweets, keyword, "retweetNb") : (index === 1 ? displayPostsInsta(filteredTweets, keyword, "nbLikes") : displayPostsInsta(filteredTweets, keyword));
                   // console.log("DATA_DISPLAY ",dataToDisplay)
                    
                    dataToDisplay["selected"] = selectedUser;
                    
                    switch (index) {
                        case 0:
                            setPieCharts0(dataToDisplay);
                           // dispatch(setTweetsDetailPanel(from+"_"+index, "dataToDisplay"));
                            dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));

                            break;
                        case 1:
                            setPieCharts1(dataToDisplay);
                            dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
    
                            break;
                        case 2:
                            setPieCharts2(dataToDisplay);
                            dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
                            break;
                        default:
                            break;
                    }
                    
                
            }
        
        };
      }
      else {
       // console.log("FACEBOOOOOK")
         onDonutsClick = (data, index) => {
        
          //  console.log("DONUTS-DATA ", data)
            //console.log("DONUTS-CSV-tweets ", tweets)
    
            //For mention donuts
            if (index === 3) {
                console.log("INDEX=3")
    
                
                    let selectedUser = data.points[0].label;
                    let filteredTweets = state.result.data.filter(tweet => tweet.page_name !== undefined && tweet.page_name.length > 0)
                        .filter(function (tweet) {
                            return tweet.page_name.toLowerCase() === selectedUser.toLowerCase();
                        });
                        console.log("filtered tweets  ",filteredTweets)
    
                    let dataToDisplay = displayPostsFb(filteredTweets, keyword);
                    dataToDisplay["selected"] = selectedUser;
                    setPieCharts3(dataToDisplay);
                    dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
                
            }
            // For retweets, likes, top_user donut; typeof condition to avoid error when click on the center
            else {
                console.log("The Other 3 PieGraphs ")
                let selectedUser = data.points[0].label;
                //console.log("DONUT ", data)
                //console.log("SELECTED=USER ",data.points[0].label)
                
                
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                    let filteredTweets = state.result.data.filter(function (tweetObj) {
                      //  return tweetObj.page_name.toLowerCase() === selectedUser.toLowerCase();
                      return tweetObj.page_name === selectedUser
                    });
                   // console.log("filtered tweets  ",filteredTweets)

               //     console.log("filtered tweets  ",filteredTweets)
    
                    
                    let dataToDisplay = index === 0 ? displayPostsFb(filteredTweets, keyword, "retweetNb") : (index === 1 ? displayPostsFb(filteredTweets, keyword, "nbLikes") : displayPostsFb(filteredTweets, keyword));
                //    console.log("DATA_DISPLAY ",dataToDisplay)
                    
                    dataToDisplay["selected"] = selectedUser;
                    
                    switch (index) {
                        case 0:
                            setPieCharts0(dataToDisplay);
                            dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
                            
                            break;
                        case 1:
                            setPieCharts1(dataToDisplay);
                            dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
    
                            break;
                        case 2:
                            setPieCharts2(dataToDisplay);
                            dispatch(setCSVHistoview(from+"_"+index, "dataToDisplay"));
                            break;
                        default:
                            break;
                    }
                    
                
            }
        
        };
      }


    const onDonutsClick1 = (data, index) => {
        
        console.log("DONUTS-DATA ", data)
        //console.log("DONUTS-CSV-tweets ", tweets)

        //For mention donuts
        if (index === 3) {
            console.log("INDEX=3")

            
                let selectedUser = data.points[0].label;
                let filteredTweets = state.result.data.filter(tweet => tweet.account !== undefined && tweet.account.length > 0)
                    .filter(function (tweet) {
                        return tweet.account.toLowerCase() === selectedUser.toLowerCase();
                    });
                    console.log("filtered tweets  ",filteredTweets)

                let dataToDisplay = displayPostsInsta(filteredTweets, keyword);
                dataToDisplay["selected"] = selectedUser;
                setPieCharts3(dataToDisplay);
                dispatch(setTweetsDetailPanel(from+"_"+index, "dataToDisplay"));
            
        }
        // For retweets, likes, top_user donut; typeof condition to avoid error when click on the center
        else {
           // console.log("CENTER ")
            let selectedUser = data.points[0].label;
           // console.log("DONUT ", data)
           // console.log("DATA0 ",data.points[0].label)
            
            

                let filteredTweets = state.result.data.filter(function (tweetObj) {
                    return tweetObj.account === selectedUser;
                });
                console.log("filtered tweets  ",filteredTweets)

                
                let dataToDisplay = index === 0 ? displayPostsInsta(filteredTweets, keyword, "retweetNb") : (index === 1 ? displayPostsInsta(filteredTweets, keyword, "nbLikes") : displayPostsInsta(filteredTweets, keyword));
                console.log("DATA_DISPLAY ",dataToDisplay)
                
                dataToDisplay["selected"] = selectedUser;
                
                switch (index) {
                    case 0:
                        setPieCharts0(dataToDisplay);
                        dispatch(setTweetsDetailPanel(from+"_"+index, "dataToDisplay"));
                        
                        break;
                    case 1:
                        setPieCharts1(dataToDisplay);
                        dispatch(setTweetsDetailPanel(from+"_"+index, "dataToDisplay"));

                        break;
                    case 2:
                        setPieCharts2(dataToDisplay);
                        dispatch(setTweetsDetailPanel(from+"_"+index, "dataToDisplay"));
                        break;
                    default:
                        break;
                }
                
            
        }
    
    };
   

return (
    state.result.pieCharts.map((obj, index) => {
                  
            return (
                <Accordion key={index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel" + index + "a-content"}
                        id={"panel" + index + "a-header"}
                    >
                        <Typography className={classes.heading}>{obj.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                            {
                                (obj.json === null || (obj.json[0].values.length === 1 && obj.json[0].values[0] === "")) &&
                                    <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                            }
                            {
                                obj.json !== null && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                <Grid container justifyContent="space-between" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadAsPNG(obj.title, keyword, filesNames)}>
                                            {
                                                keyword('twittersna_result_download_png')
                                            }
                                        </Button>

                                    </Grid>
                                    
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadAsSVG(obj.title, keyword, filesNames)}>
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
                                charts[index] && 
                                <HistoTweetsTable
                                    data={charts[index]} 
                                    from={from+ "_"+ index} 
                                />
                                /*
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
                                </div>*/
                            }
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )
                        
    })
)
}