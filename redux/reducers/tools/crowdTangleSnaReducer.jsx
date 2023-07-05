import {
  CT_SNA_CLEAN,
  CT_COUNT_SET_RESULTS,
  CT_HISTOGRAM_SET_RESULTS,
  CT_PIECHART_SET_RESULTS,
  CT_IS_LOADING,
  CT_PARSING_RESULT,
  CT_HISTOVIEW_RESULT,
  CT_PIE_CHART_RESULT,
  CT_BUBBLE_CHART_RESULT,
  SET_CT_SNA_HEATMAP_RESULTS,
  SET_CT_COHASHTAG_RESULTS,
  SET_CT_URLS_RESULTS,
  SET_CT_SNA_SOCIO_GRAPH_RESULTS,
  SET_CT_SNA_CLOUD_WORDS_RESULTS,
  CT_PROCESS_MAX_STAGE,
} from "../../actions/types/crowdTangleSnaTypes";

const defaultState = {
  loading: false,
  loadingMessage: "",
  result: null,
  maxStage: 0,
  stage: 0,
};

const crowdTangleSnaReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case CT_SNA_CLEAN:
      return (state = defaultState);

    case CT_PARSING_RESULT:
      return {
        ...state,
        result: { ...state.result, data: payload },
      };
    case CT_HISTOVIEW_RESULT:
      return {
        ...state,
        result: { ...state.result, histoview: payload },
      };

    //OK
    case SET_CT_SNA_CLOUD_WORDS_RESULTS:
      return {
        ...state,
        result: { ...state.result, cloudChart: payload },
        stage: ++state.stage,
      };
    //OK
    case SET_CT_URLS_RESULTS:
      return {
        ...state,
        result: { ...state.result, urls: payload },
        stage: ++state.stage,
      };
    //OK
    case SET_CT_COHASHTAG_RESULTS:
      return {
        ...state,
        result: { ...state.result, coHashtagGraph: payload },
        stage: ++state.stage,
      };

    case CT_PIE_CHART_RESULT:
      return {
        ...state,
        result: { ...state.result, donutIndex: payload },
      };
    //OK
    case SET_CT_SNA_SOCIO_GRAPH_RESULTS:
      return {
        ...state,
        result: { ...state.result, socioSemantic4ModeGraph: payload },
        stage: ++state.stage,
      };

    case CT_BUBBLE_CHART_RESULT:
      return {
        ...state,
        result: { ...state.result, bubbleChart: payload },
      };
    //OK
    case SET_CT_SNA_HEATMAP_RESULTS:
      return {
        ...state,
        result: { ...state.result, heatMap: payload },
        stage: ++state.stage,
      };

    case CT_IS_LOADING:
      return {
        ...state,
        loading: payload.loading,
        loadingMessage: payload.loadingMessage,
      };
    //OK
    case CT_COUNT_SET_RESULTS:
      return {
        ...state,
        result: { ...state.result, countSna: payload },
        stage: ++state.stage,
      };
    //OK
    case CT_HISTOGRAM_SET_RESULTS:
      return {
        ...state,
        result: { ...state.result, histogram: payload },
        stage: ++state.stage,
      };
    //OK
    case CT_PIECHART_SET_RESULTS:
      return {
        ...state,
        result: { ...state.result, pieCharts: payload },
        stage: ++state.stage,
      };
    case CT_PROCESS_MAX_STAGE:
      return { ...state, maxStage: payload };

    default:
      return state;
  }
};
export default crowdTangleSnaReducer;
