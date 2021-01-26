import Paper from "@material-ui/core/Paper";
import useMyStyles from '../styles/useMyStyles';
import useLoadLanguage from "../hooks/useLoadLanguage";
import { useEffect, useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import "../../../redux/actions/tools/twitterSnaActions"
import { useDispatch, useSelector, useStore } from "react-redux";
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
import SearchIcon from '@material-ui/icons/Search';
import Typography from "@material-ui/core/Typography";
import useTwitterSnaRequest from "./Hooks/useTwitterSnaRequest";
import TwitterSnaResult from "./Results/TwitterSnaResult"
import _ from "lodash";
import { replaceAll, stringToList } from "../lib/StringUtil";
import dateFormat from "dateformat";
import AuthenticationCard from "../AuthenticationCard/AuthenticationCard";
import { setError } from "../../../redux/actions/errorActions";
import { setTSNAReset, cleanTwitterSnaState, setTwitterSnaNewRequest} from "../../../redux/actions/tools/twitterSnaActions";
import convertToGMT from "../DateTimePicker/convertToGMT";
import MyErrorbar from "../ErrorBar/ErrorBar";
import {cleanError} from "../../../redux/actions/errorActions"
import OnClickInfo from '../OnClickInfo/OnClickInfo';
import OnWarningInfo from "../OnClickInfo/OnWarningInfo";
import FeedBack from "../FeedBack/FeedBack";
import {changeLanguage} from "../../../redux/actions"
import CSVReader from "react-csv-reader";

/////////////////////////////////////////////////////////////////////////////
import {
  setCountResultFb,
  setCountResultInsta,
  setHistogramResultFb,
  setPieChartsResultFb,
  setHistogramResultInsta,
  setPieChartsResultInsta
} from "../../../redux/actions/tools/twitterSnaActions"

import {
  createTimeLineChart,
} from "./Hooks/timeline";

import {createPieCharts} from "./Hooks/pieCharts"

import {instagramResult} from "./Hooks/useInstaCsvRequest"


const TwitterSna = () => {

  const dispatch = useDispatch();
  const classes = useMyStyles();
  const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
  const request = useSelector(state => state.twitterSna.request);
  const error = useSelector(state => state.error);

  const isLoading = useSelector(state => state.twitterSna.loading);
  const loadingMessage = useSelector(state => state.twitterSna.loadingMessage);
  const reduxResult = useSelector(state => state.twitterSna.result);

  const lang = useSelector(state => state.language);

  const userAuthenticated = useSelector(state => state.userSession && state.userSession.userAuthenticated);

  const [sinceError, setSinceError] = useState(false);
  const [untilError, setUntilError] = useState(false);
 // const [localTime, setLocalTime] = useState("true");
  const [openLangInput, setLangInputOpen] = useState(false);
  const [keyWordsError, setKeyWordsError] = useState(false);
  
  const role = useSelector(state => state.userSession.user.roles);
    const searchFormDisabled = isLoading || !userAuthenticated ;

  const resultStore = useSelector(state => state.twitterSna.result);

    //HANDLE SUBMISSION

  const onSubmit = () => {
    
    //Mandatory Fields errors
    if (keyWords.trim() === "") {
      handleErrors(keyword("twitterStatsErrorMessage"));
      setKeyWordsError(true);
      return;
    }
    if (since === null || since === "") {
      handleErrors(keyword("twitterStatsErrorMessage"));
      setSince("");
      return;
    }
    if (until === null || until === "") {
      handleErrors(keyword("twitterStatsErrorMessage"));
      setUntil("");
      return;
    }

    //console.log("Submit, newRequest: ", newRequest);
    if (JSON.stringify(newRequest) !== JSON.stringify(request)) {

      let prevResult = reduxResult;
      if (prevResult && prevResult.coHashtagGraph) {
        delete prevResult.coHashtagGraph;
      }
      if (prevResult && prevResult.socioSemanticGraph) {
        delete prevResult.socioSemanticGraph;
      }
      if (prevResult && prevResult.socioSemantic4ModeGraph) {
        delete prevResult.socioSemantic4ModeGraph;
      }
      setSubmittedRequest(newRequest);
      dispatch(setTwitterSnaNewRequest(newRequest));
    }
  };




// Reset form & result when user login
  useEffect(() => {
    //console.log("use effect TNSA ... ")
    if (!userAuthenticated) {
      dispatch(cleanTwitterSnaState());
      setSubmittedRequest(null);
      resetForm();
    }

  },[userAuthenticated]); 

      //Set result 
      useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultStore]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////BUILD FB
const useFacebookResult = (data) => {
  buildFirstFbResult(data);
}

const buildFirstFbResult = (data) => {
  buildHistogramFb(data);
  buildCountFb(data);
  buildPieCharts(data);
  //buildUrls(responseAggs);
}

//////////////////////////////////////////////////////COUNT FB
const buildCountFb = async (data) => {
  let tot_interactions = 0;
  let tot_comments = 0;
  let tot_shares = 0;
  let tot_likes = 0;

  for (let index in data) {
    if (typeof data[index].total_interactions === 'string')
    {
      tot_interactions += parseInt(data[index].total_interactions.replace(/,/g, ''));
    }
    else{
      tot_interactions += data[index].total_interactions;
    }
    tot_comments += data[index].comments;
    tot_shares += data[index].shares;
    tot_likes += data[index].likes;
  }
  
  const fbCount = {};
  fbCount.count = data.length;
  fbCount.total_interactions = tot_interactions;
  fbCount.likes = tot_likes;
  fbCount.comments = tot_comments;
  fbCount.shares = tot_shares;
  dispatch(setCountResultFb(fbCount));
};

/////////////////////////////////////////////////////TIMELINE FB


const buildHistogramFb = async (data)=>{
  let getDataResult = getJsonDataForTimeLineChartFb(data)
  const histogram = createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], keyword);
  dispatch(setHistogramResultFb(histogram));
};


const getJsonDataForTimeLineChartFb = (data) => {
  let datas = data;
  var infos = [];

  let min_epoch = 9999999999999999;
  let min_CET = "";
  let max_epoch = 0;
  let max_CET = "";

  const usersGet = (dateObj, infos, tot_inte, date_epoch) => {
      infos.push({
        date: date_epoch,
        key: dateObj.page_name,
        nb: tot_inte,
    });

    return infos;
  }
  var getEpochMillis = function(dateStr) {
    
    var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CET\s*$/
      , m = (""+dateStr).match(r);
    return (m) ? Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]) : undefined;
  };

  datas.forEach(dateObj => {

    let tot_inte = 0;
    if (typeof dateObj.total_interactions === 'string')
    {
      tot_inte = parseInt(dateObj.total_interactions.replace(/,/g, ''));
    }
    else{
      tot_inte = dateObj.total_interactions;
    }

    let date_epoch = getEpochMillis(dateObj.created);

    if (date_epoch < min_epoch)
    {
      min_epoch = date_epoch;
      min_CET = dateObj.created;
    }
    if (date_epoch > max_epoch)
    {
      max_epoch = date_epoch;
      max_CET = dateObj.created;
    }

    usersGet(dateObj, infos, tot_inte, date_epoch); // pour chaque user, on recupe l'obj avec nom tot_interact date
    infos.push({
      date: date_epoch,
      key: "Tweets",                    //nb de tweets
      nb: tot_inte,         //au format epoch
    });
    infos.push({
      date: date_epoch,
      key: "Retweets",                   //nb de retweets
      nb: tot_inte,
    });
  });

  var lines = [];
  infos.sort((a, b) => (a.date > b.date) ? 1 : -1);

  while (infos.length !== 0) {

    let info = infos.pop();
    let date = info.date;
    let nb = info.nb;
    var type = "markers";
    if (info.key === "Tweets" || info.key === "Retweets")
      type = 'lines';
    let plotlyInfo = {
      mode: type,
      name: info.key,
      x: [],
      y: []
    }

    for (let i = 0; i < infos.length; ++i) {
      if (infos[i].key === info.key) {
        plotlyInfo.x.push(infos[i].date);
        plotlyInfo.y.push(infos[i].nb);
        infos.splice(i, 1);
        i--;
      }
    }
    plotlyInfo.x.push(date);
    plotlyInfo.y.push(nb);
    lines.push(plotlyInfo);
  }
  return [lines, min_CET, max_CET];
};

/////////////////////////////////////////////////////////////////BUILD PIE CHART

const buildPieCharts = async (responseAggs) => {
  const pieCharts = createPieCharts(request, getJsonDataForPieCharts(responseAggs), keyword);
  dispatch(setPieChartsResultFb(pieCharts));
};

const getJsonDataForPieCharts = (esResponse, paramKeywordList) => {

  let newmap = [];

  for (let i = 0; i < esResponse.length; i++)
  {
    let flag = 0;

    for (let y = 0; y < newmap.length; y++)
    {
      if (newmap[y].labels == esResponse[i].page_name){
        newmap[y].shares += esResponse[i].shares;
        newmap[y].likes += esResponse[i].likes;
        newmap[y].comments += esResponse[i].comments;
        newmap[y].message += 1;
        flag = 1;
      }
    }

    if (flag == 0) {
      newmap.push({
        labels: esResponse[i].page_name,
        shares : esResponse[i].shares,
        likes : esResponse[i].likes,
        comments : esResponse[i].comments,
        message : 1,
    });
    }
  }

  let result = [];
  for (let i = 0; i < 4; i++) {
    result.push([{
      type: "sunburst",
      labels : ["csv"],
      parents: [""],
      values: [""],
      textinfo: "label+value",
      outsidetextfont: {
        size: 20,
        color: "#377eb8"
      },
    }]);
  }

  //most shares
  newmap.sort((a, b) => (a.shares < b.shares) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[0][0].labels.push(newmap[i].labels);
    result[0][0].values.push(newmap[i].shares);
    result[0][0].parents.push("csv");
  }

  //most likes
  newmap.sort((a, b) => (a.likes < b.likes) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[1][0].labels.push(newmap[i].labels);
    result[1][0].values.push(newmap[i].likes);
    result[1][0].parents.push("csv");
  }

  //comments
  newmap.sort((a, b) => (a.comments < b.comments) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[2][0].labels.push(newmap[i].labels);
    result[2][0].values.push(newmap[i].comments);
    result[2][0].parents.push("csv");
  }

  //message
  newmap.sort((a, b) => (a.message < b.message) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[3][0].labels.push(newmap[i].labels);
    result[3][0].values.push(newmap[i].message);
    result[3][0].parents.push("csv");
  }

  return result;
};

//////////////////////////////////////////////////////////////////////////////////BUILD INSTA

const useInstagramResult = (data) => {
  buildFirstInstaResult(data);
}

const buildFirstInstaResult = (data) => {
  buildHistogramInsta(data);
  buildCountInsta(data);
  buildPieChartsInsta(data);
  //buildUrls(responseAggs);
}

//////////////////////////////////////////////////////COUNT INSTA

 const buildCountInsta = (data) => {

  let tot_interactions = 0;
  let tot_comments = 0;
  let tot_likes = 0;
  for (let index in data) {
    if (typeof data[index].total_interactions === 'string')
    {
      tot_interactions += parseInt(data[index].total_interactions.replace(/,/g, ''));
    }
    else{
      tot_interactions += data[index].total_interactions;
    }
    tot_comments += data[index].comments;
    tot_likes += data[index].likes;
  }

  const instaCount = {};
  instaCount.count = data.length;
  instaCount.total_interactions = tot_interactions;
  instaCount.likes = tot_likes;
  instaCount.comments = tot_comments;
  dispatch(setCountResultInsta(instaCount));
}

/////////////////////////////////////////////////////TIMELINE Insta


const buildHistogramInsta = async (data)=>{
  let getDataResult = getJsonDataForTimeLineChartInsta(data)
  const histogram = createTimeLineChart(getDataResult[1], getDataResult[2], getDataResult[0], keyword);
  dispatch(setHistogramResultInsta(histogram));
};


const getJsonDataForTimeLineChartInsta = (data) => {
  let datas = data;
  var infos = [];

  let min_epoch = 9999999999999999;
  let min_CET = "";
  let max_epoch = 0;
  let max_CET = "";

  const usersGet = (dateObj, infos, tot_inte, date_epoch) => {
      infos.push({
        date: date_epoch,
        key: dateObj.account,
        nb: tot_inte,
    });

    return infos;
  }
  var getEpochMillis = function(dateStr) {
    
    var r = /^\s*(\d{4})-(\d\d)-(\d\d)\s+(\d\d):(\d\d):(\d\d)\s+CET\s*$/
      , m = (""+dateStr).match(r);
    return (m) ? Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]) : undefined;
  };

  datas.forEach(dateObj => {

    let tot_inte = 0;
    if (typeof dateObj.total_interactions === 'string')
    {
      tot_inte = parseInt(dateObj.total_interactions.replace(/,/g, ''));
    }
    else{
      tot_inte = dateObj.total_interactions;
    }

    let date_epoch = getEpochMillis(dateObj.created);

    if (date_epoch < min_epoch)
    {
      min_epoch = date_epoch;
      min_CET = dateObj.created;
    }
    if (date_epoch > max_epoch)
    {
      max_epoch = date_epoch;
      max_CET = dateObj.created;
    }

    usersGet(dateObj, infos, tot_inte, date_epoch); // pour chaque user, on recupe l'obj avec nom tot_interact date
    infos.push({
      date: date_epoch,
      key: "Tweets",                    //nb de tweets
      nb: tot_inte,         //au format epoch
    });
    infos.push({
      date: date_epoch,
      key: "Retweets",                   //nb de retweets
      nb: tot_inte,
    });
  });

  var lines = [];
  infos.sort((a, b) => (a.date > b.date) ? 1 : -1);

  while (infos.length !== 0) {

    let info = infos.pop();
    let date = info.date;
    let nb = info.nb;
    var type = "markers";
    if (info.key === "Tweets" || info.key === "Retweets")
      type = 'lines';
    let plotlyInfo = {
      mode: type,
      name: info.key,
      x: [],
      y: []
    }

    for (let i = 0; i < infos.length; ++i) {
      if (infos[i].key === info.key) {
        plotlyInfo.x.push(infos[i].date);
        plotlyInfo.y.push(infos[i].nb);
        infos.splice(i, 1);
        i--;
      }
    }
    plotlyInfo.x.push(date);
    plotlyInfo.y.push(nb);
    lines.push(plotlyInfo);
  }
  return [lines, min_CET, max_CET];
};


/////////////////////////////////////////////////////////////////BUILD PIE CHART INSTA

const buildPieChartsInsta = async (responseAggs) => {
  const pieCharts = createPieCharts(request, getJsonDataForPieChartsInsta(responseAggs), keyword);
  dispatch(setPieChartsResultInsta(pieCharts));
};

const getJsonDataForPieChartsInsta = (esResponse, paramKeywordList) => {

  let newmap = [];

  for (let i = 0; i < esResponse.length; i++)
  {
    let flag = 0;

    for (let y = 0; y < newmap.length; y++)
    {
      if (newmap[y].labels == esResponse[i].account){
        newmap[y].shares += esResponse[i].followers_at_posting;
        newmap[y].likes += esResponse[i].likes;
        newmap[y].comments += esResponse[i].comments;
        newmap[y].message += 1;
        flag = 1;
      }
    }

    if (flag == 0) {
      newmap.push({
        labels: esResponse[i].account,
        shares : esResponse[i].followers_at_posting,
        likes : esResponse[i].likes,
        comments : esResponse[i].comments,
        message : 1,
    });
    }
  }

  let result = [];
  for (let i = 0; i < 4; i++) {
    result.push([{
      type: "sunburst",
      labels : ["csv"],
      parents: [""],
      values: [""],
      textinfo: "label+value",
      outsidetextfont: {
        size: 20,
        color: "#377eb8"
      },
    }]);
  }

  //most shares
  newmap.sort((a, b) => (a.shares < b.shares) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[0][0].labels.push(newmap[i].labels);
    result[0][0].values.push(newmap[i].shares);
    result[0][0].parents.push("csv");
  }

  //most likes
  newmap.sort((a, b) => (a.likes < b.likes) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[1][0].labels.push(newmap[i].labels);
    result[1][0].values.push(newmap[i].likes);
    result[1][0].parents.push("csv");
  }

  //comments
  newmap.sort((a, b) => (a.comments < b.comments) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[2][0].labels.push(newmap[i].labels);
    result[2][0].values.push(newmap[i].comments);
    result[2][0].parents.push("csv");
  }

  //message
  newmap.sort((a, b) => (a.message < b.message) ? 1 : -1);

  for (let i = 0; i < 20; i++) {
    result[3][0].labels.push(newmap[i].labels);
    result[3][0].values.push(newmap[i].message);
    result[3][0].parents.push("csv");
  }

  return result;
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

  //handle options for csv
  const makeResultCsv = (data) => {

    console.log("DATA" + JSON.stringify(data));
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
          reduxResult &&
          <TwitterSnaResult result={reduxResult} request={request} />
          }
      <FeedBack/>
    </div>
  );
}
export default TwitterSna;