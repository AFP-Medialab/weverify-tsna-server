import {HYDRATE} from 'next-redux-wrapper';
const defaultState = {
    notification: false,
    loading: false,
    loadingMessage: "",
    request: "",
    result: null,
    pieCharts: [null,null,null,null], 
    donutIndex: null,
};

const twitterSnaReducer = (state = defaultState, {type, payload}) => {
    switch (type) {
        case HYDRATE:
            return {...state, ...payload};
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
            state.request = "";
          //  state.loadingMessage = "";
            state.result = null;
            return state;
        case "SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE":
            state.topUserProfile = payload;
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
        default:
            return state;
    }
};
export default twitterSnaReducer;