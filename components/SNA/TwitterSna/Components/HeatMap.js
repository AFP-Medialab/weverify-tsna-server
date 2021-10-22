import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import plotly from 'plotly.js-dist';
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from 'react';
import {useSelector } from "react-redux";
import createPlotComponent from 'react-plotly.js/factory';
import {onHeatMapClick} from "../Hooks/heatMap"

import {getDayAsString} from "../Hooks/heatMap"
import useMyStyles from "../../../shared/styles/useMyStyles";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import PostViewTable from "../../Components/PostViewTable";
import { CardHeader } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";

const Plot = createPlotComponent(plotly);

export default function HeatMap (props) { 

    const sna = useSelector(state => state.sna)
    const keyword = useLoadLanguage(sna.tsv);
    const classes = useMyStyles();

    const [heatMapTweets, setheatMapTweets] = useState(null);

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
        setheatMapTweets(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request])
    var dayHourStr = "";
    useEffect (()=> {
        if(heatMapTweets)
        {
            let date = new Date(heatMapTweets.data[0].date);
            dayHourStr = getDayAsString(date.getDay()) + date.getHours() + "h_";
        }
    }, [heatMapTweets])


    return (

        <Card>
            <CustomCardHeader title={keyword("heatmap_chart_title")} showHelp={true} helpText={"twittersna_heatmap_tip"} />

                {
                    props.result && props.result.heatMap &&
                    <Box alignItems="center" justifyContent="center" width={"100%"} className={classes.cardsResults}>
                        {
                            ((props.result.heatMap.isAllnul) &&
                                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>) ||
                            <div>
                                <Plot
                                    style={{ width: '100%', height: "450px" }}
                                    data={props.result.heatMap.plot}
                                    config={props.result.heatMap.config}
                                    layout={props.result.heatMap.layout}
                                    onClick={(e) => onHeatMapClick(e, props.result, setheatMapTweets, keyword)}
                                />
                                <Box m={1}/>
                            </div>
                        }
                        {
                            heatMapTweets &&                   
                                <PostViewTable 
                                    snatype={sna} 
                                    setTypeValue={setheatMapTweets} 
                                    data={heatMapTweets} 
                                    downloadEnable={true} 
                                    request={props.request}
                                    csvArr={heatMapTweets.csvArr} 
                                    selected={dayHourStr}/>
                        }
                    </Box>
                }
                {
                    props.result.heatMap === undefined &&
                    (//<Typography variant='body2'>The heatmap is still loading please wait (ADD TSV)</Typography>

                        <CircularProgress className={classes.circularProgress} />)
                }
        </Card>
    )

}