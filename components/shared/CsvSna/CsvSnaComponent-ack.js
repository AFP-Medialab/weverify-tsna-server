import Paper from "@material-ui/core/Paper";
import useMyStyles from '../styles/useMyStyles';
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import { useEffect, useState, useRef } from "react";
import "../../../redux/actions/tools/twitterSnaActions"
import { useDispatch, useSelector, useStore } from "react-redux";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import MyErrorbar from "../ErrorBar/ErrorBar";
import {cleanError} from "../../../redux/actions/errorActions"
import FeedBack from "../FeedBack/FeedBack";
import CSVReader from "react-csv-reader";
import {countInsta} from "./Components/Insta/hooks/instaCount";
import {countFB} from "./Components/FB/hooks/FBcount";
import CircularProgress from "@material-ui/core/CircularProgress";
import timelineWorker from "workerize-loader?inline!./Components/Common/hooks/timeline";
import pieChartsWorker from "workerize-loader?inline!./Components/Common/hooks/pieCharts";
import { createHeatMap } from "./Components/Common/hooks/heatMap";
import hashtagWorker from "workerize-loader?inline!./Components/Common/hooks/hashtagGraph";
import { getJsonDataForURLTable } from "./Components/Common/hooks/urlList";
import socioWorker from "workerize-loader?inline!./Components/Common/hooks/socioSemGraph";
import cloudWorker from "workerize-loader?inline!./Components/Common/hooks/cloudChart";
/////////////////////////////////////////////////////////////////////////////

import {
  setCountResult,
  setSnaType,
  setHistogramResult,
  setPieChartsResult,
  setCSVLoading,
  setCSVResult,
  setCSVHistoview,
  setHeatMapResult,
  setCoHashtagResult,
  setUrlsResult,
  setSocioGraphResult,
  setCloudWordsResult,
} from "../../../redux/actions/tools/csvSnaActions";

import CsvSnaResults from "./Results/CsvSnaResults";



const FB_SNA_TYPE= {snaType:"FB",tsv:"/components/CsvFb.tsv" }
const INSTA_SNA_TYPE= {snaType:"INSTA",tsv:"/components/CsvInsta.tsv" }
const CsvSnaComponentold = () => {
  console.log("icici //////// ")
  const dispatch = useDispatch();
  const classes = useMyStyles();

  const keywordFB = useLoadLanguage(FB_SNA_TYPE.tsv);
  const keywordINSTA = useLoadLanguage(INSTA_SNA_TYPE.tsv);
 
  const error = useSelector(state => state.error);
  const loadingMessage = useSelector(state => state.csvSna.loadingMessage);
  const isloading = useSelector(state => state.csvSna.loading);
  const resultRedux = useSelector(state => state.csvSna.result);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////BUILD FB
const useFacebookResult = (data) => {
  dispatch(setSnaType(FB_SNA_TYPE));
  buildFirstFbResult(data);
  

}

const buildFirstFbResult = (data) => {
  buildHistogramFb(data);
  buildCountFb(data);
  buildPieCharts(data);
  buildHeatMapFB(data);
  buildCoHashTag(data);
  buildSocioGraph(data);
  buildUrls(data);
  wordCount(data);


}

/////////////////////CoHashTagResult common Insta & Facebook

const buildCoHashTag = async (data) => {
  const instance = hashtagWorker();
  const coHashtagGraph = await instance.createCoHashtagGraph(data);
  dispatch(setCoHashtagResult(coHashtagGraph));
};

//////////////////////////////////////////////////////COUNT FB
const buildCountFb = async (data) => {
    
  const countFb= countFB(data)
  dispatch(setCountResult(countFb));
};
//////////////////////////////////////////////////////HISTOGRAM FB

const buildHistogramFb = async (data)=>{
  const instance = timelineWorker();
  let getDataResult = await instance.getJsonDataForTimeLineChartFb(data)
  let titleLabel = keywordFB("user_time_chart_title");
  let timeLabel = keywordFB('twitter_local_time');
  const histogram = await instance.createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], titleLabel, timeLabel);
  dispatch(setHistogramResult(histogram));
};

////////////////////////////////////////////////////// PieChart FB
const buildPieCharts = async (data) => {
  const keywordTitles = [
    keywordFB("retweets_cloud_chart_title"),
    keywordFB("likes_cloud_chart_title"),
    keywordFB("top_users_pie_chart_title"),
    keywordFB("mention_cloud_chart_title")
  ];
  
  
  const instance = pieChartsWorker();
  const jsonPieChart = await instance.getJsonDataForPieCharts(data);
  const pieCharts = await instance.createPieCharts("",jsonPieChart,keywordTitles);
  dispatch(setPieChartsResult(pieCharts));
};

//////////////////////////////////////////////////// HeatMap FB

const buildHeatMapFB = async (data) => {
  const heatMap = createHeatMap(data, keywordFB);
  dispatch(setHeatMapResult(heatMap));
};

//////////////////////////////////////////////////////////////////////////////////BUILD INSTA

const useInstagramResult = (data) => {
  dispatch(setSnaType(INSTA_SNA_TYPE));
  buildFirstInstaResult(data);
}

const buildFirstInstaResult = (data) => {
  
  buildHistogramInsta(data);
  buildCountInsta(data);
  buildPieChartsInsta(data);
  buildHeatMapInsta(data);
  buildCoHashTag(data);
  buildSocioGraph(data);
  buildUrls(data);
  wordCount(data);

  //buildUrls(responseAggs);
}

//////////////////////////////////////////////////////COUNT INSTA

 const buildCountInsta = (data) => {

  const instaCount = countInsta(data)
  dispatch(setCountResult(instaCount));
}

/////////////////////////////////////////////////////TIMELINE Insta


  //handle options for csv
  const makeResultCsv = (data) => {
    var from =["PLOT_LINE","PLOT_PIE_CHART_0","PLOT_PIE_CHART_1","PLOT_PIE_CHART_2","PLOT_PIE_CHART_3","PLOT_HASHTAG_GRAPH"]
   
    for(var i=0; i<from.length;i++)

    {
    dispatch(setCSVHistoview(from[i], null)) 
    }
    dispatch(setCSVLoading(true, "processing"));
    dispatch(setHeatMapResult(null))
    dispatch(setCoHashtagResult(null))
    dispatch(setUrlsResult(null))
    dispatch(setCloudWordsResult(null))
    dispatch(setSocioGraphResult(null))

   // Plot(null)


    //facebook else instagram
    if(data[0].facebook_id) {
      useFacebookResult(data);
    }
    else{
      useInstagramResult(data);
    }
  }

  const completeCsvParse = (results, file) => {
    console.log("Parsing complete:", results, file);
    dispatch(setCSVResult(results.data));
  }


  //////////////////////////////////////// HISTOGRAM Insta
  const buildHistogramInsta = async (data)=>{
    const instance = timelineWorker();
    let getDataResult = await instance.getJsonDataForTimeLineChartInsta(data)
    let titleLabel = keywordINSTA("user_time_chart_title");
    let timeLabel = keywordINSTA('twitter_local_time');
    const histogram = await instance.createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], titleLabel, timeLabel);

    dispatch(setHistogramResult(histogram));
  };
  /////////////////////////////////////////////////////// PieChart Insta
const buildPieChartsInsta = async (data) => {
  const keywordTitles = [
    keywordINSTA("retweets_cloud_chart_title"),
    keywordINSTA("likes_cloud_chart_title"),
    keywordINSTA("top_users_pie_chart_title"),
    keywordINSTA("mention_cloud_chart_title")
  ];
  const instance = pieChartsWorker();
  const jsonPieChart = await instance.getJsonDataForPieChartsInsta(data);
  const pieCharts = await instance.createPieCharts("",jsonPieChart,keywordTitles);
  dispatch(setPieChartsResult(pieCharts));
};

/////////////////////////////////////////////////////// HeatMap Insta
const buildHeatMapInsta = async (data) => {
  const heatMap = createHeatMap(data, keywordINSTA);
  dispatch(setHeatMapResult(heatMap));
};

///////////////////////////////////////////////// SocioGraph Insta
const buildSocioGraph = async (data, topUser) => {
  const instance = socioWorker();
  const socioSemantic4ModeGraphJson = await instance.createSocioSemantic4ModeGraph(
    data,
    topUser
  );
  const socioSemantic4ModeGraph = JSON.parse(socioSemantic4ModeGraphJson);
  dispatch(setSocioGraphResult(socioSemantic4ModeGraph));
};
///////////////////////////////////////////////////// Cloud Chart 
const wordCount = async (data) => {
  const instance = cloudWorker();
  const wordCountResponse = await instance.createWordCloud(data);
  dispatch(setCloudWordsResult(wordCountResponse));
};

////////////////////////// UrlList Insta

const buildUrls = async (data) => {
  const urls = getJsonDataForURLTable(
    data,
    keywordINSTA
  );
  dispatch(setUrlsResult(urls));
};


const parseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_"),
  complete: completeCsvParse,
};

useEffect(() => {
  console.log("useeffect ....")
  if(!_.isNull(resultRedux)){
    if(!_.isEmpty(resultRedux.histogram) && !_.isEmpty(resultRedux.countSna) && !_.isEmpty(resultRedux.pieCharts)){
      dispatch(setCSVLoading(false, ""));
    }
  }
}, [resultRedux]);

  return (
      <div className={classes.all}>
          <Paper className={classes.root} style={{marginTop: "0px", marginBottom: "0px", paddingTop: "0px"}}>

                <div className="container">
                  <CSVReader
                    cssClass="react-csv-input"
                    label="Select CSV : "
                    onFileLoaded={makeResultCsv}
                    parserOptions={parseOptions}
                  />
                </div>

                <Box m={2} />

                {
                  (error !== null) &&
                  <MyErrorbar variant="error" message={error} onClick={() => dispatch(cleanError())}/>
                }

                <Box m={2} />
                <Typography>{loadingMessage}</Typography>
                {isloading &&   
                  <CircularProgress className={classes.circularProgress} />
                }

          </Paper>
          
          {
            resultRedux && <CsvSnaResults result={resultRedux} />
          }
      <FeedBack/>
    </div>
  );
}
export default CsvSnaComponentold;