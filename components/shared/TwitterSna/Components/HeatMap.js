import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import plotly from 'plotly.js-dist';
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CustomTable from "../../CustomTable/CustomTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import createPlotComponent from 'react-plotly.js/factory';
import {onHeatMapClick} from "../Hooks/heatMap"
import TwitterIcon from '@material-ui/icons/Twitter';
import {downloadClick} from "../lib/downloadClick";

import {getDayAsString} from "../Hooks/heatMap"

import useMyStyles from "../../styles/useMyStyles";
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";

const Plot = createPlotComponent(plotly);
let from = "PLOT_HEAT_MAP";
//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

export default function HeatMap (props) { 
    const dispatch = useDispatch();

    const keyword = useLoadLanguage(tsv);
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


    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography className={classes.heading}>{keyword("heatmap_chart_title")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {
                    props.result && props.result.heatMap &&
                    <Box alignItems="center" justifyContent="center" width={"100%"}>
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
                                <OnClickInfo keyword={"twittersna_heatmap_tip"}/>
                            </div>
                        }
                        {
                            heatMapTweets &&
                            <div>
                                <Grid container justify="space-between" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"secondary"}
                                            onClick={() => setheatMapTweets(null)}>
                                            {
                                                keyword('twittersna_result_hide')
                                            }
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => {
                                                let date = new Date(heatMapTweets.data[0].date);
                                                let dayHourStr = getDayAsString(date.getDay()) + date.getHours() + "h_";
                                                downloadClick(props.request, heatMapTweets.csvArr, dayHourStr, false);
                                            }}>
                                            {
                                                keyword('twittersna_result_download')
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Box m={2} />
                                <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                    colums={heatMapTweets.columns}
                                    data={heatMapTweets.data}
                                    actions={goToTweetAction}
                                />
                            </div>
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