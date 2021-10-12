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
                "donutIndex" : null, "topUser" : null, "gexfExport" : null}
        case "SET_TWITTER_SNA_RESULT":
            return {...state, 
                notification : payload.notification, 
                loading : payload.loading, 
                request : payload.request, 
                result : payload.result
            }            
        case "SET_TWITTER_SNA_LOADING":
            return {...state, "loading" : payload, "loadingMessage" : ((payload)? state.loadingMessage:"")};
        case "SET_TWITTER_SNA_LOADING_MSG":
            return {...state, loadingMessage : payload}        
        case "TWITTER_SNA_CLEAN_STATE":
            return state = defaultState;
        case "SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE":
            return {...state, topUser : payload}           
        case "SET_TWITTER_SNA_GEXF_EXPORT":
            return {...state, gexfExport : payload}
        case "SET_HISTOGRAM_RESULT":
            return {...state, histoview : payload}
        case "SET_PIE_CHART_RESULT":
            return {...state, donutIndex : payload}            
        case "SET_BUBBLE_CHART_RESULT":
            return {...state, bubbleChart : payload} 
        case "SET_HEAP_MAP_RESULT":
            return {...state, bubbleChart : payload} 
        case "SET_TWITTER_SNA_REDIRECT_REQUEST":
            return {...state, request : payload};
        case "SET_TWITTER_SNA_RESET":            
            return {...state, "request" : payload, "result" : null, "loadingMessage" : null};
        case "SET_TWITTER_SNA_HISTOGRAM_RESULTS":
             return {...state, result: {...state.result, histogram: payload}} 
        case "SET_TWITTER_SNA_COUNT_RESULTS":
            return {...state, result: {...state.result, tweetCount: payload}} 
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
       
        default:
            return state;
    }
};
export default twitterSnaReducer;