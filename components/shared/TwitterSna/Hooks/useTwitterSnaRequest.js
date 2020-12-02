import {useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useLoadLanguage from "../../hooks/useLoadLanguage";
import {
    setTwitterSnaLoading, 
    setTwitterSnaResult, 
    setTwitterSnaLoadingMessage,
    setUserProfileMostActive,
    setCloudWordsResult,
    setSocioGraphResult,
    setHeatMapResult,
    setHistogramResult, 
    setCountResult,
    setTweetResult,
    setPieChartsResult,
    setUrlsResult,
    setCoHashtagResult
} from "../../../../redux/actions/tools/twitterSnaActions";
import {
    getAggregationData,
    getTweets,
    getUserAccounts,
    getCloudTweets
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
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();



const useTwitterSnaRequest = (request) => {
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

    const authenticatedRequest = useAuthenticatedRequest();
    const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

    const [firstCallRenderer, setFirstCallRenderer] = useState(true);


    useEffect(() => {

        const handleErrors = (e) => {           
            if (keyword(e) !== "")
              dispatch(setError(keyword(e)));
            else
              dispatch(setError(keyword("default_sna_error")));
            dispatch(setTwitterSnaLoading(false));
          };
        // Check request
        const cacheRenderCall = (sessionId, request) => {
            dispatch(setTwitterSnaLoadingMessage(keyword('twittersna_building_graphs')));
          
            (generateFirstGraph(request) && generateSecondGraph(request) && generateThirdGraph(request)).then(() => {
              dispatch(setTwitterSnaLoading(false));
            });
          
        };

        const getResultUntilsDone = async (sessionId, request) => {
            const axiosConfig = {
              method: 'get',

              url: `${publicRuntimeConfig.baseFolder}/api/wrapper/status/${sessionId}`
            };
            await authenticatedRequest(axiosConfig)
              // await axios.get(TwintWrapperUrl + /status/ + sessionId)
              .then(async response => {
      
                if (response.data.status === "Error")
                  handleErrors("twitterSnaErrorMessage");
                else if (response.data.status === "Done") {
                  generateThirdGraph(request);
                  dispatch(setTwitterSnaLoading(false));
                }
                else if (response.data.status === "CountingWords") {
                  dispatch(setTwitterSnaLoadingMessage(keyword("twittersna_counting_words")));

                  if (firstCallRenderer) { //flag 
                    generateFirstGraph(request);
                    generateSecondGraph(request);
                    setFirstCallRenderer(false);
                  }


                  setTimeout(() => getResultUntilsDone(sessionId, request), 3000);
                }
                else { //running
                  generateFirstGraph(request).then(() => {
                    setTimeout(() => getResultUntilsDone(sessionId, request), 5000);
      
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
        const generateFirstGraph = async (request) => {
            let entries = makeEntries(request);        
            const responseArrayOf9 = await axios.all([getAggregationData(entries)]);
          makeFirstResult(request, responseArrayOf9);
        };

      const generateSecondGraph = async (request) => {
          let entries = makeEntries(request);        
          const responseArrayOf9 = await axios.all([getAggregationData(entries), getTweets(entries)]);
        makeSecondResult(request, responseArrayOf9);

      };

      const generateThirdGraph = async (request) => {
        let entries = makeEntries(request);
        const responseArrayOf9 = await axios.all([getCloudTweets(entries)]);

        makeThirdResult(request, responseArrayOf9);
      }

      const makeFirstResult = (request, responseArrayOf9) => {
        let responseAggs = responseArrayOf9[0]['aggregations']
        const result = {};
        buildHistogram(request, responseAggs);
        buildTweetCount(responseAggs);
        buildPieCharts(request, responseAggs);
        buildUrls(responseAggs);

    };

    const makeSecondResult = (request, responseArrayOf9) =>{
      const tweets = responseArrayOf9[1].tweets;
            dispatch(setTweetResult(tweets));
            buildHeatMap(request, tweets);
            buildCoHashTag(tweets);
            buildSocioGraph(tweets);
            buidTopUsers(tweets);
    }

    const makeThirdResult = (request, responseArrayOf9) =>{ //word cloud
      wordCount(responseArrayOf9[0].tweets, request);
    }

        function getTopActiveUsers(tweets, topN) {
            let tweetCountObj = _.countBy(tweets.map((tweet) => {return tweet._source.screen_name.toLowerCase(); }));
            let topUsers2DArr = _.sortBy(Object.entries(tweetCountObj), [function(o) { return o[1]; }])
                                  .reverse()
                                  .slice(0, topN);
            return topUsers2DArr;
          }
          
        const wordCount = async (tweets, request) => {
            const wordCountResponse = createWordCloud(tweets, request);
            dispatch(setCloudWordsResult(wordCountResponse));
        }
        const buildSocioGraph = async (tweets) => {
            const socioSemantic4ModeGraph = createSocioSemantic4ModeGraph(tweets);
            dispatch(setSocioGraphResult(socioSemantic4ModeGraph));
        };
        const buildHistogram = async (request, responseAggs)=>{
            const histogram = createTimeLineChart(request, getJsonDataForTimeLineChart(responseAggs['date_histo']['buckets']), keyword);
            dispatch(setHistogramResult(histogram));
        };
        const buildTweetCount = async (responseAggs) => {
            const tweetCount = {};
            tweetCount.count = responseAggs['tweet_count']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            tweetCount.retweet = responseAggs['retweets']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            tweetCount.like = responseAggs['likes']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            dispatch(setCountResult(tweetCount));
        };

        const buildPieCharts = async (request, responseAggs) => {
            const pieCharts = createPieCharts(request, getJsonDataForPieCharts(responseAggs, request.keywordList), keyword);
            dispatch(setPieChartsResult(pieCharts));
        };

        const buildHeatMap = async (request, tweets) => {
            const heatMap = createHeatMap(request, tweets, keyword);
            dispatch(setHeatMapResult(heatMap));
        };

        const buildCoHashTag = async (tweets) => {
            const coHashtagGraph = createCoHashtagGraph(tweets);
            dispatch(setCoHashtagResult(coHashtagGraph));
        };

        const buildUrls = async (responseAggs) => {
            const urls = getJsonDataForURLTable(responseAggs['top_url_keyword']['buckets'], keyword);
            dispatch(setUrlsResult(urls));
        }

        const buidTopUsers = async (tweets) =>{
            let authors = getTopActiveUsers(tweets, 100).map((arr) => {return arr[0];});
            if (authors.length > 0) {
                getUserAccounts(authors).then((data) => dispatch(setUserProfileMostActive(data.hits.hits)))
            }
        }

        


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
              url: `${publicRuntimeConfig.baseFolder}/api/wrapper/collect`,
              data: request
            };
            // axios.post(TwintWrapperUrl + "/collect", request)
            authenticatedRequest(axiosConfig)
              .then(response => {
                if (response.data.status === "Error")
                  handleErrors("twitterSnaErrorMessage");
                else if (response.data.status === "Done")
                  cacheRenderCall(response.data.session, request);
                else {
                  setFirstCallRenderer(true);
                  getResultUntilsDone(response.data.session,request);}

              }).catch(error => {
                handleErrors(error);
              });
          } else {
            cacheRenderCall(null, request);
          }
       

    }, [JSON.stringify(request)]);


};
export default useTwitterSnaRequest;