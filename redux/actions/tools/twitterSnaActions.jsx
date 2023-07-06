import { SNA_SET_TYPE } from "../types/snaCommunTypes";
import {
  TSNA_PROCESS_MAX_STAGE,
  SET_TWITTER_SNA_NEW_REQUEST,
  SET_TWITTER_SNA_RESULT,
  SET_TWITTER_SNA_HEATMAP_RESULTS,
  SET_TWITTER_COHASHTAG_RESULTS,
  SET_TWITTER_SNA_SOCIO_GRAPH_RESULTS,
  SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE,
  SET_TWITTER_URLS_RESULTS,
  SET_TWITTER_SNA_CLOUD_WORDS_RESULTS,
  SET_TWITTER_SNA_LOADING,
} from "../types/tsnaTypes";
export const setTwitterSnaResult = (request, result, notification, loading) => {
  return {
    type: SET_TWITTER_SNA_RESULT,
    payload: {
      notification: notification,
      loading: loading,
      request: request,
      result: result,
    },
  };
};

export const setTwitterSnaNewRequest = (request) => {
  return {
    type: SET_TWITTER_SNA_NEW_REQUEST,
    payload: {
      request: request,
    },
  };
};

export const setTwitterSnaLoading = (loading, maxStage) => {
  return {
    type: SET_TWITTER_SNA_LOADING,
    payload: { load: loading, maxStage: maxStage },
  };
};

export const setTwitterSnaLoadingMessage = (message) => {
  return {
    type: "SET_TWITTER_SNA_LOADING_MSG",
    payload: message,
  };
};

export const cleanTwitterSnaState = () => {
  return {
    type: "TWITTER_SNA_CLEAN_STATE",
  };
};

export const setUserProfileMostActive = (data) => {
  return {
    type: SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE,
    payload: data,
  };
};
export const redirectFromPlugin = (data) => {
  return {
    type: "SET_TWITTER_SNA_REDIRECT_REQUEST",
    payload: data,
  };
};

export const setTSNAReset = (data) => {
  return {
    type: "SET_TWITTER_SNA_RESET",
    payload: data,
  };
};

export const setCloudWordsResult = (cloudWords) => {
  return {
    type: SET_TWITTER_SNA_CLOUD_WORDS_RESULTS,
    payload: cloudWords,
  };
};

export const setSocioGraphResult = (sociodata) => {
  return {
    type: SET_TWITTER_SNA_SOCIO_GRAPH_RESULTS,
    payload: sociodata,
  };
};
export const setHeatMapResult = (heatMapData) => {
  return {
    type: SET_TWITTER_SNA_HEATMAP_RESULTS,
    payload: heatMapData,
  };
};
export const setHistogramResult = (histogramData) => {
  return {
    type: "SET_TWITTER_SNA_HISTOGRAM_RESULTS",
    payload: histogramData,
  };
};
export const setCountResult = (countData) => {
  return {
    type: "SET_TWITTER_SNA_COUNT_RESULTS",
    payload: countData,
  };
};
export const setTweetResult = (tweetData) => {
  return {
    type: "SET_TWITTER_TWEETS_RESULTS",
    payload: tweetData,
  };
};
export const setPieChartsResult = (pieChartData) => {
  return {
    type: "SET_TWITTER_PIE_CHARTS_RESULTS",
    payload: pieChartData,
  };
};
export const setCoHashtagResult = (coHashtagData) => {
  return {
    type: SET_TWITTER_COHASHTAG_RESULTS,
    payload: coHashtagData,
  };
};
export const setUrlsResult = (urlData) => {
  return {
    type: SET_TWITTER_URLS_RESULTS,
    payload: urlData,
  };
};
export const setGexfExport = (gexfData) => {
  return {
    type: "SET_TWITTER_SNA_GEXF_EXPORT",
    payload: gexfData,
  };
};
export const setSnaType = (snaType) => {
  return {
    type: SNA_SET_TYPE,
    payload: snaType,
  };
};

export const setTweetsDetailPanel = (from, data) => {
  //console.log("from " + from)
  switch (from) {
    case "PLOT_LINE":
      return {
        type: "SET_HISTOGRAM_RESULT",
        payload: data,
      };
    case "PLOT_PIE_CHART_0":
      return {
        /*type : "SET_PIE_CHART_RESULT_0",
                payload :  data*/
        type: "SET_PIE_CHART_RESULT",
        payload: data != null ? null : 0,
      };
    case "PLOT_PIE_CHART_1":
      return {
        type: "SET_PIE_CHART_RESULT",
        payload: data != null ? null : 1,
      };
    case "PLOT_PIE_CHART_2":
      return {
        type: "SET_PIE_CHART_RESULT",
        payload: data != null ? null : 2,
      };
    case "PLOT_PIE_CHART_3":
      return {
        type: "SET_PIE_CHART_RESULT",
        payload: data != null ? null : 3,
      };
    case "PLOT_BUBBLE_CHART":
      return {
        type: "SET_BUBBLE_CHART_RESULT",
        payload: data,
      };
    case "PLOT_HEAT_MAP":
      return {
        type: "SET_HEAT_MAP_RESULT",
        payload: data,
      };
    case "PLOT_HASHTAG_GRAPH":
      return {
        type: "SET_HASHTAG_GRAPH_RESULT",
        payload: data,
      };
  }
};
export const setMaxProcessStage = (stage_max) => {
  return {
    type: TSNA_PROCESS_MAX_STAGE,
    payload: stage_max,
  };
};
