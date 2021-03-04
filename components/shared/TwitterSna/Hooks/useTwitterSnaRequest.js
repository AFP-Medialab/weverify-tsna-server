import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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
  setCoHashtagResult,
  setGexfExport,
} from "../../../../redux/actions/tools/twitterSnaActions";
import {
  getAggregationData,
  getTweets,
  getUserAccounts,
  getCloudTweets,
  getESQuery4Gexf,
} from "./call-elastic";
import { createTimeLineChart, getJsonDataForTimeLineChart } from "./timeline";
import { createPieCharts, getJsonDataForPieCharts } from "./pieCharts";
import { removeUnusedFields } from "../lib/displayTweets";
import socioWorker from "workerize-loader?inline!./socioSemGraph";
import cloudWorker from "workerize-loader?inline!./cloudChart";
import hashtagWorker from "workerize-loader?inline!./hashtagGraph";

import { createHeatMap } from "./heatMap";

import { getJsonDataForURLTable } from "./urlList";

import useAuthenticatedRequest from "../../AuthenticationCard/useAuthenticatedRequest";
import { setError } from "../../../../redux/actions/errorActions";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const useTwitterSnaRequest = (request, keyword) => {
  const dispatch = useDispatch();
  const authenticatedRequest = useAuthenticatedRequest();
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );

  useEffect(() => {
    const handleErrors = (e) => {
      if (keyword(e) !== "") {
        dispatch(setError(keyword(e)));
      } else dispatch(setError(keyword("default_sna_error")));
      dispatch(setTwitterSnaLoading(false));
    };
    // Check request
    const cacheRenderCall = (request) => {
      console.log("cache cachce");
      dispatch(
        setTwitterSnaLoadingMessage(keyword("twittersna_building_graphs"))
      );
      //generateFirstGraph(request);
      (generateSecondGraph(request) && generateThirdGraph(request)).then(() => {
        dispatch(setTwitterSnaLoading(false));
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
            dispatch(setTwitterSnaLoading(false));
          } else if (response.data.status === "CountingWords") {
            if (lastStep === "Running") {
              //flag
              dispatch(
                setTwitterSnaLoadingMessage(
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
                  setTwitterSnaLoadingMessage(
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
          dispatch(userLogoutAction());
          handleErrors("twittersna_invalid_credentials");
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
      dispatch(setTweetResult(tweets));
      buildFirstResult(request, responseArrayOf9[0]["aggregations"]);
      buildHeatMap(request, tweets);
      buildCoHashTag(lcTweets);
      buildSocioGraph(
        lcTweets,
        responseArrayOf9[0]["aggregations"].top_user_retweet.buckets
      );
      buidTopUsers(lcTweets);
    };

    const buildFirstResult = (request, responseAggs) => {
      buildHistogram(request, responseAggs);
      buildTweetCount(responseAggs);
      buildPieCharts(request, responseAggs);
      buildUrls(responseAggs);
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
      const instance = cloudWorker();
      const wordCountResponse = await instance.createWordCloud(tweets, request);
      dispatch(setCloudWordsResult(wordCountResponse));
    };
    const buildGexf = async (entries) => {
      axios.all([getESQuery4Gexf(entries)]).then((response) => {
        dispatch(setGexfExport(response[0]));
      });
    };

    const buildSocioGraph = async (tweets, topUser) => {
      const instance = socioWorker();
      const socioSemantic4ModeGraphJson = await instance.createSocioSemantic4ModeGraph(
        tweets,
        topUser
      );
      const socioSemantic4ModeGraph = JSON.parse(socioSemantic4ModeGraphJson);
      dispatch(setSocioGraphResult(socioSemantic4ModeGraph));
    };

    const buildCoHashTag = async (tweets) => {
      const instance = hashtagWorker();
      const coHashtagGraph = await instance.createCoHashtagGraph(tweets);
      dispatch(setCoHashtagResult(coHashtagGraph));
    };

    const buildPieCharts = async (request, responseAggs) => {
      const pieCharts = createPieCharts(
        request,
        getJsonDataForPieCharts(responseAggs, request.keywordList),
        keyword
      );
      dispatch(setPieChartsResult(pieCharts));
    };

    const buildHistogram = async (request, responseAggs) => {
      const histogram = createTimeLineChart(
        request,
        getJsonDataForTimeLineChart(responseAggs["date_histo"]["buckets"]),
        keyword
      );
      dispatch(setHistogramResult(histogram));
    };

    const buildHeatMap = async (request, tweets) => {
      const heatMap = createHeatMap(request, tweets, keyword);
      dispatch(setHeatMapResult(heatMap));
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
      dispatch(setCountResult(tweetCount));
    };

    const buildUrls = async (responseAggs) => {
      const urls = getJsonDataForURLTable(
        responseAggs["top_url_keyword"]["buckets"],
        keyword
      );
      dispatch(setUrlsResult(urls));
    };

    const buidTopUsers = async (tweets) => {
      let authors = getTopActiveUsers(tweets, 100).map((arr) => {
        return arr[0];
      });
      if (authors.length > 0) {
        getUserAccounts(authors).then((data) =>
          dispatch(setUserProfileMostActive(data.hits.hits))
        );
      }
    };

    if (
      _.isNil(request) ||
      _.isNil(request.keywordList) ||
      _.isEmpty(request.keywordList) ||
      // || (_.isNil(request.userList) || _.isEmpty(request.userList))
      _.isNil(request.from) ||
      _.isNil(request.until)
    ) {
      dispatch(setTwitterSnaResult(request, null, false, false));
      return;
    }
    dispatch(setTwitterSnaLoading(true));
    dispatch(setTwitterSnaLoadingMessage(keyword("twittersna_start")));
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
