

  import {
    buildCoHashTag, 
    buildSocioGraph, 
    wordCount,  
    buildPieCharts, 
    buildHistogramHeatMap
  } from './commonBuildResult'
import { INSTA_SNA_TYPE } from "../../../../shared/hooks/SnaTypes";
import { getJsonDataForURLTable } from "../../../Hooks/urlList";
import { csvSnaCountResultSet, csvSnaMaxProcessStageSet, csvSnaUrlsResultSet } from "../../../../../redux/slices/tools/crowdTangleSnaSlice";
import { snaTypeSet } from "../../../../../redux/slices/tools/snaTypeSlice";

const INSTA_SNA = {type:INSTA_SNA_TYPE, tsv:"/components/NavItems/tools/CrowdTangle.tsv" , tsvInfo : "/components/insta/OnClickInfo.tsv"}
export const useInstagramResult = (workers, data, keyword, dispatch) => {
    dispatch(snaTypeSet(INSTA_SNA));
    buildFirstInstaResult(workers, data, dispatch, keyword);
}

const buildFirstInstaResult = (workers, data, dispatch, keyword) => {
 
  dispatch(csvSnaMaxProcessStageSet(13));
  let titleLabel = keyword("sna_time_chart_title");
  let timeLabel = keyword('sna_local_time');
  let heatMapTitle = keyword("ct_heatmap_chart_title")
  buildHistogramHeatMap(workers.timelineWorker, data, dispatch, titleLabel, timeLabel, heatMapTitle);
  buildCountInsta(data, dispatch);
  buildPieChartsInsta(workers.pieChartsWorker, data, dispatch, keyword);
  buildCoHashTag(workers.hashtagWorker, data, dispatch);
  buildSocioGraph(workers.socioWorker, data, dispatch);
  buildUrls(data, keyword, dispatch);
  wordCount(workers.cloudWorker, data, dispatch);
}

const buildPieChartsInsta = async (pieChartsWorker, data, dispatch, keyword) => {
  const keywordTitles = [
    keyword("shared_cloud_chart_title"),
    keyword("likes_cloud_chart_title"),
    keyword("top_users_pie_chart_title"),
    keyword("mention_cloud_chart_title")
  ];
  buildPieCharts(pieChartsWorker, data, keywordTitles, dispatch, INSTA_SNA_TYPE);
};

/////////////////////////////////////////////////////COUNT INSTA

const buildCountInsta = (data, dispatch) => {
  const instaCount = countInsta(data)
  dispatch(csvSnaCountResultSet(instaCount));
};

const buildUrls = async (data, keyword, dispatch) => {
  //const sortProperty = data.total_interactions;
  const sorted = [...data].sort((a, b) => b.total_interactions - a.total_interactions);
  const sortedData = sorted.slice(0, 25);
  const urls = await getJsonDataForURLTable(
    sortedData,
    {
      "url" : keyword("ct_url"),
      "count": keyword("ct_sna_total_interactions"), 
      "credibility" : keyword("sna_credibility")
    },
    {
      "url": "url", 
      "count" :"total_interactions"
    }
  );
  dispatch(csvSnaUrlsResultSet(urls));
};

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