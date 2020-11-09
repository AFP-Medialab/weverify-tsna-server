import {HYDRATE} from 'next-redux-wrapper';
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
                "request" : payload, "result" : false, "pieCharts" : [null,null,null,null], 
                "donutIndex" : null, "topUser" : null}
        case "SET_TWITTER_SNA_RESULT":
            state.notification = payload.notification;
            state.loading = payload.loading;
            state.request = payload.request;
            state.result = payload.result;
            return state;
        case "SET_TWITTER_SNA_LOADING":
            state.loading = payload;
            return state;
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
        default:
            return state;
    }
};
export default twitterSnaReducer;