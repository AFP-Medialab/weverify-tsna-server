import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useRef, useState } from "react";
import CSVReader from "react-csv-reader";
import { useDispatch, useSelector } from "react-redux";
import CSVIcon from "../../../images/SVG/DataAnalysis/CSV_SNA_big.svg";
import { cleanError } from "../../../redux/actions/errorActions";
import {
    cleanCsvSnaState, 
    setCloudWordsResult, 
    setCoHashtagResult, 
    setCSVHistoview, 
    setCSVLoading,
    setCSVResult,
    setHeatMapResult,
    setSocioGraphResult, 
    setUrlsResult} 
    from "../../../redux/actions/tools/crowdTangleSnaActions";
import AdvancedTools from "../../Navigation/AdvancedTools/AdvancedTools";
import MyErrorbar from "../../shared/ErrorBar/ErrorBar";
import FeedBack from "../../shared/FeedBack/FeedBack";
import HeaderTool from '../../shared/HeaderTool/HeaderTool';
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles, { myCardStyles } from '../../shared/styles/useMyStyles';
import { CT_TSV } from "../lib/CrowdTangleConstant";
import { useFacebookResult } from './Components/hooks/buildFBResult';
import { useInstagramResult } from './Components/hooks/buildInstaResult';
import CrowdTangleSnaResults from "./Results/CrowdTangleSnaResults";


const CrowdTangleSnaComponent = () => {

    const theme = createTheme({
        overrides: {
            MuiCardHeader: {
                root: {
                    backgroundColor: "#00926c",
                    paddingTop: "11px!important",
                    paddingBottom: "11px!important",
                },
                title: {
                    color: 'white',
                    fontSize: "20px!important",
                    fontweight: 500,
                }
            },
            MuiTab: {
                wrapper: {
                    fontSize: 12,
                },
                root: {
                    minWidth: "25%!important",
                }
            },
            MuiAccordion: {
                root: {
                    boxShadow: "none",
                    '&:before': {
                        width: "0px",
                    },
                    border: "1px solid #00926c",
                },
                rounded: {
                    borderRadius: "15px",
                }
            },
            MuiIconButton: {
                root: {
                    padding: "0px"
                }
            }
        },
        palette: {
            primary: {
                light: '#00926c',
                main: '#00926c',
                dark: '#00926c',
                contrastText: '#fff',
            },
        },
    });

    const keyword = useLoadLanguage(CT_TSV)
    const dispatch = useDispatch();
    const classes = useMyStyles();
    const cardClasses = myCardStyles();
    const error = useSelector(state => state.error);
    const loadingMessage = useSelector(state => state.ctSna.loadingMessage);
    const maxStage = useSelector(state => state.ctSna.maxStage);
    const stage = useSelector(state => state.ctSna.stage)
    const resultRedux = useSelector(state => state.ctSna.result);
    //const [workers, setWorkers] = useState({})
    const workers = useRef()
    
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
        //Create Workers 
        let timelineWorker = new Worker(new URL('./Components/hooks/timelineCT.js', import.meta.url));
        let pieChartsWorker = new Worker(new URL('./Components/hooks/pieCharts.js', import.meta.url));
        let socioWorker = new Worker(new URL('./Components/hooks/socioSemGraph.js', import.meta.url));
        let cloudWorker = new Worker(new URL('./Components/hooks/cloudChart.js', import.meta.url));
        let hashtagWorker = new Worker(new URL('./Components/hooks/hashtagGraph.js', import.meta.url));
        //console.log("create workers ...")
        workers.current = {
            timelineWorker: timelineWorker,
            pieChartsWorker: pieChartsWorker,
            socioWorker: socioWorker,
            cloudWorker: cloudWorker,
            hashtagWorker: hashtagWorker
        }
        
        //facebook else instagram
        if(data[0].facebook_id) {          
            useFacebookResult(workers.current, data, keyword, dispatch);
        }
        else{
            useInstagramResult(workers.current, data, keyword, dispatch);
        }
    };

    const completeCsvParse = (results, file) => {
        dispatch(cleanCsvSnaState());
        //console.log("Parsing complete:", results, file);
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
        <ThemeProvider theme={theme}>

            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center">

                <Grid item xs>
                        <HeaderTool name={keyword("navbar_ct_sna")} description={keyword("navbar_ct_sna_description")} icon={<CSVIcon style={{ fill: "#00926c" }} />} />
                </Grid>
                <Grid item>
                    <AdvancedTools />
                </Grid>
            </Grid>

        {/* <StylesProvider injectFirst> */}
            <Card className={cardClasses.root}>
                <CardHeader
                title={keyword("cardheader_ct_parameters")}
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
        {/* </StylesProvider> */}
        {
            resultRedux && <CrowdTangleSnaResults result={resultRedux} workers={workers}/>
        }
        <FeedBack/>

        </ThemeProvider>
    </div>);
}

export default CrowdTangleSnaComponent;