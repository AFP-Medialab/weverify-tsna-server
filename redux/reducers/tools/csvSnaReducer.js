import {
  CSV_SNA_CLEAN,
  CSV_COUNT_SET_RESULTS,
  CSV_SNA_SET_TYPE,
  CSV_HISTOGRAM_SET_RESULTS,
  CSV_PIECHART_SET_RESULTS,
  CSV_IS_LOADING,
  CSV_PARSING_RESULT,
  CSV_HISTOVIEW_RESULT,
  CSV_PIE_CHART_RESULT,
  CSV_BUBBLE_CHART_RESULT,
  CSV_SNA_USER_PROFILE_MOST_ACTIVE,
  CSV_SET_HEAP_MAP_RESULT,
  SET_CSV_SNA_BUBBLE_CHART_RESULTS,
  SET_CSV_SNA_HEATMAP_RESULTS,
  SET_CSV_COHASHTAG_RESULTS,
  SET_CSV_URLS_RESULTS,
  SET_CSV_SNA_SOCIO_GRAPH_RESULTS,
  SET_CSV_SNA_CLOUD_WORDS_RESULTS,

} from "../../actions/types/csvSnaTypes";

const defaultState = {
  loading: false,
  loadingMessage: "",
  result: null,
};

const csvSnaReducer = (state = defaultState, { type, payload }) => {
  switch (type) {
    case CSV_SNA_CLEAN:
      return (state = defaultState);

      case CSV_PARSING_RESULT:
        return {
            ...state,
            result: { ...state.result, data: payload },
        }
        case CSV_HISTOVIEW_RESULT:
          return {
            ...state,
            result: { ...state.result, histoview: payload },
          }; 


          case SET_CSV_SNA_CLOUD_WORDS_RESULTS:
            return {
              ...state,
            result: { ...state.result, cloudChart: payload },
          }; 

          case SET_CSV_URLS_RESULTS:
            return {
             ...state,
            result: { ...state.result, urls: payload },
          }; 
            
          case SET_CSV_COHASHTAG_RESULTS:
            return {
              ...state,
              result: { ...state.result, coHashtagGraph: payload },
            }; 
        
          
          
          case CSV_PIE_CHART_RESULT:
            return {
              ...state,
              result: { ...state.result, donutIndex: payload },
          }; 



          case SET_CSV_SNA_SOCIO_GRAPH_RESULTS:
            return {
              ...state,
              result: { ...state.result, socioSemantic4ModeGraph: payload },
          }; 


          case CSV_BUBBLE_CHART_RESULT: 
          return {
            ...state,
            result: { ...state.result, bubbleChart: payload },
          };   
         
          case CSV_SET_HEAP_MAP_RESULT: 
          return {
            ...state,
            result: { ...state.result, bubbleChart: payload },
          }; 

          case CSV_SNA_USER_PROFILE_MOST_ACTIVE: 
          return {
            ...state,
            result: { ...state.result, topUser: payload },
          };
          
          case SET_CSV_SNA_BUBBLE_CHART_RESULTS: 
            return {
              ...state,
              result: { ...state.result, topUser: payload },
            };

              case SET_CSV_SNA_HEATMAP_RESULTS: 
              return {
                ...state,
                result: { ...state.result, heatMap: payload },
              };




      case CSV_IS_LOADING:
        return {
            ...state,
            loading: payload.loading,
            loadingMessage: payload.loadingMessage
        }
    case CSV_SNA_SET_TYPE:
      return {
        ...state,
        result: { ...state.result, snaType: payload },
      };
    case CSV_COUNT_SET_RESULTS:
      return {
        ...state,
        result: { ...state.result, countSna: payload },
      };
    case CSV_HISTOGRAM_SET_RESULTS:
      return {...state,
        result: { ...state.result, histogram: payload },
      };
    case CSV_PIECHART_SET_RESULTS:
      return {...state,
        result: { ...state.result, pieCharts: payload },
      };
       
      
    default:
      return state;
  }
};
export default csvSnaReducer;
