import cloudWorker from "workerize-loader?inline!./cloudChart";
import socioWorker from "workerize-loader?inline!./socioSemGraph";
import hashtagWorker from "workerize-loader?inline!./hashtagGraph";
import pieChartsWorker from "workerize-loader?inline!./pieCharts";
import timelineWorker from "workerize-loader?inline!./timeline";
import { getJsonDataForURLTable } from "./urlList";

import { createHeatMap } from "./heatMap";
import {
    setCoHashtagResult,
    setCloudWordsResult,
    setSocioGraphResult,
    setUrlsResult,
    setHeatMapResult,
    setPieChartsResult,
    setHistogramResult
  } from "../../../../../redux/actions/tools/crowdTangleSnaActions";
import { INSTA_SNA_TYPE } from "../../../../shared/hooks/SnaTypes";

export const buildCoHashTag = async (data, dispatch) => {
    const instance = hashtagWorker();
    const coHashtagGraph = await instance.createCoHashtagGraph(data);
    dispatch(setCoHashtagResult(coHashtagGraph));
};

export const wordCount = async (data, dispatch) => {
    const instance = cloudWorker();
    const wordCountResponse = await instance.createWordCloud(data);
    dispatch(setCloudWordsResult(wordCountResponse));
};

export const buildSocioGraph = async (data, dispatch) => {
    const instance = socioWorker();
    const socioSemantic4ModeGraphJson = await instance.createSocioSemantic4ModeGraph(
      data
    );
    const socioSemantic4ModeGraph = JSON.parse(socioSemantic4ModeGraphJson);
    dispatch(setSocioGraphResult(socioSemantic4ModeGraph));
};

 export const buildUrls = async (data, keyword, dispatch) => {
    const urls = getJsonDataForURLTable(
      data,
      keyword
    );
    dispatch(setUrlsResult(urls));
  };

 export const buildHeatMap = async (data, dispatch, keyword) => {
    const heatMap = createHeatMap(data, keyword);
    dispatch(setHeatMapResult(heatMap));
};

export const buildPieCharts = async (data, keywordTitles, dispatch, type) => {
    const instance = pieChartsWorker();
    let jsonPieChart = null;
    if(type === INSTA_SNA_TYPE){
      jsonPieChart = await instance.getJsonDataForPieChartsInsta(data);
    }
    else {
      jsonPieChart = await instance.getJsonDataForPieCharts(data);
    }
    const pieCharts = await instance.createPieCharts("",jsonPieChart,keywordTitles);
    dispatch(setPieChartsResult(pieCharts));
}

export const buildHistogram = async (data, dispatch, titleLabel, timeLabel)=>{
    const instance = timelineWorker();
    let getDataResult = await instance.getJsonDataForTimeLineChart(data)
    const histogram = await instance.createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], titleLabel, timeLabel);
    dispatch(setHistogramResult(histogram));
  };
  