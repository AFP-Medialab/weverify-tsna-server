import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import CSVReader from "react-csv-reader";
import CsvSnaResults from "./Results/CsvSnaResults";
import useMyStyles, {myCardStyles}  from '../styles/useMyStyles';
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import FeedBack from "../FeedBack/FeedBack";
import Grid from "@material-ui/core/Grid";
import HeaderTool from '../HeaderTool/HeaderTool';
import TwitterSNAIcon from "../../../images/SVG/DataAnalysis/Twitter_sna.svg"
import Typography from "@material-ui/core/Typography";
import MyErrorbar from "../ErrorBar/ErrorBar";
import { StylesProvider } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {cleanError} from "../../../redux/actions/errorActions"
import {countInsta} from "./Components/Insta/hooks/instaCount";
import {countFB} from "./Components/FB/hooks/FBcount";
import timelineWorker from "workerize-loader?inline!./Components/Common/hooks/timeline";
import pieChartsWorker from "workerize-loader?inline!./Components/Common/hooks/pieCharts";
import { createHeatMap } from "./Components/Common/hooks/heatMap";
import hashtagWorker from "workerize-loader?inline!./Components/Common/hooks/hashtagGraph";
import { getJsonDataForURLTable } from "./Components/Common/hooks/urlList";
import socioWorker from "workerize-loader?inline!./Components/Common/hooks/socioSemGraph";
import cloudWorker from "workerize-loader?inline!./Components/Common/hooks/cloudChart";

import {
    setCountResult,
    setSnaType,
    setHistogramResult,
    setPieChartsResult,
    setCSVLoading,
    setCSVResult,
    setCSVHistoview,
    setHeatMapResult,
    setCoHashtagResult,
    setUrlsResult,
    setSocioGraphResult,
    setCloudWordsResult,
  } from "../../../redux/actions/tools/csvSnaActions";
  
 
const FB_SNA_TYPE= {snaType:"FB",tsv:"/components/CsvFb.tsv" }
const INSTA_SNA_TYPE= {snaType:"INSTA",tsv:"/components/CsvInsta.tsv" }

const CsvSnaComponent = () => {
    const dispatch = useDispatch();
    const classes = useMyStyles();
    const cardClasses = myCardStyles();
    const error = useSelector(state => state.error);
    const loadingMessage = useSelector(state => state.csvSna.loadingMessage);
    const isloading = useSelector(state => state.csvSna.loading);
    const resultRedux = useSelector(state => state.csvSna.result);

    const keywordFB = useLoadLanguage(FB_SNA_TYPE.tsv);
    const keywordINSTA = useLoadLanguage(INSTA_SNA_TYPE.tsv);
    
    ///// FB /////
    const useFacebookResult = (data) => {
        dispatch(setSnaType(FB_SNA_TYPE));
        buildFirstFbResult(data);
    }
    const buildFirstFbResult = (data) => {
        buildHistogramFb(data);
        buildCountFb(data);
        buildPieCharts(data);
        buildHeatMapFB(data);
        buildCoHashTag(data);
        buildSocioGraph(data);
        buildUrls(data);
        wordCount(data);
      }

      ///////// FB /////////////
      //////////////////////////////////////////////////////COUNT FB
    const buildCountFb = async (data) => {
        const countFb = countFB(data)
        dispatch(setCountResult(countFb));
    };
    ////////////////////CoHashTagResult common Insta & Facebook

    const buildCoHashTag = async (data) => {
    const instance = hashtagWorker();
    const coHashtagGraph = await instance.createCoHashtagGraph(data);
    dispatch(setCoHashtagResult(coHashtagGraph));
    };

    
    //////////////////////////////////////////////////////HISTOGRAM FB

    const buildHistogramFb = async (data)=>{
        const instance = timelineWorker();
        let getDataResult = await instance.getJsonDataForTimeLineChartFb(data)
        let titleLabel = keywordFB("user_time_chart_title");
        let timeLabel = keywordFB('twitter_local_time');
        const histogram = await instance.createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], titleLabel, timeLabel);
        dispatch(setHistogramResult(histogram));
    };

    ////////////////////////////////////////////////////// PieChart FB
    const buildPieCharts = async (data) => {
        const keywordTitles = [
            keywordFB("retweets_cloud_chart_title"),
            keywordFB("likes_cloud_chart_title"),
            keywordFB("top_users_pie_chart_title"),
            keywordFB("mention_cloud_chart_title")
        ];
        console.log("datat FB ", data);
        const instance = pieChartsWorker();
        const jsonPieChart = await instance.getJsonDataForPieCharts(data);
        const pieCharts = await instance.createPieCharts("",jsonPieChart,keywordTitles);
        dispatch(setPieChartsResult(pieCharts));
    };

//////////////////////////////////////////////////// HeatMap FB

    const buildHeatMapFB = async (data) => {
        const heatMap = createHeatMap(data, keywordFB);
        dispatch(setHeatMapResult(heatMap));
    };
      ///////// INSTA ////////////
    const useInstagramResult = (data) => {
        dispatch(setSnaType(INSTA_SNA_TYPE));
        buildFirstInstaResult(data);
    }
    
    const buildFirstInstaResult = (data) => {
        buildHistogramInsta(data);
        buildCountInsta(data);
        buildPieChartsInsta(data);
        buildHeatMapInsta(data);
        buildCoHashTag(data);
        buildSocioGraph(data);
        buildUrls(data);
        wordCount(data);
    }
      //////////////////////////////////////// HISTOGRAM Insta
    const buildHistogramInsta = async (data)=>{
        const instance = timelineWorker();
        let getDataResult = await instance.getJsonDataForTimeLineChartInsta(data)
        let titleLabel = keywordINSTA("user_time_chart_title");
        let timeLabel = keywordINSTA('twitter_local_time');
        const histogram = await instance.createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], titleLabel, timeLabel);
        dispatch(setHistogramResult(histogram));
    };
    /////////////////////////////////////////////////////COUNT INSTA

    const buildCountInsta = (data) => {

        const instaCount = countInsta(data)
        dispatch(setCountResult(instaCount));
    }
    /////////////////////////////////////////////////////// PieChart Insta
const buildPieChartsInsta = async (data) => {
    const keywordTitles = [
      keywordINSTA("retweets_cloud_chart_title"),
      keywordINSTA("likes_cloud_chart_title"),
      keywordINSTA("top_users_pie_chart_title"),
      keywordINSTA("mention_cloud_chart_title")
    ];
    const instance = pieChartsWorker();
    const jsonPieChart = await instance.getJsonDataForPieChartsInsta(data);
    const pieCharts = await instance.createPieCharts("",jsonPieChart,keywordTitles);
    console.log(pieCharts);
    dispatch(setPieChartsResult(pieCharts));
  };
  
  /////////////////////////////////////////////////////// HeatMap Insta
  const buildHeatMapInsta = async (data) => {
    const heatMap = createHeatMap(data, keywordINSTA);
    dispatch(setHeatMapResult(heatMap));
  };
  
  ///////////////////////////////////////////////// SocioGraph Insta
  const buildSocioGraph = async (data, topUser) => {
    const instance = socioWorker();
    const socioSemantic4ModeGraphJson = await instance.createSocioSemantic4ModeGraph(
      data,
      topUser
    );
    const socioSemantic4ModeGraph = JSON.parse(socioSemantic4ModeGraphJson);
    dispatch(setSocioGraphResult(socioSemantic4ModeGraph));
  };
  ///////////////////////////////////////////////////// Cloud Chart 
  const wordCount = async (data) => {
    const instance = cloudWorker();
    const wordCountResponse = await instance.createWordCloud(data);
    dispatch(setCloudWordsResult(wordCountResponse));
  };
  
  ////////////////////////// UrlList Insta
  
  const buildUrls = async (data) => {
    const urls = getJsonDataForURLTable(
      data,
      keywordINSTA
    );
    dispatch(setUrlsResult(urls));
  };
  
  //// COMMON ////
    const makeResultCsv = (data) => {
        var from =["PLOT_LINE","PLOT_PIE_CHART_0","PLOT_PIE_CHART_1","PLOT_PIE_CHART_2","PLOT_PIE_CHART_3","PLOT_HASHTAG_GRAPH"]
   
        for(var i=0; i<from.length;i++)

        {
        dispatch(setCSVHistoview(from[i], null)) 
        }
        dispatch(setCSVLoading(true, "processing"));
        dispatch(setHeatMapResult(null))
        dispatch(setCoHashtagResult(null))
        dispatch(setUrlsResult(null))
        dispatch(setCloudWordsResult(null))
        dispatch(setSocioGraphResult(null))

    // Plot(null)

        //facebook else instagram
        if(data[0].facebook_id) {
            useFacebookResult(data);
        }
        else{
            useInstagramResult(data);
        }

    };

    const completeCsvParse = (results, file) => {
        console.log("Parsing complete:", results, file);
        dispatch(setCSVResult(results.data));
      }
    const parseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_"),
        complete: completeCsvParse,
      };
      
    return (
    <div className={classes.all}>
        <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center">
            <Grid item xs>
                <HeaderTool name={"navbar_csv_sna"} description={"navbar_csv_sna_description"} icon={<TwitterSNAIcon style={{ fill: "#51A5B2" }} />} />
            </Grid>
            </Grid>
        <StylesProvider injectFirst>
            <Card className={cardClasses.root}>
                <CardHeader
                title={"cardheader_csv_parameters"}
                className={classes.headerUpladedImage}
                />
                 <div className={classes.root2}>
                    <CSVReader
                        cssClass="react-csv-input"
                        label="Select CSV : "
                        onFileLoaded={makeResultCsv}
                        parserOptions={parseOptions}
                        className={classes.headerUpladedImage}
                    />
                    
                    <Box m={2} />
                    {
                    (error !== null) &&
                    <MyErrorbar variant="error" message={error} onClick={() => dispatch(cleanError())}/>
                    }
                    <Box m={2} />
                    <Typography>{loadingMessage}</Typography>
                    {isloading &&   
                    <CircularProgress className={classes.circularProgress} />
                    }
                </div>
            </Card>
        </StylesProvider>
        {
            resultRedux && <CsvSnaResults result={resultRedux} />
        }
        <FeedBack/>
    </div>);
}

export default CsvSnaComponent;