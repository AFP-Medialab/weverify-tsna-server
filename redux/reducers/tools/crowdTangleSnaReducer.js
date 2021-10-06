import {
  CT_SNA_CLEAN,
  CT_COUNT_SET_RESULTS,
  CT_SNA_SET_TYPE,
  CT_HISTOGRAM_SET_RESULTS,
  CT_PIECHART_SET_RESULTS,
  CT_IS_LOADING,
  CT_PARSING_RESULT,
  CT_HISTOVIEW_RESULT,
  CT_PIE_CHART_RESULT,
  CT_BUBBLE_CHART_RESULT,
  CT_SNA_USER_PROFILE_MOST_ACTIVE,
  CT_SET_HEAP_MAP_RESULT,
  SET_CT_SNA_BUBBLE_CHART_RESULTS,
  SET_CT_SNA_HEATMAP_RESULTS,
  SET_CT_COHASHTAG_RESULTS,
  SET_CT_URLS_RESULTS,
  SET_CT_SNA_SOCIO_GRAPH_RESULTS,
  SET_CT_SNA_CLOUD_WORDS_RESULTS,

} from "../../actions/types/crowdTangleSnaTypes";

const defaultState = {
  loading: false,
  loadingMessage: "",
  result: null,
};

const crowdTangleSnaReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case CT_SNA_CLEAN:
      return (state = defaultState);

    case CT_PARSING_RESULT:
      return {
          ...state,
          result: { ...state.result, data: payload },
      }
    case CT_HISTOVIEW_RESULT:
      return {
        ...state,
        result: { ...state.result, histoview: payload },
      }; 


      case SET_CT_SNA_CLOUD_WORDS_RESULTS:
        return {
          ...state,
        result: { ...state.result, cloudChart: payload },
      }; 

      case SET_CT_URLS_RESULTS:
        return {
          ...state,
        result: { ...state.result, urls: payload },
      }; 
        
      case SET_CT_COHASHTAG_RESULTS:
        return {
          ...state,
          result: { ...state.result, coHashtagGraph: payload },
        }; 
    
      
      
      case CT_PIE_CHART_RESULT:
        return {
          ...state,
          result: { ...state.result, donutIndex: payload },
      }; 

    case SET_CT_SNA_SOCIO_GRAPH_RESULTS:
        return {
          ...state,
          result: { ...state.result, socioSemantic4ModeGraph: payload },
      }; 

    case CT_BUBBLE_CHART_RESULT: 
      return {
        ...state,
        result: { ...state.result, bubbleChart: payload },
      };   
      
    case CT_SET_HEAP_MAP_RESULT: 
      return {
        ...state,
        result: { ...state.result, bubbleChart: payload },
      }; 

    case CT_SNA_USER_PROFILE_MOST_ACTIVE: 
      return {
        ...state,
        result: { ...state.result, topUser: payload },
      };
      
    case SET_CT_SNA_BUBBLE_CHART_RESULTS: 
      return {
        ...state,
        result: { ...state.result, topUser: payload },
      };

    case SET_CT_SNA_HEATMAP_RESULTS: 
      return {
        ...state,
        result: { ...state.result, heatMap: payload },
      };

    case CT_IS_LOADING:
      return {
          ...state,
          loading: payload.loading,
          loadingMessage: payload.loadingMessage
      }
    case CT_SNA_SET_TYPE:
      return {
        ...state,
        result: { ...state.result, snaType: payload },
      };
    case CT_COUNT_SET_RESULTS:
      return {
        ...state,
        result: { ...state.result, countSna: payload },
      };
    case CT_HISTOGRAM_SET_RESULTS:
      return {...state,
        result: { ...state.result, histogram: payload },
      };
    case CT_PIECHART_SET_RESULTS:
      return {...state,
        result: { ...state.result, pieCharts: payload },
      };
       
      
    default:
      return state;
  }
};
export default crowdTangleSnaReducer;
