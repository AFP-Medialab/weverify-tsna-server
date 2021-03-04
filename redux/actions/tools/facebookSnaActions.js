export const setCountResultFb = (countDataFb) => {
    return {
        type : "SET_FB_CSV_COUNT_RESULTS",
        payload :  countDataFb
    }
};

export const setHistogramResultFb = (histogramDataFb) => {
    return {
        type : "SET_TWITTER_SNA_HISTOGRAM_RESULTS_FB",
        payload :  histogramDataFb
    }
};