import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import CSVReader from "react-csv-reader";
import CrowdTangleSnaResults from "./Results/CrowdTangleSnaResults";
import useMyStyles, {myCardStyles}  from '../styles/useMyStyles';
import FeedBack from "../FeedBack/FeedBack";
import Grid from "@material-ui/core/Grid";
import HeaderTool from '../HeaderTool/HeaderTool';
import TwitterSNAIcon from "../../../images/SVG/DataAnalysis/Twitter_sna.svg"
import Typography from "@material-ui/core/Typography";
import MyErrorbar from "../ErrorBar/ErrorBar";
import { StylesProvider } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {cleanError} from "../../../redux/actions/errorActions"
import {useFacebookResult} from './Components/hooks/buildFBResult'
import {useInstagramResult} from './Components/hooks/buildInstaResult'
import useLoadLanguage from "../hooks/useRemoteLoadLanguage"

import {
    setCSVLoading,
    setCSVResult,
    setCSVHistoview,
    setHeatMapResult,
    setCoHashtagResult,
    setUrlsResult,
    setSocioGraphResult,
    setCloudWordsResult,
    cleanCsvSnaState
  } from "../../../redux/actions/tools/crowdTangleSnaActions";
  

const CrowdTangleSnaComponent = () => {
    const FB_SNA_TSV = "/components/CsvFb.tsv";
    const keywordFB = useLoadLanguage(FB_SNA_TSV);
    const INSTA_SNA_TSV = "/components/CsvInsta.tsv";
    const keywordINSTA = useLoadLanguage(INSTA_SNA_TSV);

    const dispatch = useDispatch();
    const classes = useMyStyles();
    const cardClasses = myCardStyles();
    const error = useSelector(state => state.error);
    const loadingMessage = useSelector(state => state.ctSna.loadingMessage);
    const maxStage = useSelector(state => state.ctSna.maxStage);
    const stage = useSelector(state => state.ctSna.stage)
    const resultRedux = useSelector(state => state.ctSna.result);

    
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

        //facebook else instagram
        if(data[0].facebook_id) {
            
            useFacebookResult(data, keywordFB, dispatch);
        }
        else{
            useInstagramResult(data, keywordINSTA, dispatch);
        }
    };

    const completeCsvParse = (results, file) => {
        dispatch(cleanCsvSnaState());
        console.log("Parsing complete:", results, file);
        dispatch(setCSVResult(results.data));
      }
    const parseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header => header.toLowerCase().replace(/\W/g, "_"),
        complete: completeCsvParse,
        escapeFormulae : true
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
                className={classes.headerUpladedImage}/>
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
                    
                    {maxStage !== stage &&  <> 
                        <Typography>{loadingMessage}</Typography>
                        <CircularProgress className={classes.circularProgress} />
                    </>
                    }
                </div>
            </Card>
        </StylesProvider>
        {
            resultRedux && <CrowdTangleSnaResults result={resultRedux} />
        }
        <FeedBack/>
    </div>);
}

export default CrowdTangleSnaComponent;