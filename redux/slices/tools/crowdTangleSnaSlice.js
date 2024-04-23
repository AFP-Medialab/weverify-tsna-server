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
        CsvSnaStateCleaned (state, action) {
            state = defaultState;
        },
        CsvSnaResultSet (state, action) {
            state.result.data = action.payload;
        },
        CsvSnaResultHistoviewSet (state, action) {
            state.result.histoview = action.payload;
        },
        CsvSnaCloudWordsResultSet (state, action) {
            state.result.cloudChart = action.payload;
            state.stage ++;
        },
        CsvSnaUrlsResultSet (state, action) {
            state.result.urls = action.payload;
            state.stage ++;
        },
        CsvSnaCohashtagResultSet (state, action) {
            state.result.coHashtagGraph = action.payload;
            state.stage ++;
        },
    
        CsvSnaSocioGraphResultSet (state, action) {
            state.result.socioSemantic4ModeGraph = action.payload;
            state.stage++;
        },
        CsvSnaHeatMapResultSet (state, action) {
            state.result.heatMap = action.payload;
            state.stage ++;
        },
        CsvSnaLoadingSet (state, action) {
            state.loading = action.payload.loading;
            state.loadingMessage = action.payload.loadingMessage;
        },
        CsvSnaCountResultSet (state, action) {
            state.result.countSna = action.payload;
            state.stage ++;
        },
        CsvSnaHistogramResultSet (state, action) {
            state.result.histogram = action.payload;
            state.stage ++;
        },
        CsvSnaPieChartResultSet (state, action) {
            state.result.pieCharts = action.payload;
            state.stage ++;
        },
        CsvSnaMaxProcessStageSet (state, action) {
            state.maxStage = action.payload;
        }
    }
})
export const {CsvSnaStateCleaned,
    CsvSnaResultSet,
    CsvSnaCloudWordsResult,
    CsvSnaUrlsResultSet,
    CsvSnaCohashtagResultSet,
    CsvSnaSocioGraphResultSet,
    CsvSnaHeatMapResultSet,
    CsvSnaLoadingSet,
    CsvSnaCountResultSet,
    CsvSnaHistogramResultSet,
    CsvSnaPieChartResultSet,
    CsvSnaMaxProcessStageSet
    } = crowdTangleSnaSlice.actions;

export default crowdTangleSnaSlice.reducer;