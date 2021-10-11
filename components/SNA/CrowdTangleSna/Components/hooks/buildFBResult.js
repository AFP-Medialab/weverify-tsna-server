import {
    setCountResult,
    setSnaType, 
    setMaxProcessStage
  } from "../../../../../redux/actions/tools/crowdTangleSnaActions";

import {
  buildCoHashTag, 
  buildSocioGraph, 
  buildUrls, 
  wordCount, 
  buildHeatMap, 
  buildPieCharts, 
  buildHistogram
} from './commonBuildResult'
import{FB_SNA_TYPE} from "../../../../shared/hooks/SnaTypes"

const FB_SNA= {snaType:FB_SNA_TYPE, tsv:"/components/NavItems/tools/CrowdTangle.tsv" }
export const useFacebookResult = (data, keyword, dispatch) => {
    dispatch(setSnaType(FB_SNA));
    buildFirstFbResult(data, dispatch, keyword);
};

const buildFirstFbResult = (data, dispatch, keyword) => {
    dispatch(setMaxProcessStage(13));
    let titleLabel = keyword("sna_time_chart_title");
    let timeLabel = keyword('sna_local_time');
    let heatMapTitle = keyword("ct_heatmap_chart_title")
    console.log("eed", titleLabel);
    console.log("eed2", timeLabel);
    console.log("eed3", heatMapTitle);
    buildHistogram(data, dispatch, titleLabel, timeLabel);
    buildCountFb(data, dispatch);
    buildPieChartsFB(data, dispatch, keyword);
    buildHeatMap(data, dispatch, heatMapTitle);
    buildCoHashTag(data, dispatch);
    buildSocioGraph(data, dispatch);
    buildUrls(data, keyword, dispatch);
    wordCount(data, dispatch);
  }

  const buildCountFb = async (data, dispatch) => {
    const countFb = countFB(data)
    dispatch(setCountResult(countFb));
};

const buildPieChartsFB = async (data, dispatch, keyword) => {
    const keywordTitles = [
      keyword("shared_cloud_chart_title"),
      keyword("likes_cloud_chart_title"),
      keyword("top_users_pie_chart_title"),
      keyword("mention_cloud_chart_title")
    ];
    buildPieCharts(data, keywordTitles, dispatch, FB_SNA_TYPE);
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