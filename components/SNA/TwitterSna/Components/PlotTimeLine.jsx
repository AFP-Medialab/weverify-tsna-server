import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import plotly from "plotly.js-dist";
import React, { useEffect, useState } from "react";
import createPlotComponent from "react-plotly.js/factory";
import { useDispatch, useSelector } from "react-redux";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { displayPosts } from "../../../SNA/lib/displayTweets";
import { filterForTimeLine } from "../../Hooks/timeline";
import HistoTweetsTable from "../Components/HistoTweetsTable";
import { setTweetsDetail } from "../TwitterSna";

const Plot = createPlotComponent(plotly);
let from = "PLOT_LINE";

export default function PlotTimeLine(props) {
  const dispatch = useDispatch();
  //HISTOGRAM
  const histoTweets = useSelector((state) => state.twitterSna.histoview);
  const sna = useSelector(state => state.sna)
  const keyword = useLoadLanguage(sna.tsv);
  const classes = useMyStyles();

  const [state, setState] = useState({
    result: props.result,
  });
  useEffect(() => {
    setState({
      ...state,
      result: props.result,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.result.histogram]);

  const onHistogramClick = (data) => {
    if (state.result.tweets !== undefined) {
      let selectedPoints = data.points;
      let filteredTweets = state.result.tweets.filter(function (tweet) {
        let tweetDate = new Date(tweet._source.datetimestamp * 1000);
        return filterForTimeLine(tweetDate, selectedPoints);
      });
      setTweetsDetail(from, displayPosts(filteredTweets, keyword), dispatch);
    }
  };

  return (
    <Card className={classes.cardsResults}>
      <CustomCardHeader title={"2. " + keyword("user_time_chart_title")} showHelp={true} helpText={"twittersna_timeline_tip"} />
        {
            state.result.histogram &&
            <div style={{ width: "100%" }}>
            {state.result.histogram.json &&
                state.result.histogram.json.length === 0 && (
                <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>
                )}
            {
                state.result.histogram.json &&
                state.result.histogram.json.length !== 0 && (
                <Plot
                    useResizeHandler
                    style={{ width: "100%", height: "450px" }}
                    data={state.result.histogram.json}
                    layout={state.result.histogram.layout}
                    config={state.result.histogram.config}
                    onClick={(e) => onHistogramClick(e)}
                    onPurge={(a, b) => {
                    //console.log(a);
                    //console.log(b);
                    }}
                />
                )}
            <Box m={1} />
            <Box m={2} />
            {histoTweets && <HistoTweetsTable data={histoTweets} from={from} />}
            </div>
        }
        {
            state.result.histogram === undefined &&
            <CircularProgress className={classes.circularProgress} />
        }
    </Card>
  );
}
