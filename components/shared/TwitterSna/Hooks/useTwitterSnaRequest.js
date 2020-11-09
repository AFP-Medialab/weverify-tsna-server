import {useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useLoadLanguage from "../../hooks/useLoadLanguage";
import {
    setTwitterSnaLoading, 
    setTwitterSnaResult, 
    setTwitterSnaLoadingMessage,
    setUserProfileMostActive
} from "../../../../redux/actions/tools/twitterSnaActions";
import {
    getAggregationData,
    getTweets,
    getUserAccounts
} from "./call-elastic";
import {
    createTimeLineChart,
    getJsonDataForTimeLineChart
} from "./timeline";
import {
    createPieCharts,
    getJsonDataForPieCharts
} from "./pieCharts";
import {
    createHeatMap
} from "./heatMap";
import {
    createCoHashtagGraph
} from "./hashtagGraph";
import {
    createSocioSemantic4ModeGraph
} from "./socioSemGraph";
import {
    createWordCloud
} from "./cloudChart";
import {
    getJsonDataForURLTable
} from "./urlList"

import useAuthenticatedRequest from '../../AuthenticationCard/useAuthenticatedRequest';
import { setError } from "../../../../redux/actions/errorActions";

let TwintWrapperUrl = "/api/getTwint";


const useTwitterSnaRequest = (request) => {
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

    const authenticatedRequest = useAuthenticatedRequest();
    const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

    useEffect(() => {

        const handleErrors = (e) => {           
            if (keyword(e) !== "")
              dispatch(setError(keyword(e)));
            else
              dispatch(setError(keyword("default_sna_error")));
            dispatch(setTwitterSnaLoading(false));
          };
        // Check request
        const lastRenderCall = (sessionId, request) => {
            dispatch(setTwitterSnaLoadingMessage(keyword('twittersna_building_graphs')));
          
            generateGraph(request, true).then(() => {
              dispatch(setTwitterSnaLoading(false));
            });
          
        };

        const getResultUntilsDone = async (sessionId, isFirst, request) => {
            const axiosConfig = {
              method: 'get',

              url: `/api/wrapper/status/${sessionId}`
            };
            await authenticatedRequest(axiosConfig)
              // await axios.get(TwintWrapperUrl + /status/ + sessionId)
              .then(async response => {
                if (isFirst)
                  await generateGraph(request, false);
      
                if (response.data.status === "Error")
                  handleErrors("twitterSnaErrorMessage");
                else if (response.data.status === "Done") {
                  lastRenderCall(sessionId, request);
                }
                else if (response.data.status === "CountingWords") {
                  dispatch(setTwitterSnaLoadingMessage(keyword("twittersna_counting_words")));
                  setTimeout(() => getResultUntilsDone(sessionId, false, request), 3000);
                }
                else {
                  generateGraph(request, false).then(() => {
                    setTimeout(() => getResultUntilsDone(sessionId, false, request), 5000);
      
                    dispatch(setTwitterSnaLoading(true));
                    dispatch(setTwitterSnaLoadingMessage(keyword("twittersna_fetching_tweets")));
                  });
                }
              })
              .catch(e => handleErrors(e));
          };

        const makeEntries = (data) => {
            return {
                from: request.from,
                until: request.until,
                keywordList: request.keywordList,
                bannedWords: request.bannedWords,
                userList: request.userList,
                session: data.session,
                media: (data.media) ? data.media : "none",
                lang: (data.lang) ? data.lang : "none",
                verified: data.verified
            };
        };
        /**
         * Build all widget component for scapping results
         * @param {*} request request
         * @param {*} final if scrapping is done
         */
        const generateGraph = async (request, final) => {
            let entries = makeEntries(request);        
            // call ES. If scrapping ongoing get scrapping aggregations. if done get all tweets
            const responseArrayOf9 = await axios.all(
            (final) ? [getAggregationData(entries), getTweets(entries)] : [getAggregationData(entries)]
            );
            makeResult(request, responseArrayOf9, final);
    
        };

        function getTopActiveUsers(tweets, topN) {
            let tweetCountObj = _.countBy(tweets.map((tweet) => {return tweet._source.screen_name.toLowerCase(); }));
            let topUsers2DArr = _.sortBy(Object.entries(tweetCountObj), [function(o) { return o[1]; }])
                                  .reverse()
                                  .slice(0, topN);
            return topUsers2DArr;
          }
          


        const makeResult = (request, responseArrayOf9, final) => {
            let responseAggs = responseArrayOf9[0]['aggregations']
            const result = {};
            result.histogram = createTimeLineChart(request, getJsonDataForTimeLineChart(responseAggs['date_histo']['buckets']), keyword);
            result.tweetCount = {};
            result.tweetCount.count = responseAggs['tweet_count']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweetCount.retweet = responseAggs['retweets']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweetCount.like = responseAggs['likes']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.pieCharts = createPieCharts(request, getJsonDataForPieCharts(responseAggs, request.keywordList), keyword);
            result.cloudChart = { title: "top_words_cloud_chart_title" };
            if (final) {
                result.tweets = responseArrayOf9[1].tweets;
                result.heatMap = createHeatMap(request, result.tweets, keyword);
                result.coHashtagGraph = createCoHashtagGraph(result.tweets);
                result.socioSemantic4ModeGraph = createSocioSemantic4ModeGraph(result.tweets);
                result.cloudChart = { title: "top_words_cloud_chart_title" };
                result.cloudChart = createWordCloud(result.tweets, request);

                result.urls = getJsonDataForURLTable(responseAggs['top_url_keyword']['buckets'], keyword);

                let authors = getTopActiveUsers(result.tweets, 100).map((arr) => {return arr[0];});
                if (authors.length > 0) {
                    getUserAccounts(authors).then((data) => dispatch(setUserProfileMostActive(data.hits.hits)))
                }
            }

            dispatch(setTwitterSnaResult(request, result, false, true));
        };

        if (_.isNil(request)
            || (_.isNil(request.keywordList) || _.isEmpty(request.keywordList))
            // || (_.isNil(request.userList) || _.isEmpty(request.userList))
            || _.isNil(request.from)
            || _.isNil(request.until)) {
            dispatch(setTwitterSnaResult(request, null, false, false));
            return;
        }
        
        dispatch(setTwitterSnaLoading(true));

        //authentication test to set later
        if (userAuthenticated) {
            const axiosConfig = {
              method: 'post',
              url: '/api/wrapper/collect',
              data: request
            };
            // axios.post(TwintWrapperUrl + "/collect", request)
            authenticatedRequest(axiosConfig)
              .then(response => {
                if (response.data.status === "Error")
                  handleErrors("twitterSnaErrorMessage");
                else if (response.data.status === "Done")
                  lastRenderCall(response.data.session, request);
                else
                  getResultUntilsDone(response.data.session, true, request);
              }).catch(error => {
                handleErrors(error);
              });
          } else {
            lastRenderCall(null, request);
          }
       

    }, [JSON.stringify(request)]);


};
export default useTwitterSnaRequest;