import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import plotly from 'plotly.js-dist';
import createPlotComponent from 'react-plotly.js/factory';
import useLoadLanguage from "../../hooks/useLoadLanguage";
import {displayTweets} from "../lib/displayTweets";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import HistoTweetsTable from "../Components/HistoTweetsTable";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../styles/useMyStyles";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {setTweetsDetailPanel} from "../../../../redux/actions/tools/twitterSnaActions";
import {downloadAsPNG, createCSVFromPieChart, downloadAsSVG, onDonutsClick} from "../Hooks/pieCharts"


let from = "PLOT_PIECHART";

export default function PlotPieChart (props) { 

    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const request = useSelector(state => state.twitterSna.request);

    const classes = useMyStyles();

    const [pieCharts0, setPieCharts0] = useState(null);
    const [pieCharts1, setPieCharts1] = useState(null);
    const [pieCharts2, setPieCharts2] = useState(null);
    const [pieCharts3, setPieCharts3] = useState(null);

    const hideTweetsView = (index) => {
        switch (index) {
            case 0:
                setPieCharts0(null);
                break;
            case 1:
                setPieCharts1(null);
                break;
            case 2:
                setPieCharts2(null);
                break;
            case 3:
                setPieCharts3(null);
                break;
            default:
                break;
        }
    };

    const pieCharts = [pieCharts0, pieCharts1, pieCharts2, pieCharts3];

        //Initialize tweets arrays
        useEffect(() => {
            // setHistoTweets(null);
             setPieCharts0(null);
             setPieCharts1(null);
             setPieCharts2(null);
             setPieCharts3(null);
     
         // eslint-disable-next-line react-hooks/exhaustive-deps
         }, [request])



return (
    props.result.pieCharts.map((obj, index) => {
        console.log("notre json : " + obj.json)
        if ((request.userList.length === 0 || index === 3))
            return (
                <Accordion key={index}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel" + index + "a-content"}
                        id={"panel" + index + "a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(obj.title)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                            {
                                (obj.json === null || (obj.json[0].values.length === 1 && obj.json[0].values[0] === "")) &&
                                    <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                            }
                            {
                                obj.json !== null && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                <Grid container justify="space-between" spacing={2}
                                    alignContent={"center"}>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadAsPNG(obj.title)}>
                                            {
                                                keyword('twittersna_result_download_png')
                                            }
                                        </Button>

                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadClick(createCSVFromPieChart(obj), 
                                                                        keyword(obj.title), 
                                                                        false, 
                                                                        "")}>
                                            
                                            CSV
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant={"contained"}
                                            color={"primary"}
                                            onClick={() => downloadAsSVG(obj.title)}>
                                            {
                                                keyword('twittersna_result_download_svg')
                                            }
                                        </Button>
                                    </Grid>
                                </Grid>
                            }
                            {
                                (obj.json !== null) && !(obj.json[0].values.length === 1 && obj.json[0].values[0] === "") &&
                                <div>
                                    <Plot
                                        data={obj.json}
                                        layout={obj.layout}
                                        config={obj.config}
                                        onClick={e => {
                                            onDonutsClick(e, index)
                                        }}
                                        divId={obj.title}
                                    />
                                    <Box m={1} />
                                    <OnClickInfo keyword={obj.tip}/>
                                </div>
                            }
                            {
                                pieCharts[index] && 
                                <HistoTweetsTable 
                                    data={pieCharts[index]} 
                                    from={from} 
                                />
                                /*
                                <div>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"secondary"}
                                                onClick={() => hideTweetsView(index)}>
                                                {
                                                    keyword('twittersna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(pieCharts[index].csvArr, (index === 3) ? "mentioned_" + pieCharts[index].selected : pieCharts[index].selected)}>
                                                {
                                                    keyword('twittersna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable title={keyword("twittersna_result_slected_tweets")}
                                        colums={pieCharts[index].columns}
                                        data={pieCharts[index].data}
                                        actions={goToTweetAction}
                                    />
                                </div>*/
                            }
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )
        else
            return null;
    })
)
}