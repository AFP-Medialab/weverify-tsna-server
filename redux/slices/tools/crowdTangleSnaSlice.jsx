import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
    loading: false,
    loadingMessage: "",
    result: null,
    maxStage : 0,
    stage : 0
  };

const crowdTangleSnaSlice = createSlice ({
    name: "crowdTangleSna",
    initialState: defaultState,
    reducers: {
        csvSnaStateCleaned (state, action) {
            return defaultState;
        },
        csvSnaResultSet (state, action) {
            if(state.result === null) {
                state.result = {}
            }
            state.result.data = action.payload;
        },
        csvSnaHistoviewResultSet (state, action) {
            state.result.histoview = action.payload;
        },
        csvSnaCloudWordsResultSet (state, action) {
            state.result.cloudChart = action.payload;
            state.stage ++;
        },
        csvSnaUrlsResultSet (state, action) {
            state.result.urls = action.payload;
            state.stage ++;
        },
        csvSnaCohashtagResultSet (state, action) {
            state.result.coHashtagGraph = action.payload;
            state.stage ++;
        },
    
        csvSnaSocioGraphResultSet (state, action) {
            state.result.socioSemantic4ModeGraph = action.payload;
            state.stage++;
        },
        csvSnaHeatMapResultSet (state, action) {
            state.result.heatMap = action.payload;
            state.stage ++;
        },
        csvSnaLoadingSet (state, action) {
            state.loading = action.payload.loading;
            state.loadingMessage = action.payload.loadingMessage;
        },
        csvSnaCountResultSet (state, action) {
            state.result.countSna = action.payload;
            state.stage ++;
        },
        csvSnaHistogramResultSet (state, action) {
            state.result.histogram = action.payload;
            state.stage ++;
        },
        csvSnaPieChartResultSet (state, action) {
            state.result.pieCharts = action.payload;
            state.stage ++;
        },
        csvSnaMaxProcessStageSet (state, action) {
            state.maxStage = action.payload;
        },
        csvSnaPieChartResultHistoViewSet (state, action) {
            state.result.donutIndex = action.payload;
        },
        csvSnaBubbleChartResultHistoViewSet (state, action) {
            state.result.bubbleChart = action.payload;
        },
        
    }
})
export const {csvSnaStateCleaned,
    csvSnaResultSet,
    csvSnaHistoviewResultSet,
    csvSnaCloudWordsResultSet,
    csvSnaUrlsResultSet,
    csvSnaCohashtagResultSet,
    csvSnaSocioGraphResultSet,
    csvSnaHeatMapResultSet,
    csvSnaLoadingSet,
    csvSnaCountResultSet,
    csvSnaHistogramResultSet,
    csvSnaPieChartResultSet,
    csvSnaMaxProcessStageSet,
    csvSnaPieChartResultHistoViewSet,
    csvSnaBubbleChartResultHistoViewSet
    } = crowdTangleSnaSlice.actions;

export default crowdTangleSnaSlice.reducer;