import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import plotly from 'plotly.js-dist';
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfoFB';
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from 'react';
import {useSelector } from "react-redux";
import createPlotComponent from 'react-plotly.js/factory';
import {onHeatMapClick} from "./hooks/heatMap"
import PostViewTable  from "../../Components/PostViewTable";
import useMyStyles from "../../../shared/styles/useMyStyles";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";

const Plot = createPlotComponent(plotly);

export default function HeatMap (props) { 
    const sna = useSelector((state) => state.sna);
    const keyword = useLoadLanguage(sna.tsv);
    const classes = useMyStyles();
   
    const [heatMapTweets, setHeatMapTweets] = useState(null);

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
    }, [props.result.heatMap]);

    useEffect(() => {
        setHeatMapTweets(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request])
    console.log("heat ", heatMapTweets)

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography className={classes.heading}>{keyword("ct_heatmap_chart_title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                    props.result && props.result.heatMap &&
                    <Box alignItems="center" justifyContent="center" width={"100%"}>
                        {
                            ((props.result.heatMap.isAllnul) &&
                                <Typography variant={"body2"}>{keyword("ct_sna_no_data")}</Typography>) ||
                            <div>
                                <Plot
                                    style={{ width: '100%', height: "450px" }}
                                    data={props.result.heatMap.plot}
                                    config={props.result.heatMap.config}
                                    layout={props.result.heatMap.layout}
                                    onClick={(e) => onHeatMapClick(e, props.result, setHeatMapTweets)}
                                />
                                <Box m={1}/>
                                <OnClickInfo keyword={"twittersna_heatmap_tip"}/>
                            </div>
                        }
                        {
                            heatMapTweets &&
                            <PostViewTable snatype={sna} setTypeValue={setHeatMapTweets} data={heatMapTweets} downloadEnable={false} />
                        }
                    </Box>
                }
                {
                    props.result.heatMap === undefined &&
                    (//<Typography variant='body2'>The heatmap is still loading please wait (ADD TSV)</Typography>

                        <CircularProgress className={classes.circularProgress} />)
                }
            </AccordionDetails>
        </Accordion>
    )

}