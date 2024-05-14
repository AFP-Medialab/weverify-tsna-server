import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import plotly from 'plotly.js-dist';
import React, { useEffect, useState } from 'react';
import createPlotComponent from 'react-plotly.js/factory';
import { useSelector } from "react-redux";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfo';
import useMyStyles from "../../../shared/styles/useMyStyles";
import PostViewTable from "../../Components/PostViewTable";
import { onHeatMapClick } from "./hooks/heatMap";

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
    //console.log("heat ", heatMapTweets)

    return (
        <Card>
            <CustomCardHeader title={keyword("ct_heatmap_chart_title")} showHelp={true} helpText={"twittersna_heatmap_tip"} />
        
                {
                    props.result && props.result.heatMap &&
                    <Box alignItems="center" justifyContent="center" width={"100%"} className={classes.cardsResults}>
                        {
                            ((props.result.heatMap.isAllnul) &&
                                <Typography variant={"body2"}>{keyword("ct_sna_no_data")}</Typography>) ||
                            <div>
                                <Plot
                                    style={{ width: '100%', height: "450px" }}
                                    data={props.result.heatMap.plot}
                                    config={props.result.heatMap.config}
                                    // layout={props.result.heatMap.layout}
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
        </Card>
    )

}