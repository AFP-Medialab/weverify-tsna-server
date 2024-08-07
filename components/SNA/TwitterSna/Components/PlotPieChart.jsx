import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import plotly from "plotly.js-dist";
import React, { useEffect, useState } from "react";
import createPlotComponent from "react-plotly.js/factory";
import { useDispatch, useSelector } from "react-redux";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { displayPosts } from "../../../SNA/lib/displayTweets";
import { downloadClick } from "../../lib/downloadClick";
import HistoTweetsTable from "../Components/HistoTweetsTable";
import { createCSVFromPieChart } from "../Hooks/pieCharts";
import {widgetSimpleFilename} from "../Hooks/tsnaUtils"
import { setTweetsDetail } from "../TwitterSna";
const Plot = createPlotComponent(plotly);
let from = "PLOT_PIE_CHART";

export default function PlotPieChart(props) {
  const dispatch = useDispatch();
  const sna = useSelector(state => state.sna)
  const keyword = useLoadLanguage(sna.tsv);
  const request = useSelector((state) => state.twitterSna.request);
  const [pieCharts0, setPieCharts0] = useState(null);
  const [pieCharts1, setPieCharts1] = useState(null);
  const [pieCharts2, setPieCharts2] = useState(null);
  const [pieCharts3, setPieCharts3] = useState(null);
  //const charts = useSelector(state => state.twitterSna.pieCharts);
  const charts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];
  const donutIndex = useSelector((state) => state.twitterSna.donutIndex);
  const classes = useMyStyles();

  const [filesNames, setfilesNames] = useState(null);
  //Set the file name for wordsCloud export
  useEffect(() => {
    setfilesNames(
      "PlotChart_" + widgetSimpleFilename(request)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.request]);

  const [state, setState] = useState({
    result: props.result,
  });
  useEffect(() => {
    setState({
      ...state,
      result: props.result,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.result.pieCharts, props.result.tweets]);

  useEffect(() => {
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
      let name = filesNames + ".svg";
      var svgEl = document.getElementById("top_words_cloud_chart").children[0]
        .children[0];
      svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      var svgData = svgEl.outerHTML;
      var preface = '<?xml version="1.0" standalone="no"?>\r\n';
      var svgBlob = new Blob([preface, svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
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
      let name = keyword(elementId) + "_" + filesNames.replace("WordCloud", "");
      plotly.downloadImage(elementId, {
        format: "svg",
        width: width * 1.2,
        height: height * 1.2,
        filename: name,
      });
    }
  }
  //Download as PNG
  function downloadAsPNG(elementId, keyword, filesNames) {
    let element = document.getElementById(elementId);

    if (elementId === "top_words_cloud_chart") {
      let name = filesNames + ".png";
      saveSvgAsPng(element.children[0].children[0], name, {
        backgroundColor: "white",
        scale: 2,
      });
    } else {
      let positionInfo = element.getBoundingClientRect();
      let height = positionInfo.height;
      let width = positionInfo.width;
      let name =
        keyword(elementId) + "_" + filesNames.replace("WordCloud", "");
      plotly.downloadImage(elementId, {
        format: "png",
        width: width * 1.2,
        height: height * 1.2,
        filename: name,
      });
    }
  }

  const onDonutsClick = (data, index, tweets) => {
    //For mention donuts
    if (index === 3) {
      if (tweets != null && typeof data.points[0].label != "undefined") {
        let selectedUser = data.points[0].label;
        let filteredTweets = tweets
          .filter(
            (tweet) =>
              tweet._source.user_mentions !== undefined &&
              tweet._source.user_mentions.length > 0
          )
          .filter(function (tweet) {
            let lcMentionArr = tweet._source.user_mentions.map((v) =>
              v.screen_name.toLowerCase()
            );
            return lcMentionArr.includes(selectedUser.toLowerCase());
          });
        let dataToDisplay = displayPosts(filteredTweets, keyword);
        dataToDisplay["selected"] = selectedUser;
        setPieCharts3(dataToDisplay);
        setTweetsDetail(from + "_" + index, "dataToDisplay", dispatch);
      }
    }
    // For retweets, likes, top_user donut; typeof condition to avoid error when click on the center
    else {
      if (tweets != null && typeof data.points[0].label != "undefined") {
        let selectedUser = data.points[0].label;
        let filteredTweets = tweets.filter(function (tweetObj) {
          return (
            tweetObj._source.screen_name.toLowerCase() ===
            selectedUser.toLowerCase()
          );
        });
        let dataToDisplay =
          index === 0
            ? displayPosts(filteredTweets, keyword, "retweetNb")
            : index === 1
            ? displayPosts(filteredTweets, keyword, "nbLikes")
            : displayPosts(filteredTweets, keyword);

        dataToDisplay["selected"] = selectedUser;
        switch (index) {
          case 0:
            setPieCharts0(dataToDisplay);
            setTweetsDetail(from + "_" + index, "dataToDisplay", dispatch);
            break;
          case 1:
            setPieCharts1(dataToDisplay);
            setTweetsDetail(from + "_" + index, "dataToDisplay", dispatch);
            break;
          case 2:
            setPieCharts2(dataToDisplay);
            setTweetsDetail(from + "_" + index, "dataToDisplay", dispatch);
            break;
          default:
            break;
        }
      }
    }
  };
  return state.result.pieCharts.map((obj, index) => {
    if (request.userList.length === 0 || index === 3) {
      return (
        <div key={index}>

        
        <Card >
          <div style={{ position: "relative" }}>
          <span id={"bubble" + index}  style={{ position: "absolute", top: "-112px" }}></span>
          
            <CustomCardHeader 
                title={(index+3) + ". " + keyword(obj.title)} 
              showHelp={true} 
              helpText={obj.tip} 
              showPNG={true} 
              functionPNG={() =>
                downloadAsPNG(obj.title, keyword, filesNames)
              }
              showCSV={true}
              functionCSV={() =>
                downloadClick(
                  request,
                  createCSVFromPieChart(obj),
                  keyword(obj.title),
                  false,
                  ""
                )
              }
              showSVG={true}
              functionSVG={() =>
                  downloadAsSVG(obj.title, keyword, filesNames)
              }
              />
          <Box alignItems="center" justifyContent="center" width={"100%"} className={classes.cardsResults}>
              {(obj.json === null ||
                (obj.json[0].values.length === 1 &&
                  obj.json[0].values[0] === "")) && (
                <Typography variant={"body2"}>
                  {keyword("twittersna_no_data")}
                </Typography>
              )}
              {obj.json !== null &&
                !(
                  obj.json[0].values.length === 1 &&
                  obj.json[0].values[0] === ""
                ) && (
                  <div>
                  {}
                  </div>
                )}
              {obj.json !== null &&
                !(
                  obj.json[0].values.length === 1 &&
                  obj.json[0].values[0] === ""
                ) && (
                  <div>
                    <Plot
                      data={obj.json}
                      layout={obj.layout}
                      config={obj.config}
                      onClick={(e) => {
                        onDonutsClick(e, index, state.result.tweets);
                      }}
                      divId={obj.title}
                    />
                    <Box m={1} />
                  </div>
                )}
              {
                charts[index] && 
                (
                  <HistoTweetsTable
                    data={charts[index]}
                    from={from + "_" + index}
                  />
                )
              }
            </Box>
            </div>
        </Card>
        <Box m={3}/>

        </div>
      );
    } else return null;
  });
}
