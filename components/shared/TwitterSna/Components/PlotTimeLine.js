import React, {useEffect, useState} from 'react';
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../hooks/useLoadLanguage";
import {displayTweets} from "../lib/displayTweets";

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
        
        if (state.result.tweets !== undefined) {
            
            let selectedPoints = data.points;
            let filteredTweets = state.result.tweets.filter(function(tweet) {
                let tweetDate = new Date(tweet._source.datetimestamp * 1000);
                return filterTweetsForTimeLine(tweetDate, selectedPoints);
            });
            setHistoTweets(displayTweets(filteredTweets, keyword));
        }
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