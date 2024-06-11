import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import plotly from 'plotly.js-dist';
import React, { useEffect, useState } from 'react';
import createPlotComponent from 'react-plotly.js/factory';
import { useDispatch, useSelector } from "react-redux";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import HistoTweetsTable from "./HistoTweetsTableCSV";
import { displayPostsFb, displayPostsInsta } from "./lib/displayPosts";
import { setHistoview } from "../CrowdTangleSnaComponent";
import { setTweetsDetail } from "../../TwitterSna/TwitterSna";
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";



const Plot = createPlotComponent(plotly);
let from = "PLOT_PIE_CHART";


export default function PlotPieChart (props) { 
    const sna = useSelector((state) => state.sna);
    const keyword = i18nLoadNamespace("components/NavItems/tools/CrowdTangle");
    const dispatch = useDispatch();  
    

   // const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const [pieCharts0, setPieCharts0] = useState(null);
    const [pieCharts1, setPieCharts1] = useState(null);
    const [pieCharts2, setPieCharts2] = useState(null);
    const [pieCharts3, setPieCharts3] = useState(null);
    //const charts = useSelector(state => state.twitterSna.pieCharts);
    const charts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];
    const donutIndex = useSelector(state => state.ctSna.result.donutIndex);
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
    const typer = sna.type;
      //   console.log("PROPS ",typer)
    
    var onDonutsClick=(null,null);
    if(typer=="INSTA"){
      //  console.log("INSTAAAAAA")

         onDonutsClick = (data, index) => {
        
            //console.log("DONUTS-DATA ", data)
            //console.log("DONUTS-CSV-tweets ", tweets)
    
            //For mention donuts
            if (index === 3) {
                //console.log("INDEX=3")
    
                
                    let selectedUser = data.points[0].label;
                    let filteredTweets = state.result.data.filter(tweet => tweet.account !== undefined /*&& tweet.account.length > 0 && tweet.account.length !== null*/)
                        .filter(function (tweet) {
                            return tweet.account/*.toLowerCase()*/ === selectedUser/*.toLowerCase()*/;
                        });
                        //console.log("filtered tweets  ",filteredTweets)
    
                    let dataToDisplay = displayPostsInsta(filteredTweets, keyword);
                    dataToDisplay["selected"] = selectedUser;
                    setPieCharts3(dataToDisplay);
                    setHistoview(from+"_"+index, "dataToDisplay", dispatch);
                
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
                    //console.log("filtered tweets  ",filteredTweets)
    
                    
                    let dataToDisplay = index === 0 ? displayPostsInsta(filteredTweets, keyword, "retweetNb") : (index === 1 ? displayPostsInsta(filteredTweets, keyword, "nbLikes") : displayPostsInsta(filteredTweets, keyword));
                   // console.log("DATA_DISPLAY ",dataToDisplay)
                    
                    dataToDisplay["selected"] = selectedUser;
                    
                    switch (index) {
                        case 0:
                            setPieCharts0(dataToDisplay);
                           // dispatch(setTweetsDetailPanel(from+"_"+index, "dataToDisplay"));
                            setHistoview(from+"_"+index, "dataToDisplay", dispatch);

                            break;
                        case 1:
                            setPieCharts1(dataToDisplay);
                            setHistoview(from+"_"+index, "dataToDisplay", dispatch);
    
                            break;
                        case 2:
                            setPieCharts2(dataToDisplay);
                            setHistoview(from+"_"+index, "dataToDisplay", dispatch);
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
                //console.log("INDEX=3")
    
                
                    let selectedUser = data.points[0].label;
                    let filteredTweets = state.result.data.filter(tweet => tweet.page_name !== undefined && tweet.page_name.length > 0)
                        .filter(function (tweet) {
                            return tweet.page_name.toLowerCase() === selectedUser.toLowerCase();
                        });
                        //console.log("filtered tweets  ",filteredTweets)
    
                    let dataToDisplay = displayPostsFb(filteredTweets, keyword);
                    dataToDisplay["selected"] = selectedUser;
                    setPieCharts3(dataToDisplay);
                    setHistoview(from+"_"+index, "dataToDisplay", dispatch);
                
            }
            // For retweets, likes, top_user donut; typeof condition to avoid error when click on the center
            else {
                //console.log("The Other 3 PieGraphs ")
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
                            setHistoview(from+"_"+index, "dataToDisplay", dispatch);
                            
                            break;
                        case 1:
                            setPieCharts1(dataToDisplay);
                            setHistoview(from+"_"+index, "dataToDisplay", dispatch);
    
                            break;
                        case 2:
                            setPieCharts2(dataToDisplay);
                            setHistoview(from+"_"+index, "dataToDisplay", dispatch);
                            break;
                        default:
                            break;
                    }
                    
                
            }
        
        };
      }


    const onDonutsClick1 = (data, index) => {
        
        //console.log("DONUTS-DATA ", data)
        //console.log("DONUTS-CSV-tweets ", tweets)

        //For mention donuts
        if (index === 3) {
            //console.log("INDEX=3")

            
                let selectedUser = data.points[0].label;
                let filteredTweets = state.result.data.filter(tweet => tweet.account !== undefined && tweet.account.length > 0)
                    .filter(function (tweet) {
                        return tweet.account.toLowerCase() === selectedUser.toLowerCase();
                    });
                    //console.log("filtered tweets  ",filteredTweets)

                let dataToDisplay = displayPostsInsta(filteredTweets, keyword);
                dataToDisplay["selected"] = selectedUser;
                setPieCharts3(dataToDisplay);
                setTweetsDetail(from+"_"+index, "dataToDisplay", dispatch);
            
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
                //console.log("filtered tweets  ",filteredTweets)

                
                let dataToDisplay = index === 0 ? displayPostsInsta(filteredTweets, keyword, "retweetNb") : (index === 1 ? displayPostsInsta(filteredTweets, keyword, "nbLikes") : displayPostsInsta(filteredTweets, keyword));
                //console.log("DATA_DISPLAY ",dataToDisplay)
                
                dataToDisplay["selected"] = selectedUser;
                
                switch (index) {
                    case 0:
                        setPieCharts0(dataToDisplay);
                        setTweetsDetail(from+"_"+index, "dataToDisplay", dispatch);
                        
                        break;
                    case 1:
                        setPieCharts1(dataToDisplay);
                        setTweetsDetail(from+"_"+index, "dataToDisplay", dispatch);

                        break;
                    case 2:
                        setPieCharts2(dataToDisplay);
                        setTweetsDetail(from+"_"+index, "dataToDisplay", dispatch);
                        break;
                    default:
                        break;
                }
                
            
        }
    
    };
   

return (
    state.result.pieCharts.map((obj, index) => {
                  
            return (

                <div key={index}>

                <Card >
                    <div style={{ position: "relative" }}>
                        <span id={"bubble" + index} style={{ position: "absolute", top: "-112px" }}></span>
                        {
                            obj.json !== null && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") ?
                                <CustomCardHeader
                                    title={obj.title}
                                    showHelp={true}
                                    helpText={obj.tip}

                                    showPNG={true}
                                    functionPNG={() =>
                                        downloadAsPNG(obj.title, keyword, filesNames)
                                    }
                                    showSVG={true}
                                    functionSVG={() =>
                                        downloadAsSVG(obj.title, keyword, filesNames)
                                    }
                                />
                            :
                                <CustomCardHeader
                                    title={obj.title}
                                    showHelp={true}
                                    helpText={obj.tip}
                                />

                        }
                        
                            <Box alignItems="center" justifyContent="center" width={"100%"} className={classes.cardsResults}>
                            {
                                (obj.json === null || (obj.json[0].values.length === 1 && obj.json[0].values[0] === "")) &&
                                    <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
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
                                    
                                </div>
                            }
                            {
                                charts[index] && 
                                <HistoTweetsTable
                                    data={charts[index]} 
                                    from={from+ "_"+ index} 
                                />
                            }
                        </Box>
                        </div>
                </Card>
                    <Box m={3} />
                </div>
            )
                        
    })
)
}