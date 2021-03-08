export const setTwitterSnaResult = (request, result, notification, loading) => {
    return {
        type : "SET_TWITTER_SNA_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            request : request,
            result : result,
        }
    }
};

export const setTwitterSnaNewRequest = (request) => {
    return {
        type : "SET_TWITTER_SNA_NEW_REQUEST",
        payload : {           
            request : request
        }
    }
};

export const setTwitterSnaLoading = (loading) => {
    return {
        type : "SET_TWITTER_SNA_LOADING",
        payload : loading
    }
};

export const setTwitterSnaLoadingMessage = (message) => {
    return {
        type: "SET_TWITTER_SNA_LOADING_MSG",
        payload: message
    }
}

export const cleanTwitterSnaState = () => {
    return {
        type: "TWITTER_SNA_CLEAN_STATE"
    }
};

export const setUserProfileMostActive = (data) => {
    return {
        type : "SET_TWITTER_SNA_USER_PROFILE_MOST_ACTIVE",
        payload : data
    }
};
export const redirectFromPlugin = (data) => {
    return {
        type : "SET_TWITTER_SNA_REDIRECT_REQUEST",
        payload : data
    }
}

export const setTSNAReset = (data) => {
    return {
        type : "SET_TWITTER_SNA_RESET",
        payload: data
    }
}

export const setCloudWordsResult = (cloudWords) => {
    return {
        type : "SET_TWITTER_SNA_CLOUD_WORDS_RESULTS",
        payload :  cloudWords
    }
};

export const setSocioGraphResult = (sociodata) => {
    return {
        type : "SET_TWITTER_SNA_SOCIO_GRAPH_RESULTS",
        payload :  sociodata
    }
};
export const setHeatMapResult = (heatMapData) => {
    return {
        type : "SET_TWITTER_SNA_HEATMAP_RESULTS",
        payload :  heatMapData
    }
};
export const setHistogramResult = (histogramData) => {
    return {
        type : "SET_TWITTER_SNA_HISTOGRAM_RESULTS",
        payload :  histogramData
    }
};




export const setTweetResult = (tweetData) => {
    return {
        type : "SET_TWITTER_TWEETS_RESULTS",
        payload :  tweetData
    }
};
export const setPieChartsResult = (pieChartData) => {
    return {
        type : "SET_TWITTER_PIE_CHARTS_RESULTS",
        payload :  pieChartData
    }
};
export const setCoHashtagResult = (coHashtagData) => {
    return {
        type : "SET_TWITTER_COHASHTAG_RESULTS",
        payload :  coHashtagData
    }
};
export const setUrlsResult = (urlData) => {
    return {
        type : "SET_TWITTER_URLS_RESULTS",
        payload :  urlData
    }
};
export const setGexfExport = (gexfData) => {
    return {
        type : "SET_TWITTER_SNA_GEXF_EXPORT",
        payload : gexfData
    }
};


export const setTweetsDetailPanel = (from, data) => {    
    console.log("from " + from)
    switch(from){
        case "PLOT_LINE":
            return {
                type : "SET_HISTOGRAM_RESULT",
                payload :  data
            }
        case "PLOT_PIE_CHART_0":
            return {
                /*type : "SET_PIE_CHART_RESULT_0",
                payload :  data*/
                type : "SET_PIE_CHART_RESULT",
                payload :  data != null ? null : 0
            }
        case "PLOT_PIE_CHART_1":
            return {
                type : "SET_PIE_CHART_RESULT",
                payload :  data != null ? null : 1
            }
        case "PLOT_PIE_CHART_2":
            return {
                type : "SET_PIE_CHART_RESULT",
                payload :  data != null ? null : 2
            }
        case "PLOT_PIE_CHART_3":
            return {
                type : "SET_PIE_CHART_RESULT",
                payload :  data != null ? null : 3
            }
        case "PLOT_BUBBLE_CHART":
            return {
                type : "SET_BUBBLE_CHART_RESULT",
                payload :  data
        }
        case "PLOT_HEAT_MAP":
            return {
                type : "SET_HEAT_MAP_RESULT",
                payload :  data
        }
        case "PLOT_HASHTAG_GRAPH":
            return {
                type : "SET_HASHTAG_GRAPH_RESULT",
                payload :  data
            }
    }
    
};

/////////////////////////////////////////////////////////////////////////////////////////


export const setCountResultFb = (countDataFb) => {
    return {
        type : "SET_FB_CSV_COUNT_RESULTS",
        payload :  countDataFb
    }
};

export const setCountResultInsta = (countDataInsta) => {
    return {
        type : "SET_INSTA_CSV_COUNT_RESULTS",
        payload :  countDataInsta
    }
};

export const setHistogramResultFb = (histogramDataFb) => {
    return {
        type : "SET_TWITTER_SNA_HISTOGRAM_RESULTS_FB",
        payload :  histogramDataFb
    }
};

export const setHistogramResultInsta = (histogramDataFb) => {
    return {
        type : "SET_TWITTER_SNA_HISTOGRAM_RESULTS_INSTA",
        payload :  histogramDataFb
    }
};

export const setPieChartsResultFb = (pieChartData) => {
    return {
        type : "SET_TWITTER_PIE_CHARTS_RESULTS_FB",
        payload :  pieChartData
    }
};

export const setPieChartsResultInsta = (pieChartData) => {
    return {
        type : "SET_TWITTER_PIE_CHARTS_RESULTS_INSTA",
        payload :  pieChartData
    }
};