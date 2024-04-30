import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getAggregationData,
  getTweets,
  getUserAccounts,
  getCloudTweets,
  getESQuery4Gexf,
} from "./call-elastic";
import { getJsonDataForTimeLineChart } from "./timelineTW";
import { createTimeLineChart } from "../../Hooks/timeline";
import { createPieCharts, getJsonDataForPieCharts } from "./pieCharts";
import {removeUnusedFields} from "../../../SNA/lib/displayTweets"

import { createHeatMap } from "./heatMap";

import { getJsonDataForURLTable } from "../../Hooks/urlList";

import useAuthenticatedRequest from "../../../shared/AuthenticationCard/useAuthenticatedRequest"

import getConfig from "next/config";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import {widgetTitle, widgetPieTitle} from "./tsnaUtils"
import { authUserLoggedOut } from "../../../../redux/slices/authentificationSlice";
import { errorSet } from "../../../../redux/slices/errorSlice";
import { twitterSnaCloudWordsResultSet, twitterSnaCoHashtagResultSet, twitterSnaCountResultSet, twitterSnaGexfExportSet, twitterSnaHeatMapResultSet, twitterSnaHistogramResultSet, twitterSnaLoadingMessageSet, twitterSnaLoadingSet, twitterSnaPieChartsResultSet, twitterSnaResultSet, twitterSnaSocioGraphResultSet, twitterSnaTweetsResultSet, twitterSnaUrlsResultSet, twitterSnaUserProfileMostActiveSet } from "../../../../redux/slices/tools/twitterSnaSlice";

const { publicRuntimeConfig } = getConfig();
const sna = { tsv: "/components/NavItems/tools/TwitterSna.tsv"};

const useTwitterSnaRequest = (request) => {

const tsnaWorkers = useRef()

	const keyword = useLoadLanguage(sna.tsv)
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );
  const role = useSelector((state) => state.userSession.user.roles);
  
  useEffect(() => {
    let cloudWorker = new Worker(new URL('./cloudChart.js', import.meta.url));
    let hashtagWorker =  new Worker(new URL('./hashtagGraph.js', import.meta.url))
    let socioWorker = new Worker(new URL('./socioSemGraph.js', import.meta.url))

    tsnaWorkers.current = {
      socioWorker: socioWorker,
      cloudWorker: cloudWorker,
      hashtagWorker: hashtagWorker
  }
    return () => {
      tsnaWorkers.current.socioWorker.terminate()
      tsnaWorkers.current.cloudWorker.terminate()
      tsnaWorkers.current.hashtagWorker.terminate()
    }
  }, []);
  useEffect(() => {
    const enableExtraFeatures = () => {
      for (let index in role) {
        if (role[index] == "EXTRA_FEATURE") {
          return true;
        }
      }
      return false;
    };
    const handleErrors = (e) => {
      if (keyword(e) !== "") {
        dispatch(errorSet(keyword(e)));
      } else dispatch(errorSet(keyword("default_sna_error")));
      dispatch(twitterSnaLoadingSet(false));
    };
    // Check request
    const cacheRenderCall = (request) => {
      dispatch(
        twitterSnaLoadingMessageSet(keyword("twittersna_building_graphs"))
      );
      //generateFirstGraph(request);
      (generateSecondGraph(request) && generateThirdGraph(request)).then(() => {
        //dispatch(setTwitterSnaLoading(false));
      });
    };

    const getResultUntilsDone = async (sessionId, request, lastStep) => {
      const axiosConfig = {
        method: "get",
        url: `${publicRuntimeConfig.baseFolder}/api/wrapper/status/${sessionId}`,
      };
      await authenticatedRequest(axiosConfig)
        .then(async (response) => {
          if (response.data.status === "Error")
            handleErrors("twitterSnaErrorMessage");
          else if (response.data.status === "Done") {
            if (lastStep === "Running") {
              generateSecondGraph(request);
            }
            generateThirdGraph(request);
            //dispatch(setTwitterSnaLoading(false));
          } else if (response.data.status === "CountingWords") {
            if (lastStep === "Running") {
              //flag
              dispatch(
                twitterSnaLoadingMessageSet(
                  keyword("twittersna_counting_words")
                )
              );
              generateSecondGraph(request);
            }
            setTimeout(
              () => getResultUntilsDone(sessionId, request, "CountingWords"),
              3000
            );
          } else {
            //running
            generateFirstGraph(request).then(() => {
              if (lastStep === "Pending")
                dispatch(
                  twitterSnaLoadingMessageSet(
                    keyword("twittersna_fetching_tweets")
                  )
                );
              setTimeout(
                () => getResultUntilsDone(sessionId, request, "Running"),
                5000
              );
            });
          }
        })
        .catch(() => {
          dispatch(authUserLoggedOut());
          handleErrors("twittersna_invalid_credentials");
        });
    };

    const makeEntries = (data) => {
      return {
        from: request.from,
        until: request.until,
        keywordList: request.keywordList,
        keywordAnyList: request.keywordAnyList,
        bannedWords: request.bannedWords,
        userList: request.userList,
        session: data.session,
        media: data.media ? data.media : "none",
        lang: data.lang ? data.lang : "none",
        verified: data.verified,
      };
    };
    /**
     * Build all widget component for scapping results
     * @param {*} request request
     * @param {*} final if scrapping is done
     */
    const generateFirstGraph = async (request) => {
      let entries = makeEntries(request);

      axios
        .all([getAggregationData(entries)])
        .then((responseArrayOf9) => {
          makeFirstResult(request, responseArrayOf9);
        })
        .catch(() => {
          handleErrors("twitterSnaErrorMessage");
        });
    };

    const generateSecondGraph = async (request) => {
      let entries = makeEntries(request);
      await axios
        .all([getAggregationData(entries), getTweets(entries)])
        .then((responseArrayOf9) => {
          buildGexf(entries);
          makeSecondResult(request, responseArrayOf9);
        })
        .catch(() => {
          handleErrors("twitterSnaErrorMessage");
        });
    };

    const generateThirdGraph = async (request) => {
      let entries = makeEntries(request);
      axios
        .all([getCloudTweets(entries)])
        .then((responseArrayOf9) => {
          makeThirdResult(request, responseArrayOf9);
        })
        .catch(() => {
          handleErrors("twitterSnaErrorMessage");
        });
    };

    const makeFirstResult = (request, responseArrayOf9) => {
      let responseAggs = responseArrayOf9[0]["aggregations"];
      buildFirstResult(request, responseAggs);
    };

    const makeSecondResult = (request, responseArrayOf9) => {
      const tweets = responseArrayOf9[1].tweets;
      const lcTweets = removeUnusedFields(tweets, [
        "full_text",
        "coordinates",
        "geo",
        "created_at",
        "datetimestamp",
        "source",
        "limited_actions",
        "forward_pivot",
        "place",
        "lang",
      ]);
      dispatch(twitterSnaTweetsResultSet(tweets));
      buildFirstResult(request, responseArrayOf9[0]["aggregations"]);
      buildHeatMap(request, tweets);
      buildCoHashTag(lcTweets);
      buildSocioGraph(
        lcTweets,
        responseArrayOf9[0]["aggregations"].top_user_retweet.buckets
      );
      buidTopUsers(lcTweets);
      buildUrls(responseArrayOf9[0]["aggregations"]);
    };

    const buildFirstResult = (request, responseAggs) => {
      buildHistogram(request, responseAggs);
      buildTweetCount(responseAggs);
      buildPieCharts(request, responseAggs);
      
    };

    const makeThirdResult = (request, responseArrayOf9) => {
      //word cloud
      wordCount(responseArrayOf9[0].tweets, request);
    };

    function getTopActiveUsers(tweets, topN) {
      let tweetCountObj = _.countBy(
        tweets.map((tweet) => {
          return tweet._source.screen_name.toLowerCase();
        })
      );
      let topUsers2DArr = _.sortBy(Object.entries(tweetCountObj), [
        function (o) {
          return o[1];
        },
      ])
        .reverse()
        .slice(0, topN);
      return topUsers2DArr;
    }

    const wordCount = async (tweets, request) => {
      tsnaWorkers.current.cloudWorker.postMessage([tweets, request]);
      tsnaWorkers.current.cloudWorker.onmessage = (evt) => {
        let wordCountResponse = evt.data;
        dispatch(twitterSnaCloudWordsResultSet(wordCountResponse));
      }
      //const wordCountResponse = await instance.createWordCloud(tweets, request);
     
    };
    const buildGexf = async (entries) => {
      axios.all([getESQuery4Gexf(entries)]).then((response) => {
        dispatch(twitterSnaGexfExportSet(response[0]));
      });
    };

    const buildSocioGraph = async (tweets, topUser) => {
      tsnaWorkers.current.socioWorker.postMessage([tweets, topUser]);
      tsnaWorkers.current.socioWorker.onmessage = (evt) =>{
        const socioSemantic4ModeGraph = JSON.parse(evt.data);
        dispatch(twitterSnaSocioGraphResultSet(socioSemantic4ModeGraph));
      }
     
    };

    const buildCoHashTag = async (tweets) => {
      tsnaWorkers.current.hashtagWorker.postMessage(tweets);
      tsnaWorkers.current.hashtagWorker.onmessage = (evt) => {
        //console.log("received message hashtag")
        let coHashtagGraph = evt.data;
        dispatch(twitterSnaCoHashtagResultSet(coHashtagGraph));
      }
    };

    const buildPieCharts = async (request, responseAggs) => {
      const pieCharts = createPieCharts(
        request,
        getJsonDataForPieCharts(responseAggs, widgetPieTitle(request)),
        keyword
      );
      dispatch(twitterSnaPieChartsResultSet(pieCharts));
    };

    const buildHistogram = async (request, responseAggs) => {
      var title = keyword("user_time_chart_title") + "<br>" + widgetTitle(request);
      var full_fileName = request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Timeline";
      const histogram = createTimeLineChart(
        request.from, request.until,
        getJsonDataForTimeLineChart(responseAggs["date_histo"]["buckets"]),
        title, full_fileName
      );
      dispatch(twitterSnaHistogramResultSet(histogram));
    };

    const buildHeatMap = async (request, tweets) => {
      const heatMap = createHeatMap(request, tweets, keyword);
      dispatch(twitterSnaHeatMapResultSet(heatMap));
    };

    const buildTweetCount = async (responseAggs) => {
      const tweetCount = {};
      tweetCount.count = responseAggs["tweet_count"]["value"]
        .toString()
        .replace(/(?=(\d{3})+(?!\d))/g, " ");
      tweetCount.retweet = responseAggs["retweets"]["value"]
        .toString()
        .replace(/(?=(\d{3})+(?!\d))/g, " ");
      tweetCount.like = responseAggs["likes"]["value"]
        .toString()
        .replace(/(?=(\d{3})+(?!\d))/g, " ");
      dispatch(twitterSnaCountResultSet(tweetCount));
    };

    const buildUrls = async (responseAggs) => {
      const urls = await getJsonDataForURLTable(
        responseAggs["top_url_keyword"]["buckets"],
        {
          "url" : keyword("elastic_url"),
          "count": keyword("elastic_count"), 
          "credibility" : keyword("sna_credibility")
        },
        {"url": "key", "count" :"doc_count"}, enableExtraFeatures()
      );
      dispatch(twitterSnaUrlsResultSet(urls));
    };

    const buidTopUsers = async (tweets) => {
      let authors = getTopActiveUsers(tweets, 100).map((arr) => {
        return arr[0];
      });
      if (authors.length > 0) {
        getUserAccounts(authors).then((data) =>
          dispatch(twitterSnaUserProfileMostActiveSet(data.hits.hits))
        );
      }
    };

    if (
      _.isNil(request) ||
      _.isNil(request.keywordList) ||
      (_.isEmpty(request.keywordList) &&  _.isEmpty(request.keywordAnyList)) ||
      // || (_.isNil(request.userList) || _.isEmpty(request.userList))
      _.isNil(request.from) ||
      _.isNil(request.until)
    ) {
      dispatch(twitterSnaResultSet({request: request, result: null, notification: false, loading: false}));
      return;
    }
    
    //TODO premier message à mettre ici

    //authentication test to set later
    if (userAuthenticated) {
      const axiosConfig = {
        method: "post",
        url: `${publicRuntimeConfig.baseFolder}/api/wrapper/collect`,
        data: request,
      };
      // axios.post(TwintWrapperUrl + "/collect", request)
      authenticatedRequest(axiosConfig)
        .then((response) => {
          if (response.data.status === "Error")
            handleErrors("twitterSnaErrorMessage");
          else if (response.data.status === "Done") { 
            cacheRenderCall(request);
          } else {
            dispatch(twitterSnaLoadingSet(true, 5));
            dispatch(twitterSnaLoadingMessageSet(keyword("twittersna_start")));
            getResultUntilsDone(response.data.session, request, "Pending");
          }
        })
        .catch(() => {
          handleErrors("twittersna_invalid_credentials");
        });
    }
  }, [JSON.stringify(request)]);
};
export default useTwitterSnaRequest;
