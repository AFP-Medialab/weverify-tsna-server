

import {
  buildCoHashTag, 
  buildSocioGraph, 
  wordCount, 
  buildPieCharts, 
  buildHistogramHeatMap
} from './commonBuildResult'
import{FB_SNA_TYPE} from "../../../../shared/hooks/SnaTypes"
import { getJsonDataForURLTable } from "../../../Hooks/urlList";
import { csvSnaCountResultSet, csvSnaMaxProcessStageSet, csvSnaUrlsResultSet } from "../../../../../redux/slices/tools/crowdTangleSnaSlice";
import { snaTypeSet } from "../../../../../redux/slices/tools/snaTypeSlice";

const FB_SNA = {type:FB_SNA_TYPE, tsv:"/components/NavItems/tools/CrowdTangle.tsv", tsvInfo : "/components/fb/OnClickInfo.tsv" }

export const useFacebookResult = (workers, data, keyword, dispatch) => {
    dispatch(snaTypeSet(FB_SNA));
    buildFirstFbResult(workers, data, dispatch, keyword);
};

const buildFirstFbResult = (workers, data, dispatch, keyword) => {
  dispatch(csvSnaMaxProcessStageSet(13));
  let titleLabel = keyword("sna_time_chart_title");
  let timeLabel = keyword('sna_local_time');
  let heatMapTitle = keyword("ct_heatmap_chart_title")
  buildHistogramHeatMap(workers.timelineWorker, data, dispatch, titleLabel, timeLabel, heatMapTitle);
  buildCountFb( data, dispatch);
  buildPieChartsFB(workers.pieChartsWorker, data, dispatch, keyword);
  buildCoHashTag(workers.hashtagWorker, data, dispatch);
  buildSocioGraph(workers.socioWorker, data, dispatch);
  buildUrls(data, keyword, dispatch);
  wordCount(workers.cloudWorker, data, dispatch);
  }

  const buildCountFb = async (data, dispatch) => {
    const countFb = countFB(data)
    dispatch(csvSnaCountResultSet(countFb));
};

const buildPieChartsFB = async (pieChartsWorker, data, dispatch, keyword) => {
    const keywordTitles = [
      keyword("shared_cloud_chart_title"),
      keyword("likes_cloud_chart_title"),
      keyword("top_users_pie_chart_title"),
      keyword("mention_cloud_chart_title")
    ];
    buildPieCharts(pieChartsWorker, data, keywordTitles, dispatch, FB_SNA_TYPE);
};

const buildUrls = async (data, keyword, dispatch) => {
  const sorted = [...data].sort((a, b) => b.shares - a.shares);
  const sortedData = sorted.slice(0, 25);
  const urls = await getJsonDataForURLTable(
    sortedData,
    {
      "url" : keyword("ct_url"),
      "count": keyword("ct_sna_shares"), 
      "credibility" : keyword("sna_credibility")
    },
    {
      "url": "url", 
      "count" :"shares"
    }
  );
  dispatch(csvSnaUrlsResultSet(urls));
};

function countFB(data) {
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
}

export default useFacebookResult;