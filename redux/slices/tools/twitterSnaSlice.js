import { PaymentOutlined } from "@mui/icons-material";
import { createSlice } from "@reduxjs/toolkit";

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

const twitterSnaSlice = createSlice ({
    name: "twitterSna",
    initialState: defaultState,
    reducers: {
        twitterSnaResultSet (state, action) {
            state.notification = action.payload.notification;
            state.loading = action.payload.loading;
            state.request = action.payload.request;
            state.result = action.payload.result;
        },
        twitterSnaNewRequestSet (state, action) {
            state.notification = false;
            state.loading = false;
            state.request = action.payload.request;
            state.result = null;
            state.pieCharts = [null,null,null,null];
            state.donutIndex = null;
            state.topUser = null;
            state.gexfExport = null;
            state.stage = 0;
            state.maxStage = 0;
            state.redirect = false;
        },
        twitterSnaLoadingSet (state, action) {
            state.loading = action.payload.load;
            state.loadingMessage = ((action.payload.load)? state.loadingMessage:"");
            state.maxStage = state.payload.maxStage;
            state.stage = !(action.payload.load) ? state.maxStage: 0;
        },
        twitterSnaLoadingMessageSet (state, action) {
            state.loadingMessage = action.payload;
        },
        twitterSnaCleanedState (state, action) {
            state = defaultState;
        },
        twitterSnaUserProfileMostActiveSet (state, action) {
            state.topUser = action.payload;
        },
        twitterSnaRedirectRequestSet (state, action) {
            state.request = action.payload;
            state.redirect = true;
        },
        twitterSnaResetSet (state, action) {
            state.request = action.payload;
            state.result = null;
            state.loadingMessage = null;
        },
        twitterSnaCloudWordsResultSet (state, action) {
            state.result.cloudChart = action.payload;
            state.stage ++;
        },
        twitterSnaSocioGraphResultSet (state, action) {
            state.result.socioSemantic4ModeGraph = action.payload;
            state.stage ++;
        },
        twitterSnaHeatMapResultSet (state, action) {
            state.result.heatMap = action.payload;
            state.stage ++;
        },
        twitterSnaHistogramResultSet (state, action) {
            state.result.histogram = action.payload;
        },
        twitterSnaCountResultSet (state, action) {
            state.result.tweetCount = action.payload;
        },
        twitterSnaTweetsResultSet (state, action) {
            state.result.tweets = action.payload;
        },
        twitterSnaPieChartsResultSet (state, action) {
            state.result.pieCharts = action.payload;
        },
        twitterSnaCoHashtagResultSet (state, action) {
            state.result.coHashtagGraph = action.payload;
            state.stage ++;
        },
        twitterSnaUrlsResultSet (state, action) {
            state.result.urls = action.payload;
            state.stage ++;
        },
        twitterSnaGexfExportSet (state, action) {
            state.gexfExport = action.payload;
        },
        twitterSnaMaxStorageProcessed (state, action) {
            state.maxStage = action.payload;
        }
    }
});

export const {
    twitterSnaResultSet,
    twitterSnaNewRequestSet,
    twitterSnaLoadingSet,
    twitterSnaLoadingMessageSet,
    twitterSnaCleanedState,
    twitterSnaUserProfileMostActiveSet,
    twitterSnaRedirectRequestSet,
    twitterSnaResetSet,
    twitterSnaCloudWordsResultSet,
    twitterSnaSocioGraphResultSet,
    twitterSnaHeatMapResultSet,
    twitterSnaHistogramResultSet,
    twitterSnaCountResultSet,
    twitterSnaTweetsResultSet,
    twitterSnaPieChartsResultSet,
    twitterSnaCoHashtagResultSet,
    twitterSnaUrlsResultSet,
    twitterSnaGexfExportSet,
    twitterSnaMaxStorageProcessed
} = twitterSnaSlice.actions;

export default twitterSnaSlice.reducer;