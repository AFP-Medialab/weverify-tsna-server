import Paper from "@material-ui/core/Paper";
import useMyStyles from '../styles/useMyStyles';
import useLoadLanguage from "../hooks/useLoadLanguage";
import { useEffect, useState, useRef } from "react";
import "../../../redux/actions/tools/twitterSnaActions"
import { useDispatch, useSelector, useStore } from "react-redux";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import MyErrorbar from "../ErrorBar/ErrorBar";
import {cleanError} from "../../../redux/actions/errorActions"
import FeedBack from "../FeedBack/FeedBack";
import CSVReader from "react-csv-reader";
import FBSnaResults from "../CsvSna/Results/FBSnaResults";
import InstaSnaResults from "../CsvSna/Results/InstaSnaResults";
import {countInsta} from "./Insta/hooks/instaCount";
import {countFB} from "./Insta/hooks/FBcount";
/////////////////////////////////////////////////////////////////////////////

import {
  setCountResult,
  setSnaType,
} from "../../../redux/actions/tools/csvSnaActions";

const FB_TYPE = "FB";
const INSTA_TYPE = "INSTA"

const CsvSna = () => {

  const dispatch = useDispatch();
  const classes = useMyStyles();
  const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
  const error = useSelector(state => state.error);
  const loadingMessage = useSelector(state => state.csvSna.loadingMessage);
 
  const resultRedux = useSelector(state => state.csvSna.result);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////BUILD FB
const useFacebookResult = (data) => {
  buildFirstFbResult(data);
  dispatch(setSnaType(FB_TYPE));
}

const buildFirstFbResult = (data) => {
  //buildHistogramFb(data);
  buildCountFb(data);
  //buildPieCharts(data);
  //buildUrls(responseAggs);
}

//////////////////////////////////////////////////////COUNT FB
const buildCountFb = async (data) => {
    
  const countFb= countFB(data)
  dispatch(setCountResult(countFb));
};

//////////////////////////////////////////////////////////////////////////////////BUILD INSTA

const useInstagramResult = (data) => {
  buildFirstInstaResult(data);
  dispatch(setSnaType(INSTA_TYPE));
}

const buildFirstInstaResult = (data) => {
  //buildHistogramInsta(data);
  buildCountInsta(data);
  //buildPieChartsInsta(data);
  //buildUrls(responseAggs);
}

//////////////////////////////////////////////////////COUNT INSTA

 const buildCountInsta = (data) => {

  const instaCount = countInsta(data)
  dispatch(setCountResult(instaCount));
}

/////////////////////////////////////////////////////TIMELINE Insta


  //handle options for csv
  const makeResultCsv = (data) => {

    //console.log("DATA" + JSON.stringify(data));
    //sort by date

    //
    //facebook else instagram
    if(data[0].facebook_id) {
      useFacebookResult(data);
    }
    else{
      useInstagramResult(data);
    }
  }
  

const parseOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: header => header.toLowerCase().replace(/\W/g, "_")
};


  return (
      <div className={classes.all}>
          <Paper className={classes.root} style={{marginTop: "0px", marginBottom: "0px", paddingTop: "0px"}}>

                <div className="container">
                  <CSVReader
                    cssClass="react-csv-input"
                    label="Select CSV : "
                    onFileLoaded={makeResultCsv}
                    parserOptions={parseOptions}
                  />
                </div>

                <Box m={2} />

                {
                  (error !== null) &&
                  <MyErrorbar variant="error" message={error} onClick={() => dispatch(cleanError())}/>
                }

                <Box m={2} />
                <Typography>{loadingMessage}</Typography>

          </Paper>
          {
          resultRedux && resultRedux.snaType === FB_TYPE && <FBSnaResults result={resultRedux} keyword={keyword}/>
          }
          {
            resultRedux && resultRedux.snaType === INSTA_TYPE && <InstaSnaResults result={resultRedux} keyword={keyword}/>
          }
      <FeedBack/>
    </div>
  );
}
export default CsvSna;