import {
    setCountResult,
    setSnaType,
    setMaxProcessStage,
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
import { INSTA_SNA_TYPE } from "../../../../shared/hooks/SnaTypes";

const INSTA_SNA = {type:INSTA_SNA_TYPE, tsv:"/components/NavItems/tools/CrowdTangle.tsv" , tsvInfo : "/components/insta/OnClickInfo.tsv"}
export const useInstagramResult = (data, keyword, dispatch) => {
    dispatch(setSnaType(INSTA_SNA));
    buildFirstInstaResult(data, dispatch, keyword);
}

const buildFirstInstaResult = (data, dispatch, keyword) => {
  dispatch(setMaxProcessStage(13));
  let titleLabel = keyword("sna_time_chart_title");
  let timeLabel = keyword('sna_local_time');
  let heatMapTitle = keyword("ct_heatmap_chart_title")
  buildHistogram(data, dispatch, titleLabel, timeLabel);
  buildCountInsta(data, dispatch);
  buildPieChartsInsta(data, dispatch, keyword);
  buildHeatMap(data, dispatch, heatMapTitle);
  buildCoHashTag(data, dispatch);
  buildSocioGraph(data, dispatch);
  buildUrls(data, keyword, dispatch);
  wordCount(data, dispatch);
}

const buildPieChartsInsta = async (data, dispatch, keyword) => {
  const keywordTitles = [
    keyword("shared_cloud_chart_title"),
    keyword("likes_cloud_chart_title"),
    keyword("top_users_pie_chart_title"),
    keyword("mention_cloud_chart_title")
  ];
  buildPieCharts(data, keywordTitles, dispatch, INSTA_SNA_TYPE);
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