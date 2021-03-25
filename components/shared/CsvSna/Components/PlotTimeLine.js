import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../hooks/useLoadLanguage";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import HistoTweetsTable from "../../TwitterSna/Components/HistoTweetsTable";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../styles/useMyStyles";
import AccordionDetails from "@material-ui/core/AccordionDetails";

const Plot = createPlotComponent(plotly);
let from = "PLOT_LINE";
export default function PlotTimeLine(props){
    console.log("PlotTimeLine");

    const dispatch = useDispatch();
    //HISTOGRAM
    const [histoVisible, setHistoVisible] = useState(true);
    const histoTweets =  useSelector(state => state.twitterSna.histoview);

    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const classes = useMyStyles();


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
    }, [props.result.histogram]);


    const onHistogramClick = (data) => {
        
        if (state.result.tweets !== undefined) {
            
            let selectedPoints = data.points;
            let filteredTweets = state.result.tweets.filter(function(tweet) {
                let tweetDate = new Date(tweet._source.datetimestamp * 1000);
               // return filterTweetsForTimeLine(tweetDate, selectedPoints);
            });
            // dispatch(setTweetsDetailPanel(from, displayTweets(filteredTweets, keyword)));
        }
    }

    
    return (
        <Accordion expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={"panel0a-content"}
                id={"panel0a-header"}
            >
                <Typography className={classes.heading}>{keyword(state.result.histogram.title)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {}
                <div style={{ width: '100%', }}>
                    {(state.result.histogram.json && (state.result.histogram.json.length === 0) &&
                        <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>)}
                    {(state.result.histogram.json && state.result.histogram.json.length !== 0) &&
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
                    }
                    <Box m={1} />
                    <OnClickInfo keyword={"twittersna_timeline_tip"}/>
                    <Box m={2} />
                    {
                        histoTweets &&
                        <HistoTweetsTable 
                            data={histoTweets} 
                            from={from} 
                        />
                    }
                </div>
            </AccordionDetails>
        </Accordion>
    );
}