import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfoFB';
import HistoTweetsTable from "./HistoTweetsTableCSV";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../styles/useMyStyles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import CircularProgress from "@material-ui/core/CircularProgress";
import { displayPosts } from "./lib/displayPosts";
import { filterForTimeLine,getEpochMillis } from "./Common/hooks/timeline";
import {setCSVHistoview} from "../../../../redux/actions/tools/csvSnaActions";


const Plot = createPlotComponent(plotly);
let from = "PLOT_LINE";


export default function PlotTimeLine(props){
  //  console.log("CEVA ", props.result.snaType);
  const snatype = useSelector((state) => state.csvSna.result.snaType);
  console.log("SOMETHING ",snatype.tsv)

  const keyword = useLoadLanguage(snatype.tsv);
    const dispatch = useDispatch();
    //HISTOGRAM
    const [histoVisible, setHistoVisible] = useState(true);
    const histoPosts = useSelector((state) => state.csvSna.result.histoview);
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
            let selectedPoints = data.points;
           let filteredPost = state.result.data.filter(function(post) {
               // console.log("HISTO2 ",post.created)
                let postDate =getEpochMillis(post.created);

               // console.log("HISTO3 ",postDate)
                return filterForTimeLine(postDate, selectedPoints);
                
            });
            
            
             dispatch(setCSVHistoview(from, displayPosts(filteredPost, keyword)));
             console.log("CEVAA ", keyword)
        
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
                {
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
                        
                        histoPosts &&
                        <HistoTweetsTable 
                            data={histoPosts} 
                            from={from} 
                        />
                        
                    }
                </div>
                }
                {
            state.result.histogram === undefined &&
            <CircularProgress className={classes.circularProgress} />
        }
            </AccordionDetails>
        </Accordion>
    );
}