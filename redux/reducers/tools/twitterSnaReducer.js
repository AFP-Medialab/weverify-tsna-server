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

const twitterSnaReducer = (state = defaultState, {type, payload}) => {
    switch (type) {
        case HYDRATE:
            return {...state, ...payload};
        case "SET_TWITTER_SNA_NEW_REQUEST":
            return {...state, "notification" : false, "loading" : false,
                "request" : payload.request, "result" : null, "pieCharts" : [null,null,null,null], 
                "donutIndex" : null, "topUser" : null}
        case "SET_TWITTER_SNA_RESULT":
            state.notification = payload.notification;
            state.loading = payload.loading;
            state.request = payload.request;
            state.result = payload.result;
            return state;
        case "SET_TWITTER_SNA_LOADING":
            return {...state, "loading" : payload, "loadingMessage" : ((payload)? state.loadingMessage:"")};
        case "SET_TWITTER_SNA_LOADING_MSG":
            state.loadingMessage = payload;
            return state;
        case "TWITTER_SNA_CLEAN_STATE":
            return state = defaultState;
        case "SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE":           
            state.topUser = payload;
            return state;
        case "SET_TWITTER_SNA_GEXF_EXPORT":
            state.gexfExport = payload;
            return state;
        case "SET_HISTOGRAM_RESULT":
            state.histoview = payload;
            return state;
        case "SET_PIE_CHART_RESULT":            
            state.donutIndex = payload;
            return state;
        case "SET_BUBBLE_CHART_RESULT":
            state.bubbleChart = payload;
            return state;
        case "SET_HEAP_MAP_RESULT":
            state.bubbleChart = payload;
            return state;
        case "SET_TWITTER_SNA_REDIRECT_REQUEST":
            state.request = payload;           
            return state;
        case "SET_TWITTER_SNA_RESET":            
            return {...state, "request" : payload, "result" : null, "loadingMessage" : null};
        case "SET_TWITTER_SNA_HISTOGRAM_RESULTS":
             return {...state, result: {...state.result, histogram: payload}} 

        case "SET_TWITTER_TWEETS_RESULTS":
            return {...state, result: {...state.result, tweets: payload}} 
        case "SET_TWITTER_SNA_CLOUD_WORDS_RESULTS":
            return {...state, result: {...state.result, cloudChart: payload}} 
        case "SET_TWITTER_SNA_SOCIO_GRAPH_RESULTS":
            return {...state, result: {...state.result, socioSemantic4ModeGraph: payload}}
        case "SET_TWITTER_SNA_HEATMAP_RESULTS":
            return {...state, result: {...state.result, heatMap: payload}}
        case "SET_TWITTER_PIE_CHARTS_RESULTS":
            return {...state, result: {...state.result, pieCharts: payload}}
        case "SET_TWITTER_COHASHTAG_RESULTS":
            return {...state, result: {...state.result, coHashtagGraph: payload}}
        case "SET_TWITTER_URLS_RESULTS":
            return {...state, result: {...state.result, urls: payload}}
        case "SET_TWITTER_SNA_BUBBLE_CHART_RESULTS":
            return {...state, result: {...state.result, topUser: payload}}
        case "SET_TWITTER_SNA_GEXF_EXPORT":
            return {...state, result: {...state.result, gexf: payload}}
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        case "SET_FB_CSV_COUNT_RESULTS":
            return {...state, result: {...state.result, tweetCountFb: payload}} 
        case "SET_INSTA_CSV_COUNT_RESULTS":
            return {...state, result: {...state.result, tweetCountInsta: payload}} 
        case "SET_TWITTER_SNA_HISTOGRAM_RESULTS_FB":
            return {...state, result: {...state.result, histogramFb: payload}}
        case "SET_TWITTER_SNA_HISTOGRAM_RESULTS_INSTA":
            return {...state, result: {...state.result, histogramInsta: payload}} 
        case "SET_TWITTER_PIE_CHARTS_RESULTS_FB":
            return {...state, result: {...state.result, pieCharts: payload}}
        case "SET_TWITTER_PIE_CHARTS_RESULTS_INSTA":
            return {...state, result: {...state.result, pieChartsInsta: payload}} 
        default:
            return state;
    }
};
export default twitterSnaReducer;