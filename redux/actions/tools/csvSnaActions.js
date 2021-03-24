import {CSV_SNA_CLEAN, CSV_COUNT_SET_RESULTS, CSV_SNA_SET_TYPE} from "../types/csvSnaTypes";

export const setCountResultFb = (countDataFb) => {
    return {
        type : "SET_FB_CSV_COUNT_RESULTS",
        payload :  countDataFb
    }
};

export const setCountResultInsta = (countDataInsta) => {
    return {
        type : "SET_INSTA_CSV_COUNT_RESULTS",
        payload :  countDataInsta
    }
};

export const setHistogramResultFb = (histogramDataFb) => {
    return {
        type : "SET_TWITTER_SNA_HISTOGRAM_RESULTS_FB",
        payload :  histogramDataFb
    }
};

export const setHistogramResultInsta = (histogramDataFb) => {
    return {
        type : "SET_TWITTER_SNA_HISTOGRAM_RESULTS_INSTA",
        payload :  histogramDataFb
    }
};

export const setPieChartsResultFb = (pieChartData) => {
    return {
        type : "SET_TWITTER_PIE_CHARTS_RESULTS_FB",
        payload :  pieChartData
    }
};

export const setPieChartsResultInsta = (pieChartData) => {
    return {
        type : "SET_TWITTER_PIE_CHARTS_RESULTS_INSTA",
        payload :  pieChartData
    }
};

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