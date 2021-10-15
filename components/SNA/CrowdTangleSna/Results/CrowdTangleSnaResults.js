import { Paper } from "@material-ui/core";
import CloseResult from "../../../shared/CloseResult/CloseResult";
import useMyStyles from "../../../shared/styles/useMyStyles";
import Count from "../Components/Count";
import { useDispatch, useSelector } from "react-redux";
import { cleanCsvSnaState } from "../../../../redux/actions/tools/crowdTangleSnaActions";
import dynamic from "next/dynamic";
const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {
  ssr: false,
});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {
  ssr: false,
});
const HeatMap = dynamic(import("../Components/HeatMap"), {ssr: false});
const BubbleChart = dynamic(import("../Components/BubbleChartCSV"), {ssr: false});
const HashtagGraph = dynamic(import("../Components/HashtagGraph"), {ssr: false});
import UrlList from "../../Components/UrlList"
import Box from "@material-ui/core/Box";
const SocioSemGraph = dynamic(import("../Components/SocioSemGraph"), {ssr: false});
const CloudChart = dynamic(import("../Components/CloudChart"), {ssr: false});


export default function CrowdTangleSnaResults(props) {
  const sna = useSelector((state) => state.sna);
  const classes = useMyStyles();
  const dispatch = useDispatch();
  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
      {props.result.countSna && 
        <Count result={props.result}
      />}

      {props.result.histogram && (
        <PlotTimeLine
          result={props.result}
        />
      )}

        {props.result && props.result.pieCharts && (
        <PlotPieChart
          result={props.result}
        />
      )}
      
      {           
         props.result && props.result.bubbleChart &&
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
           <SocioSemGraph result={props.result}/>
                }               
      
          {
            
            props.result.cloudChart && 
            <CloudChart result={props.result}/>

          }
          <Box m={3} />
          { 
            props.result.urls && 
            <UrlList result={props.result} title_message={'ct_sna_result_url_in_posts'} 
              tooltip_message={'twittersna_result_submit_twitter_sna'} downloadable={false}/>
          }        
                
    </Paper>
  );
}
