import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setCountResultFb
} from "../../../../../redux/actions/tools/facebookSnaActions";
import {
  getAggregationData,
  getTweets,
  getUserAccounts,
  getCloudTweets,
  getESQuery4Gexf,
} from "./call-elastic";
import { createTimeLineChart, getJsonDataForTimeLineChart } from "./timeline";
import { createPieCharts, getJsonDataForPieCharts } from "./pieCharts";
import { removeUnusedFields } from "../lib/displayTweets";
import socioWorker from "workerize-loader?inline!./socioSemGraph";
import cloudWorker from "workerize-loader?inline!./cloudChart";
import hashtagWorker from "workerize-loader?inline!./hashtagGraph";

import { createHeatMap } from "./heatMap";

import { getJsonDataForURLTable } from "./urlList";

import { setError } from "../../../../../redux/actions/errorActions";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

//////////////////////////////////////
//import {createCountFb} from "./count";

async function createCountFb (data) {
  let tot_interactions = 0;
  let tot_comments = 0;
  let tot_shares = 0;
  let tot_likes = 0;

  for (let index in data) {
    if (typeof data[index].total_interactions === 'string')
    {
      tot_interactions += parseInt(data[index].total_interactions.replace(/,/g, ''));
    }
    else{
      tot_interactions += data[index].total_interactions;
    }
    tot_comments += data[index].comments;
    tot_shares += data[index].shares;
    tot_likes += data[index].likes;
  }
  
  const fbCount = {};
  fbCount.count = data.length;
  fbCount.total_interactions = tot_interactions;
  fbCount.likes = tot_likes;
  fbCount.comments = tot_comments;
  fbCount.shares = tot_shares;

  return fbCount;

};


const useFacebookSnaRequest = (data, keyword) => {
  const dispatch = useDispatch();
  const buildFirstFbGraph = (data) => {
    //buildHistogram(data);
    buildCountFb(data);
    //buildPieCharts(request, responseAggs);
    //buildUrls(responseAggs);
  }
  
  buildFirstFbGraph(data);
  //generateSecondGraph(request)
  //generateThirdGraph(request)
/*
  const buildHistogram = async (data)=>{
    const histogramFb = createTimeLineChartFb(data);
    dispatch(setHistogramResultFb(histogramFb));
  };
  */
 
  async function buildCountFb (data){
    const countFb = createCountFb(data);
    useDispatch(setCountResultFb(countFb));
  };


  


};
export default useFacebookSnaRequest;