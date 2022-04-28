import { createHeatMap } from "./heatMap";
import {
    setCoHashtagResult,
    setCloudWordsResult,
    setSocioGraphResult,
    setHeatMapResult,
    setPieChartsResult,
    setHistogramResult
  } from "../../../../../redux/actions/tools/crowdTangleSnaActions";
import { INSTA_SNA_TYPE } from "../../../../shared/hooks/SnaTypes";

export const buildCoHashTag = async (hashtagWorker, data, dispatch) => {
    hashtagWorker.postMessage(data)
    hashtagWorker.onmessage = (evt) => {
      let coHashtagGraph = evt.data
      dispatch(setCoHashtagResult(coHashtagGraph));
    }
    
};

export const wordCount = async (cloudWorker, data, dispatch) => {
  cloudWorker.postMessage(data);
  cloudWorker.onmessage = (evt) => {
    let wordCountResponse = evt.data
    dispatch(setCloudWordsResult(wordCountResponse));
  }
};

export const buildSocioGraph = async (socioWorker, data, dispatch) => {
    socioWorker.postMessage(data);
    socioWorker.onmessage = (evt) => {
      let socioSemantic4ModeGraph = JSON.parse(evt.data);
      dispatch(setSocioGraphResult(socioSemantic4ModeGraph));
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
        dispatch(setPieChartsResult(pieCharts));
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
        dispatch(setHistogramResult(histogram));
      }
      if(evt.data.type === "TIME_LINE_HEATMAP"){
        let heatMap = createHeatMap(data, evt.data.data, heatMapTitle);
        dispatch(setHeatMapResult(heatMap));
      }
    }
  };
  