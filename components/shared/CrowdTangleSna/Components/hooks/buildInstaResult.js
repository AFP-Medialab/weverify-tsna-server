import {
    setCountResult,
    setSnaType,
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

  const INSTA_SNA_TYPE= {snaType:"INSTA",tsv:"/components/CsvInsta.tsv" }
 export const useInstagramResult = (data, keyword, dispatch) => {
    dispatch(setSnaType(INSTA_SNA_TYPE));
    buildFirstInstaResult(data, dispatch, keyword);
}

const buildFirstInstaResult = (data, dispatch, keyword) => {
  let titleLabel = keyword("user_time_chart_title");
  let timeLabel = keyword('twitter_local_time', timeLabel);
  buildHistogram(data, dispatch, titleLabel);
  buildCountInsta(data, dispatch);
  buildPieChartsInsta(data, dispatch, keyword);
  buildHeatMap(data, dispatch, keyword);
  buildCoHashTag(data, dispatch);
  buildSocioGraph(data, dispatch);
  buildUrls(data, keyword, dispatch);
  wordCount(data, dispatch);
}

const buildPieChartsInsta = async (data, dispatch, keyword) => {
  const keywordTitles = [
    keyword("retweets_cloud_chart_title"),
    keyword("likes_cloud_chart_title"),
    keyword("top_users_pie_chart_title"),
    keyword("mention_cloud_chart_title")
  ];
  buildPieCharts(data, keywordTitles, dispatch, INSTA_SNA_TYPE.snaType);
};

/////////////////////////////////////////////////////COUNT INSTA

const buildCountInsta = (data, dispatch) => {
  const instaCount = countInsta(data)
  dispatch(setCountResult(instaCount));
}

function countInsta(data) {
  let tot_interactions = 0;
  let tot_comments = 0;
  let tot_likes = 0;
  for (let index in data) {
    if (typeof data[index].total_interactions === "string") {
      tot_interactions += parseInt(
        data[index].total_interactions.replace(/,/g, "")
      );
    } else {
      tot_interactions += data[index].total_interactions;
    }
    tot_comments += data[index].comments;
    tot_likes += data[index].likes;
  }

  const instaCount = {};
  instaCount.count = data.length;
  instaCount.total_interactions = tot_interactions;
  instaCount.likes = tot_likes;
  instaCount.comments = tot_comments;
  return instaCount;
};

export default useInstagramResult;