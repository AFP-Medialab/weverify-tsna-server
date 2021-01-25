import {HYDRATE} from 'next-redux-wrapper';
const defaultResult = {
    cloudChart: { title: "top_words_cloud_chart_title" },
    coHashtagGraph: null,
    heatMap: null,
    histogram: null,
    pieCharts: [null,null,null,null], 
    socioSemantic4ModeGraph: null,
    tweetCount: 0,
    tweets: [null],
    urls: null

};
const defaultState = {
    notification: false,
    loading: false,
    loadingMessage: "",
    request: null,
    result: null,
    pieCharts: [null,null,null,null], 
    donutIndex: null,
    topUser: null
};

const facebookSnaReducer = (state = defaultState, {type, payload}) => {
    switch (type) {
        case HYDRATE:
            return {...state, ...payload};
        case "SET_FB_CSV_COUNT_RESULTS":
            return {...state, result: {...state.result, tweetCountFb: payload}} 
        case "SET_TWITTER_SNA_HISTOGRAM_RESULTS_FB":
            return {...state, result: {...state.result, histogramFb: payload}} 
        default:
            return state;
    }
};
export default facebookSnaReducer;