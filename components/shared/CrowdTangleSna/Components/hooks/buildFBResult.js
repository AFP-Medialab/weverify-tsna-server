import {
    setCountResult,
    setSnaType,
    setHistogramResult,   
  } from "../../../../../redux/actions/tools/crowdTangleSnaActions";

import {buildCoHashTag, buildSocioGraph, buildUrls, wordCount, buildHeatMap, buildPieCharts, buildHistogram} from './commonBuildResult'

const FB_SNA_TYPE= {snaType:"FB",tsv:"/components/CsvFb.tsv" }
export const useFacebookResult = (data, keyword, dispatch) => {
    dispatch(setSnaType(FB_SNA_TYPE));
    buildFirstFbResult(data, dispatch, keyword);
};

const buildFirstFbResult = (data, dispatch, keyword) => {
    let titleLabel = keyword("user_time_chart_title");
    let timeLabel = keyword('twitter_local_time', timeLabel);
    buildHistogram(data, dispatch, titleLabel, timeLabel);
    buildCountFb(data, dispatch);
    buildPieChartsFB(data, dispatch, keyword);
    buildHeatMap(data, dispatch, keyword);
    buildCoHashTag(data, dispatch);
    buildSocioGraph(data, dispatch);
    buildUrls(data, keyword, dispatch);
    wordCount(data, dispatch);
  }

  const buildCountFb = async (data, dispatch) => {
    const countFb = countFB(data)
    dispatch(setCountResult(countFb));
};

const buildHistogramFb = async (data, dispatch)=>{
    const instance = timelineWorker();
    let getDataResult = await instance.getJsonDataForTimeLineChart(data)
    let titleLabel = keywordFB("user_time_chart_title");
    let timeLabel = keywordFB('twitter_local_time');
    const histogram = await instance.createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], titleLabel, timeLabel);
    dispatch(setHistogramResult(histogram));
};

const buildPieChartsFB = async (data, dispatch, keyword) => {
    const keywordTitles = [
      keyword("retweets_cloud_chart_title"),
      keyword("likes_cloud_chart_title"),
      keyword("top_users_pie_chart_title"),
      keyword("mention_cloud_chart_title")
    ];
    buildPieCharts(data, keywordTitles, dispatch, FB_SNA_TYPE.snaType);
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