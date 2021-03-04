import Paper from "@material-ui/core/Paper";
import useMyStyles from "../styles/useMyStyles";
import useLoadLanguage from "../hooks/useLoadLanguage";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import "../../../redux/actions/tools/twitterSnaActions";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Box from "@material-ui/core/Box";
import FormLabel from "@material-ui/core/FormLabel";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import LinearProgress from "@material-ui/core/LinearProgress";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
import { replaceAll, stringToList } from "../lib/StringUtil";
import dateFormat from "dateformat";
import AuthenticationCard from "../AuthenticationCard/AuthenticationCard";
import { setError } from "../../../redux/actions/errorActions";
import {
  cleanTwitterSnaState,
  setTwitterSnaNewRequest,
} from "../../../redux/actions/tools/twitterSnaActions";
import convertToGMT from "../DateTimePicker/convertToGMT";
import MyErrorbar from "../ErrorBar/ErrorBar";
import { cleanError } from "../../../redux/actions/errorActions";
import OnClickInfo from "../OnClickInfo/OnClickInfo";
import OnWarningInfo from "../OnClickInfo/OnWarningInfo";
import FeedBack from "../FeedBack/FeedBack";
import { changeLanguage } from "../../../redux/actions";

/////////////////////
import CSVReader from "react-csv-reader";

import useFacebookSnaRequest from "./FbSna/Hooks/useFacebookSnaRequest";
//import useInstagramSnaRequest from "./InstaSna/Hooks/useInstagramSnaRequest";


const CsvSna = () => {
  const dispatch = useDispatch();
  const classes = useMyStyles();
  const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
  const request = useSelector((state) => state.twitterSna.request);
  const error = useSelector((state) => state.error);

  const isLoading = useSelector((state) => state.twitterSna.loading);
  const loadingMessage = useSelector(
    (state) => state.twitterSna.loadingMessage
  );


  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
  );

  const searchFormDisabled = isLoading || !userAuthenticated;

/////////////////////////////////////////////////

const reduxResultFacebook = useSelector((state) => state.facebookSna.result);
//const reduxResultInstagram = useSelector((state) => state.instagramSna.result);


////////////////////////////////////////////////////////////////////////


  const makeResultCsv = (data) => {

    console.log("DATA" + JSON.stringify(data));
    //facebook else instagram
    if(data[0].facebook_id) {
      useFacebookSnaRequest(data, keyword);
    }/*
    else{
      useInstagramResult(data, keyword);
    }*/
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
        reduxResultFacebook &&
        <FacebookSnaResult result={reduxResultFacebook} request={data} />
        }
    <FeedBack/>
  </div>
);
};
export default CsvSna;
