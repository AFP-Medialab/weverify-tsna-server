import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CircularProgress from "@material-ui/core/CircularProgress";
import CSVReader from "react-csv-reader";
import CrowdTangleSnaResults from "./Results/CrowdTangleSnaResults";
import useMyStyles, {myCardStyles}  from '../../shared/styles/useMyStyles';
import FeedBack from "../../shared/FeedBack/FeedBack";
import Grid from "@material-ui/core/Grid";
import HeaderTool from '../../shared/HeaderTool/HeaderTool';
import TwitterSNAIcon from "../../../images/SVG/DataAnalysis/Twitter_sna.svg"
import CSVIcon from "../../../images/SVG/DataAnalysis/CSV_SNA_big.svg"
import Typography from "@material-ui/core/Typography";
import MyErrorbar from "../../shared/ErrorBar/ErrorBar";
import { StylesProvider } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import {cleanError} from "../../../redux/actions/errorActions"
import {useFacebookResult} from './Components/hooks/buildFBResult'
import {useInstagramResult} from './Components/hooks/buildInstaResult'
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage"
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import AdvancedTools from "../../Navigation/AdvancedTools/AdvancedTools";

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
import { CT_TSV } from "../lib/CrowdTangleConstant";  

const CrowdTangleSnaComponent = () => {

    const theme = createTheme({

        overrides: {

            MuiCardHeader: {
                root: {
                    backgroundColor: "#05A9B4",
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
                    border: "1px solid #51A5B2",

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
                light: '#5cdbe6',
                main: '#05a9b4',
                dark: '#007984',
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
            
            useFacebookResult(data, keyword, dispatch);
        }
        else{
            useInstagramResult(data, keyword, dispatch);
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
        <ThemeProvider theme={theme}>

            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center">

                <Grid item xs>
                        <HeaderTool name={keyword("navbar_ct_sna")} description={keyword("navbar_ct_sna_description")} icon={<CSVIcon style={{ fill: "#51A5B2" }} />} />
                </Grid>
                <Grid item>
                    <AdvancedTools />
                </Grid>
            </Grid>

        <StylesProvider injectFirst>
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
        </StylesProvider>
        {
            resultRedux && <CrowdTangleSnaResults result={resultRedux} />
        }
        <FeedBack/>

        </ThemeProvider>
    </div>);
}

export default CrowdTangleSnaComponent;