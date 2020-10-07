const defaultState = {
    notification: false,
    loading: false,
    loadingMessage: "",
    request: "",
    result: null,
    histoview: null,
};

const twitterSnaReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_TWITTER_SNA_RESULT":
            return action.payload;
        case "SET_TWITTER_SNA_LOADING":
            state.loading = action.payload;
            return state;
        case "SET_TWITTER_SNA_LOADING_MSG":
            state.loadingMessage = action.payload;
            return state;
        case "TWITTER_SNA_CLEAN_STATE":
            state.request = "";
          //  state.loadingMessage = "";
            state.result = null;
            return state;
        case "SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE":
            state.topUserProfile = action.payload;
            return state;
        case "SET_TWITTER_SNA_GEXF_EXPORT":
            state.gexfExport = action.payload;
            return state;
        case "SET_HISTOGRAM_RESULT":
            state.histoview = action.payload;
            return state;
        default:
            return state;
    }
};
export default twitterSnaReducer;