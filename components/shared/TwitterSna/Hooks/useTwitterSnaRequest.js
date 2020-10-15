import {useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import useLoadLanguage from "../../hooks/useLoadLanguage";
import {
    setTwitterSnaLoading, 
    setTwitterSnaResult, 
    setTwitterSnaLoadingMessage} from "../../../../redux/actions/tools/twitterSnaActions";
import {
    getAggregationData,
    getTweets
} from "./call-elastic";
import {
    createTimeLineChart,
    getJsonDataForTimeLineChart
} from "./timeline";
import {
    createPieCharts,
    getJsonDataForPieCharts
} from "./pieCharts"
import {
    createHeatMap
} from "./heatMap"
import {
    createCoHashtagGraph
} from "./hashtagGraph"
import {
    createSocioSemantic4ModeGraph
} from "./socioSemGraph"


const useTwitterSnaRequest = (request) => {
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

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

        const makeResult = (request, responseArrayOf9) => {
            let responseAggs = responseArrayOf9[0]['aggregations']
            const result = {};
            result.histogram = createTimeLineChart(request, getJsonDataForTimeLineChart(responseAggs['date_histo']['buckets']), keyword);
            result.tweetCount = {};
            result.tweetCount.count = responseAggs['tweet_count']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweetCount.retweet = responseAggs['retweets']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.tweetCount.like = responseAggs['likes']['value'].toString().replace(/(?=(\d{3})+(?!\d))/g, " ");
            result.pieCharts = createPieCharts(request, getJsonDataForPieCharts(responseAggs, request.keywordList), keyword);
            result.tweets = responseArrayOf9[1].tweets;
            result.heatMap = createHeatMap(request, result.tweets, keyword);
            result.coHashtagGraph = createCoHashtagGraph(result.tweets);
            result.socioSemantic4ModeGraph = createSocioSemantic4ModeGraph(result.tweets);

            dispatch(setTwitterSnaResult(request, result, false, true));
        };

        if (_.isNil(request)
            || (_.isNil(request.keywordList) || _.isEmpty(request.keywordList))
            // || (_.isNil(request.userList) || _.isEmpty(request.userList))
            || _.isNil(request.from)
            || _.isNil(request.until)) {
            // console.log("Empty request, resetting result: ", request);
            dispatch(setTwitterSnaResult(request, null, false, false));
            return;
        }
        
        dispatch(setTwitterSnaLoading(true));

        //authentication test to set later
        lastRenderCall(null, request);
       

    }, [JSON.stringify(request)]);


};
export default useTwitterSnaRequest;