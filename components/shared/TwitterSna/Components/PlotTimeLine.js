import React, {useEffect, useState} from 'react';
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../languages/languages"

const Plot = createPlotComponent(plotly);

export default function PlotTimeLine(props){

    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

    const [state, setState] = useState(
        {
            result: props.result        
        }
    );
    useEffect(() => {
        setState({
            ...state,
            result: props.result,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.result]);
    //HISTOGRAM
    const [histoTweets, setHistoTweets] = useState(null);

    function isInRange(pointDate, objDate, periode) {

        if (periode === "isHours") {
            return (((pointDate.getDate() === objDate.getDate()
                && pointDate.getHours() - 1 === objDate.getHours()))
                && pointDate.getMonth() === objDate.getMonth()
                && pointDate.getFullYear() === objDate.getFullYear());
        }
        else {
            return (pointDate - objDate) === 0;
        }
    }

    function filterTweetsForTimeLine(tweetDate, selectedPoints) {
        for (let i = 0; i < selectedPoints.length; i++) {
            let pointedDate = new Date(selectedPoints[i].x);
            if (selectedPoints[i].data.mode !== "lines" && isInRange(pointedDate, tweetDate, "isDays")) {
                return true;
            };
        }
    }


    const onHistogramClick = (data) => {
        
        console.log("onhisto click : " + state.result.tweets);
        if (state.result.tweets !== undefined) {
            
            let selectedPoints = data.points;
            let filteredTweets = state.result.tweets.filter(function(tweet) {
                let tweetDate = new Date(tweet._source.datetimestamp * 1000);
                return filterTweetsForTimeLine(tweetDate, selectedPoints);
            });
            setHistoTweets(displayTweets(filteredTweets));
        }
    }

    const displayTweets = (filteredTweets, sortedColumn) => {

        let columns = [];
        if (sortedColumn === "nbLikes") {
            columns = [
                { title: keyword('twittersna_result_date'), field: 'date'},
                { title: keyword('twittersna_result_username'), field: 'screen_name'},
                { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
                { title: keyword('twittersna_result_like_nb'), field: "nbLikes", defaultSort: "desc" },
                { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb'}
            ];
        } else if (sortedColumn === "retweetNb") {
            columns = [
                { title: keyword('twittersna_result_date'), field: 'date'},
                { title: keyword('twittersna_result_username'), field: 'screen_name'},
                { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
                { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
                { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb', defaultSort: "desc" }
            ];
        } else {
            columns = [
                { title: keyword('twittersna_result_date'), field: 'date', defaultSort: "asc" },
                { title: keyword('twittersna_result_username'), field: 'screen_name'},
                { title: keyword('twittersna_result_tweet'), field: 'tweet', render: getTweetWithClickableLink },
                { title: keyword('twittersna_result_like_nb'), field: "nbLikes"},
                { title: keyword('twittersna_result_retweet_nb'), field: 'retweetNb'}
            ];
        }

        let csvArr = keyword("twittersna_result_date") + ',' 
                    + keyword("twittersna_result_username") + ',' 
                    + keyword("twittersna_result_tweet") + ',' 
                    + keyword('twittersna_result_like_nb') + ',' 
                    + keyword("twittersna_result_retweet_nb") + ',' 
                    + keyword("elastic_url") +'\n';

        let resData = [];
        filteredTweets.forEach(tweetObj => {
            const date = new Date(tweetObj._source.datetimestamp * 1000);
            resData.push(
                {
                    date: date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes(),
                    screen_name: <a href={"https://twitter.com/" + tweetObj._source.screen_name} target="_blank" rel="noopener noreferrer">{tweetObj._source.screen_name}</a>,
                    tweet: tweetObj._source.full_text,
                    nbLikes: tweetObj._source.favorite_count,
                    retweetNb: tweetObj._source.retweet_count,
                    link: "https://twitter.com/" + tweetObj._source.screen_name + "/status/" + tweetObj._source.id_str
                }
            );
            csvArr += date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + '_' + date.getHours() + 'h' + date.getMinutes() + ',' +
                        tweetObj._source.screen_name + ',"' 
                        + tweetObj._source.full_text + '",' 
                        + tweetObj._source.favorite_count + ','
                        + tweetObj._source.retweet_count + ',' 
                        + "https://twitter.com/" + tweetObj._source.screen_name + "/status/" + tweetObj._source.id_str + '\n';
        });

        return {
            data: resData,
            columns: columns,
            csvArr: csvArr,
        };
    }

    return (
        <Plot useResizeHandler
            style={{ width: '100%', height: "450px" }}
            data={state.result.histogram.json}
            layout={state.result.histogram.layout}
            config={state.result.histogram.config}
            onClick={(e) => onHistogramClick(e)}
            onPurge={(a, b) => {
                console.log(a);
                console.log(b);
            }}
        />
    );
}