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





const useTwitterSnaRequest = (request) => {
    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

    useEffect(() => {

        const createTimeLineChart = (request, json) => {

            let layout = {
                title: keyword("user_time_chart_title") + "<br>" + request.keywordList.join(", ") + " - " + request["from"] + " - " + request["until"],
                automargin: true,
                xaxis: {
                range: [request.from, request.until],
                rangeslider: { range: [request.from, request.until] },
                },
                annotations: [{
                xref: 'paper',
                yref: 'paper',
                x: 1.15,
                xanchor: 'right',
                y: -0.4,
                yanchor: 'top',
                text: 'we-verify.eu',
                showarrow: false
                },
                {
                xref: 'paper',
                yref: 'paper',
                x: 1.15,
                xanchor: 'right',
                y: -0.6,
                yanchor: 'top',
                text: keyword('twitter_local_time'),
                showarrow: false
                }],
                autosize: true,
            };
            let config = {
                displayModeBar: true,
                toImageButtonOptions: {
                format: 'png', // one of png, svg, jpeg, webp
                filename: request.keywordList.join("&") + "_" + request["from"] + "_" + request["until"] + "_Timeline",
                scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
                },
        
                responsive: true,
                modeBarButtons: [["toImage"], ["resetScale2d"]],
                displaylogo: false,
            };
            json.map((obj) => {
                obj.x = obj.x.map((timestamp) => {return new Date(parseInt(timestamp) * 1000)});
                return obj;
            })
            return {
                title: "user_time_chart_title",
                json: json,
                layout: layout,
                config: config,
                tweetsView: null,
            };
        };
         const getJsonDataForTimeLineChart = (dataResponse) => {
            let dates = dataResponse;
        
            var infos = [];
        
            const usersGet = (dateObj, infos) => {
              dateObj["3"]["buckets"].forEach(obj => {
                infos.push({
                  date: obj["dt"]['buckets']['0']['key_as_string'],
                  key: obj["key"],
                  nb: obj["rt"]["value"]
                })
              });
        
              return infos;
            }
        
            dates.forEach(dateObj => {
              usersGet(dateObj, infos);
              infos.push({
                date: dateObj['key_as_string'],
                key: "Tweets",
                nb: dateObj["doc_count"],
              });
              infos.push({
                date: dateObj['key_as_string'],
                key: "Retweets",
                nb: dateObj["1"]["value"]
              });
            });
        
            var lines = [];
            while (infos.length !== 0) {
        
              let info = infos.pop();
              let date = info.date;
              let nb = info.nb;
              var type = "markers";
              if (info.key === "Tweets" || info.key === "Retweets")
                type = 'lines';
              let plotlyInfo = {
                mode: type,
                name: info.key,
                x: [],
                y: []
              }
        
              for (let i = 0; i < infos.length; ++i) {
                if (infos[i].key === info.key) {
                  plotlyInfo.x.push(infos[i].date);
                  plotlyInfo.y.push(infos[i].nb);
                  infos.splice(i, 1);
                  i--;
                }
              }
              plotlyInfo.x.push(date);
              plotlyInfo.y.push(nb);
              lines.push(plotlyInfo);
            }
        
            return lines;
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

        const makeResult = (request, responseArrayOf9, givenFrom, givenUntil, final) => {
            let responseAggs = responseArrayOf9[0]['aggregations']
            const result = {};
            result.histogram = createTimeLineChart(request, getJsonDataForTimeLineChart(responseAggs['date_histo']['buckets']), givenFrom, givenUntil);
        
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