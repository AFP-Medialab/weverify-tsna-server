import { createHeatMap } from "./heatMap";
import { INSTA_SNA_TYPE } from "../../../../shared/hooks/SnaTypes";
import { csvSnaCloudWordsResultSet, csvSnaCohashtagResultSet, csvSnaHeatMapResultSet, csvSnaHistogramResultSet, csvSnaPieChartResultSet, csvSnaSocioGraphResultSet } from "../../../../../redux/slices/tools/crowdTangleSnaSlice";

export const buildCoHashTag = async (hashtagWorker, data, dispatch) => {
    hashtagWorker.postMessage(data)
    hashtagWorker.onmessage = (evt) => {
      let coHashtagGraph = evt.data
      dispatch(csvSnaCohashtagResultSet(coHashtagGraph));
    }
    
};

export const wordCount = async (cloudWorker, data, dispatch) => {
  cloudWorker.postMessage(data);
  cloudWorker.onmessage = (evt) => {
    let wordCountResponse = evt.data
    dispatch(csvSnaCloudWordsResultSet(wordCountResponse));
  }
};

export const buildSocioGraph = async (socioWorker, data, dispatch) => {
    socioWorker.postMessage(data);
    socioWorker.onmessage = (evt) => {
      let socioSemantic4ModeGraph = JSON.parse(evt.data);
      dispatch(csvSnaSocioGraphResultSet(socioSemantic4ModeGraph));
    } 
    
};

export const buildPieCharts = async (pieChartsWorker, data, keywordTitles, dispatch, type) => {
    if(type === INSTA_SNA_TYPE){
      pieChartsWorker.postMessage({type: "INSTA", data: data})
    }
    else {
      pieChartsWorker.postMessage({type: "FB", data: data})
    }
    pieChartsWorker.onmessage = (evt) => {
      if(evt.data.type !== "BUILD"){
        let jsonPieChart = evt.data.response
        pieChartsWorker.postMessage({type: "BUILD", data: [jsonPieChart, keywordTitles]})
      }
      else {
        let pieCharts = evt.data.response
        dispatch(csvSnaPieChartResultSet(pieCharts));
      }
    }    
}

export const buildHistogramHeatMap = async (timelineWorker, data, dispatch, titleLabel, timeLabel, heatMapTitle)=>{
    timelineWorker.postMessage({
      type: "TIME_LINE", 
      data: [data, titleLabel, timeLabel]
    })
    timelineWorker.postMessage({
      type: "TIME_LINE_HEATMAP", 
      data: data
      })
    timelineWorker.onmessage = (evt) => {
      if(evt.data.type === "TIME_LINE"){
        let histogram = evt.data.response;
        dispatch(csvSnaHistogramResultSet(histogram));
      }
      if(evt.data.type === "TIME_LINE_HEATMAP"){
        let heatMap = createHeatMap(data, evt.data.data, heatMapTitle);
        dispatch(csvSnaHeatMapResultSet(heatMap));
      }
    }
  };
  