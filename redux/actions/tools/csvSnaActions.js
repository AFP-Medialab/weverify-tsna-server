import {
  CSV_SNA_CLEAN,
  CSV_COUNT_SET_RESULTS,
  CSV_SNA_SET_TYPE,
  CSV_HISTOGRAM_SET_RESULTS,
  CSV_PIECHART_SET_RESULTS,
  CSV_IS_LOADING,
  CSV_PARSING_RESULT,
  CSV_HISTOVIEW_RESULT,
  CSV_PIE_CHART_RESULT,
  CSV_BUBBLE_CHART_RESULT,
  CSV_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE,
  SET_CSV_SNA_HEATMAP_RESULTS,
  SET_HEAT_MAP_RESULT,
  SET_CSV_COHASHTAG_RESULTS,
  SET_CSV_URLS_RESULTS,
  SET_HASHTAG_GRAPH_RESULT,
  SET_CSV_SNA_SOCIO_GRAPH_RESULTS,
} from "../types/csvSnaTypes";

export const cleanCsvSnaState = () => {
  return {
      type: CSV_SNA_CLEAN,
    };
};
export const setCoHashtagResult = (result) => {
  return {
      type : SET_CSV_COHASHTAG_RESULTS,
      payload :  result
  }
};
export const setUrlsResult = (result) => {
  return {
      type : SET_CSV_URLS_RESULTS,
      payload :  result
  }
};
export const setSocioGraphResult = (result) => {
  return {
      type : SET_CSV_SNA_SOCIO_GRAPH_RESULTS,
      payload :  result
  }
};

export const setCountResult = (count) => {
  return {
      type : CSV_COUNT_SET_RESULTS,
      payload : count,
  };
};
export const setSnaType = (type) => {
  return {
      type : CSV_SNA_SET_TYPE,
      payload : type,
  };
  
};

export const setHistogramResult = (result) => {
  return {
      type : CSV_HISTOGRAM_SET_RESULTS,
      payload : result,
  };
  
};
export const setPieChartsResult = (result) => {
  return {
      type : CSV_PIECHART_SET_RESULTS,
      payload : result,
  };
  
};

export const setCSVLoading = (bool, message) => {
  return {
    type: CSV_IS_LOADING,
    payload: { loading: bool, loadingMessage: message },
  };
};
export const setCSVResult = (data) => {
  return {
    type: CSV_PARSING_RESULT,
    payload: data,
  };
};

export const setUserProfileMostActive = (data) => {
  return {
      type : CSV_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE,
      payload : data
  }
};

export const setHeatMapResult = (result) => {
  return {
      type : SET_CSV_SNA_HEATMAP_RESULTS,
      payload :  result
  }
};

export const setCSVHistoview = (from,data) => {
  switch(from){
    case "PLOT_LINE":
      return {
        type: CSV_HISTOVIEW_RESULT,
        payload: data, 
      }
      case "PLOT_PIE_CHART_0":
            return {
                /*type : "SET_PIE_CHART_RESULT_0",
                payload :  data*/
                type : CSV_PIE_CHART_RESULT,
                payload :  data != null ? null : 0
            }
        case "PLOT_PIE_CHART_1":
            return {
                type : CSV_PIE_CHART_RESULT,
                payload :  data != null ? null : 1
            }
        case "PLOT_PIE_CHART_2":
            return {
                type : CSV_PIE_CHART_RESULT,
                payload :  data != null ? null : 2
            }
        case "PLOT_PIE_CHART_3":
            return {
                type : CSV_PIE_CHART_RESULT,
                payload :  data != null ? null : 3
            }
        case "PLOT_BUBBLE_CHART":
            return {
                type : CSV_BUBBLE_CHART_RESULT,
                payload :  data
          } 
          case "PLOT_HEAT_MAP":
            return {
                type : SET_HEAT_MAP_RESULT,
                payload :  data
        }
        case "PLOT_HASHTAG_GRAPH":
            return {
                type : SET_HASHTAG_GRAPH_RESULT,
                payload :  data
            }
             
}
};
