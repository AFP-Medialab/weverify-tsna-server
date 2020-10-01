import { useDispatch, useSelector } from "react-redux";
import CloseResult from "../../CloseResult/CloseResult"
import { cleanTwitterSnaState } from "../../../../redux/actions/tools/twitterSnaActions";

export default function TwitterSnaResult(props) {


    const dispatch = useDispatch();

    return (
        <Paper className={classes.root}>
            <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
            {
                result.histogram &&
                <Accordion expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading}>{keyword(result.histogram.title)}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {}
                        <div style={{ width: '100%', }}>
                            {(result.histogram.json && (result.histogram.json.length === 0) &&
                                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>)}
                            {(result.histogram.json && result.histogram.json.length !== 0) &&
                                <Plot useResizeHandler
                                    style={{ width: '100%', height: "450px" }}
                                    data={result.histogram.json}
                                    layout={result.histogram.layout}
                                    config={result.histogram.config}
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
                                <div>
                                    <Grid container justify="space-between" spacing={2}
                                        alignContent={"center"}>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"secondary"}
                                                onClick={() => setHistoTweets(null)}
                                            >
                                                {
                                                    keyword('twittersna_result_hide')
                                                }
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant={"contained"}
                                                color={"primary"}
                                                onClick={() => downloadClick(histoTweets.csvArr, histoTweets.data[0].date.split(' ')[0], true)}>
                                                {
                                                    keyword('twittersna_result_download')
                                                }
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Box m={2} />
                                    <CustomTable
                                        title={keyword("twittersna_result_slected_tweets")}
                                        colums={histoTweets.columns}
                                        data={histoTweets.data}
                                        actions={goToTweetAction}
                                    />
                                </div>
                            }
                        </div>
                    </AccordionDetails>
                </Accordion>
            }
        </Paper>
    );
};