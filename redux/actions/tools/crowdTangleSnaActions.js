import {
  CT_SNA_CLEAN,
  CT_COUNT_SET_RESULTS,
  CT_SNA_SET_TYPE,
  CT_HISTOGRAM_SET_RESULTS,
  CT_PIECHART_SET_RESULTS,
  CT_IS_LOADING,
  CT_PARSING_RESULT,
  CT_HISTOVIEW_RESULT,
  CT_PIE_CHART_RESULT,
  CT_BUBBLE_CHART_RESULT,
  SET_CT_SNA_HEATMAP_RESULTS,
  SET_HEAT_MAP_RESULT,
  SET_CT_COHASHTAG_RESULTS,
  SET_CT_URLS_RESULTS,
  SET_HASHTAG_GRAPH_RESULT,
  SET_CT_SNA_SOCIO_GRAPH_RESULTS,
  SET_CT_SNA_CLOUD_WORDS_RESULTS,
  CT_PROCESS_MAX_STAGE,
  CT_PROCESS_STAGE
} from "../types/crowdTangleSnaTypes";

export const cleanCsvSnaState = () => {
  return {
      type: CT_SNA_CLEAN,
    };
};
export const setCoHashtagResult = (result) => {
  return {
      type : SET_CT_COHASHTAG_RESULTS,
      payload :  result
  }
};
export const setUrlsResult = (result) => {
  return {
      type : SET_CT_URLS_RESULTS,
      payload :  result
  }
};
export const setSocioGraphResult = (result) => {
  return {
      type : SET_CT_SNA_SOCIO_GRAPH_RESULTS,
      payload :  result
  }
};

export const setCountResult = (count) => {
  return {
      type : CT_COUNT_SET_RESULTS,
      payload : count,
  };
};
export const setSnaType = (type) => {
  return {
      type : CT_SNA_SET_TYPE,
      payload : type,
  };
  
};

export const setHistogramResult = (result) => {
  return {
      type : CT_HISTOGRAM_SET_RESULTS,
      payload : result,
  };
  
};
export const setPieChartsResult = (result) => {
  return {
      type : CT_PIECHART_SET_RESULTS,
      payload : result,
  };
  
};

export const setCSVLoading = (bool, message) => {
  return {
    type: CT_IS_LOADING,
    payload: { loading: bool, loadingMessage: message },
  };
};
export const setCSVResult = (data) => {
  return {
    type: CT_PARSING_RESULT,
    payload: data,
  };
};

export const setHeatMapResult = (result) => {
  return {
      type : SET_CT_SNA_HEATMAP_RESULTS,
      payload :  result
  }
};

export const setCloudWordsResult = (result) => {
  return {
      type : SET_CT_SNA_CLOUD_WORDS_RESULTS,
      payload :  result
  }
};

export const setCSVHistoview = (from,data) => {
  switch(from){
    case "PLOT_LINE":
      return {
        type: CT_HISTOVIEW_RESULT,
        payload: data, 
      }
      case "PLOT_PIE_CHART_0":
            return {
                /*type : "SET_PIE_CHART_RESULT_0",
                payload :  data*/
                type : CT_PIE_CHART_RESULT,
                payload :  data != null ? null : 0
            }
        case "PLOT_PIE_CHART_1":
            return {
                type : CT_PIE_CHART_RESULT,
                payload :  data != null ? null : 1
            }
        case "PLOT_PIE_CHART_2":
            return {
                type : CT_PIE_CHART_RESULT,
                payload :  data != null ? null : 2
            }
        case "PLOT_PIE_CHART_3":
            return {
                type : CT_PIE_CHART_RESULT,
                payload :  data != null ? null : 3
            }
        case "PLOT_BUBBLE_CHART":
            return {
                type : CT_BUBBLE_CHART_RESULT,
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

export const setMaxProcessStage = (stage_max) => {
  return {
    type : CT_PROCESS_MAX_STAGE,
    payload : stage_max
  }
};

export const setProcessStage = (stage) => {
  return {
    type :  CT_PROCESS_STAGE,
    payload : stage
  }
};