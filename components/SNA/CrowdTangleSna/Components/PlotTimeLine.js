import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfo';
import HistoTweetsTable from "./HistoTweetsTableCSV";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../../shared/styles/useMyStyles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import CircularProgress from "@material-ui/core/CircularProgress";
import { displayPostsFb,displayPostsInsta} from "./lib/displayPosts";
import {getEpochMillis } from "./hooks/timelineCT";
import { filterForTimeLine } from '../../Hooks/timeline';
import {setCSVHistoview} from "../../../../redux/actions/tools/crowdTangleSnaActions";
import { CT_TSV } from '../../lib/CrowdTangleConstant';
import Card from "@material-ui/core/Card";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";

const Plot = createPlotComponent(plotly);
let from = "PLOT_LINE";


export default function PlotTimeLine(props){
  const sna = useSelector((state) => state.sna);

    const keyword = useLoadLanguage(sna.tsv);
    const dispatch = useDispatch();
    //HISTOGRAM
    const [histoVisible, setHistoVisible] = useState(true);
    const histoPosts = useSelector((state) => state.ctSna.result.histoview);
    const classes = useMyStyles();
    console.log("PLOT", props.result);


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
                let postDate = getEpochMillis(post.post_created);
              //  console.log("POST_DATE ",postDate)
                return filterForTimeLine(postDate, selectedPoints);

            });
            //console.log("FILTERED_HIST ", filterForTimeLine)

            
            if (filteredPost[0].facebook_id){
                console.log("FACEBOOK")
                dispatch(
                    setCSVHistoview(from, displayPostsFb(filteredPost)));

            }
            else
            {
                console.log("INSTA")
                dispatch(
                    setCSVHistoview(from, displayPostsInsta(filteredPost)));

 
            }
            //console.log("onHISTOGRAM" ,filteredPost[0].link[12])
            
        
    }

    
    return (
        <Card className={classes.cardsResults}>
            <CustomCardHeader title={keyword(state.result.histogram.title)} showHelp={true} helpText={"ct_sna_timeline_tip"} />
                {
                <div style={{ width: '100%', }} className={classes.cardsResults}>
                    {(state.result.histogram.json && (state.result.histogram.json.length === 0) &&
                        <Typography variant={"body2"}>{keyword("ct_sna_no_data")}</Typography>)}
                    {(state.result.histogram.json && state.result.histogram.json.length !== 0) &&
                    <Plot useResizeHandler
                        style={{ width: '100%', height: "450px" }}
                        data={state.result.histogram.json}
                        layout={state.result.histogram.layout}
                        config={state.result.histogram.config}
                        onClick={(e) => onHistogramClick(e)}
                        onPurge={(a, b) => {
                        }}
                    />
                    }
                    
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
        </Card>
    );
}