import { Paper } from "@material-ui/core";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";
import { useDispatch, useSelector } from "react-redux";
import { cleanCsvSnaState } from "../../../../redux/actions/tools/csvSnaActions";
import dynamic from "next/dynamic";
import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
import CsvSna from "../CsvSna";
const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {
  ssr: false,
});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {
  ssr: false,
});
const HeatMap = dynamic(import("../Components/HeatMap"), {ssr: false});
const BubbleChart = dynamic(import("../Components/BubbleChartCSV"), {ssr: false});
const HashtagGraph = dynamic(import("../Components/HashtagGraph"), {ssr: false});
import UrlList from "../Components/UrlList";
import Box from "@material-ui/core/Box";
const SocioSemGraph = dynamic(import("../Components/SocioSemGraph"), {ssr: false});




export default function CsvSnaResults(props) {
  const classes = useMyStyles();
  const dispatch = useDispatch();
  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
      {props.result.countSna && 
        < Count result={props.result} 

      //onClickInfoLabel={"fb_sna_tweetnb_tip"} 
      />}

      {props.result.histogram && (
        <PlotTimeLine
          result={props.result}
         // onClickInfoLabel={"fb_sna_tweetnb_tip"}
        />
      )}

        {props.result && props.result.pieCharts && (
        <PlotPieChart
          result={props.result}
         // onClickInfoLabel={"fb_sna_tweetnb_tip"}
        />
      )}
      {           
         props.result && props.result.tweetCount &&
         <BubbleChart result={props.result}/>
                }
      {
         props.result.heatMap &&           
         <HeatMap result={props.result}/>
        }  
        {
          props.result.coHashtagGraph &&
          <HashtagGraph result={props.result}/>
                } 
         {
           props.result.socioSemantic4ModeGraph &&
           <SocioSemGraph result={result}/>
                }               

          <Box m={3} />
                {
                    props.result.urls && 
                    <UrlList result={props.result}/>
                }             
        
    </Paper>
  );
}
