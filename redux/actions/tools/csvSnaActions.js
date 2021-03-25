import {CSV_SNA_CLEAN, CSV_COUNT_SET_RESULTS, CSV_SNA_SET_TYPE,CSV_HISTOGRAM_SET_RESULTS,CSV_PIECHART_SET_RESULTS} from "../types/csvSnaTypes";

export const cleanCsvSnaState = () => {
    return {
        type: CSV_SNA_CLEAN
    }
};

export const setCountResult = (count) => {
    return {
        type : CSV_COUNT_SET_RESULTS,
        payload : count
    }
};
export const setSnaType = (type) => {
    return {
        type : CSV_SNA_SET_TYPE,
        payload : type
    }
    
};

export const setHistogramResult = (result) => {
    return {
        type : CSV_HISTOGRAM_SET_RESULTS,
        payload : result
    }
    
};
export const setPieChartsResultFb = (result) => {
    return {
        type : CSV_PIECHART_SET_RESULTS,
        payload : result
    }
    
};

