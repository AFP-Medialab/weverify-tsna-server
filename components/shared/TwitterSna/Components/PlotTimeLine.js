import React, {useEffect, useState} from 'react';
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';

const Plot = createPlotComponent(plotly);

export default function PlotTimeLine(props){

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
const onHistogramClick = (data) => {
    if (state.result.tweets !== undefined) {
        let selectedPoints = data.points;
        let filteredTweets = state.result.tweets.filter(function(tweet) {
            let tweetDate = new Date(tweet._source.datetimestamp * 1000);
            return filterTweetsForTimeLine(tweetDate, selectedPoints);
        });
        setHistoTweets(displayTweets(filteredTweets));
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