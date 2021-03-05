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