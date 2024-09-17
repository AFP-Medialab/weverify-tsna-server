import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import plotly from 'plotly.js-dist';
import React, { useEffect, useState } from 'react';
import createPlotComponent from 'react-plotly.js/factory';
import { useSelector } from "react-redux";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useMyStyles from "../../../shared/styles/useMyStyles";
import PostViewTable from "../../Components/PostViewTable";
import { getDayAsString, onHeatMapClick } from "../Hooks/heatMap";
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";
import { TWITTERSNA_PATH } from "../../../shared/languages/LanguagePaths";


const Plot = createPlotComponent(plotly);

export default function HeatMap (props) { 

    const sna = useSelector(state => state.sna)
    const keyword = i18nLoadNamespace(TWITTERSNA_PATH);
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
        if(heatMapTweets && heatMapTweets.data[0])
        {
            let date = new Date(heatMapTweets.data[0].date);
            dayHourStr = getDayAsString(date.getDay()) + date.getHours() + "h_";
        }
    }, [heatMapTweets])


    return (

        <Card>
            <CustomCardHeader title={"8. " + keyword("heatmap_chart_title")} showHelp={true} helpText={"twittersna_heatmap_tip"} />

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
                                    // layout={props.result.heatMap.layout}
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