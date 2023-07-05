import {HYDRATE} from 'next-redux-wrapper';
import { 
        SET_TWITTER_SNA_NEW_REQUEST,
        SET_TWITTER_SNA_RESULT,
        TSNA_PROCESS_MAX_STAGE,
        SET_TWITTER_SNA_HEATMAP_RESULTS,
        SET_TWITTER_COHASHTAG_RESULTS,
        SET_TWITTER_SNA_SOCIO_GRAPH_RESULTS, 
        SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE, 
        SET_TWITTER_URLS_RESULTS,
        SET_TWITTER_SNA_CLOUD_WORDS_RESULTS, 
        SET_TWITTER_SNA_LOADING } from '../../actions/types/tsnaTypes';

const defaultState = {
    notification: false,
    loading: false,
    loadingMessage: "",
    request: null,
    result: null,
    pieCharts: [null,null,null,null], 
    donutIndex: null,
    topUser: null,
    gexfExport: null,
    maxStage : 0,
    stage : 0,
    redirect: false
};

const twitterSnaReducer = (state = defaultState, {type, payload}) => {
    switch (type) {
        case HYDRATE:
            return {...state, ...payload};
        case SET_TWITTER_SNA_NEW_REQUEST:
            return {...state, "notification" : false, "loading" : false,
                "request" : payload.request, "result" : null, "pieCharts" : [null,null,null,null], 
                "donutIndex" : null, "topUser" : null, "gexfExport" : null, stage: 0, maxStage:0, redirect: false}
        case SET_TWITTER_SNA_RESULT:
            return {...state, 
                notification : payload.notification, 
                loading : payload.loading, 
                request : payload.request, 
                result : payload.result
            }            
        case SET_TWITTER_SNA_LOADING:        
            return {...state, 
                    "loading" : payload.load, 
                    "loadingMessage" : ((payload.load)? state.loadingMessage:""), 
                    maxStage : payload.maxStage, stage : !(payload.load) ? state.maxStage: 0};
        case "SET_TWITTER_SNA_LOADING_MSG":
            return {...state, loadingMessage : payload}        
        case "TWITTER_SNA_CLEAN_STATE":
            return state = defaultState;
        case SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE:
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
            return {...state, request : payload, redirect: true};
        case "SET_TWITTER_SNA_RESET":            
            return {...state, "request" : payload, "result" : null, "loadingMessage" : null};
        case "SET_TWITTER_SNA_HISTOGRAM_RESULTS":
             return {...state, result: {...state.result, histogram: payload}} 
        case "SET_TWITTER_SNA_COUNT_RESULTS":
            return {...state, result: {...state.result, tweetCount: payload}} 
        case "SET_TWITTER_TWEETS_RESULTS":
            return {...state, result: {...state.result, tweets: payload}} 
        case SET_TWITTER_SNA_CLOUD_WORDS_RESULTS:
            return {...state, result: {...state.result, cloudChart: payload}, stage: ++state.stage} 
        case SET_TWITTER_SNA_SOCIO_GRAPH_RESULTS:
            return {...state, result: {...state.result, socioSemantic4ModeGraph: payload}, stage: ++state.stage}
        case SET_TWITTER_SNA_HEATMAP_RESULTS:
            return {...state, result: {...state.result, heatMap: payload}, stage: ++state.stage}
        case "SET_TWITTER_PIE_CHARTS_RESULTS":
            return {...state, result: {...state.result, pieCharts: payload}}
        case SET_TWITTER_COHASHTAG_RESULTS:
            return {...state, result: {...state.result, coHashtagGraph: payload}, stage: ++state.stage}
        case SET_TWITTER_URLS_RESULTS:
            return {...state, result: {...state.result, urls: payload}, stage: ++state.stage}
        case "SET_TWITTER_SNA_BUBBLE_CHART_RESULTS":
            return {...state, result: {...state.result, topUser: payload}}
        case TSNA_PROCESS_MAX_STAGE:
            return {...state,
                maxStage : payload
            };
        default:
            return state;
    }
};
export default twitterSnaReducer;