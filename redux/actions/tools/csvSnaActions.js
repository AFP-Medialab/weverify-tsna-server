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
} from "../types/csvSnaTypes";

export const cleanCsvSnaState = () => {
  return {
      type: CSV_SNA_CLEAN,
    };
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
}
};
