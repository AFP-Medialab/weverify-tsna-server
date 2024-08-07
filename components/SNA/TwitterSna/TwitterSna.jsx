
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Select from "@mui/material/Select";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StylesProvider } from "@mui/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DoneIcon from '@mui/icons-material/Done';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExcludeIcon from '@mui/icons-material/HighlightOff';
import LaptopIcon from '@mui/icons-material/Laptop';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import GlobeIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import TranslateIcon from '@mui/icons-material/Translate';
import dateFormat from "dateformat";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TwitterSNAIcon from '../../../images/SVG/DataAnalysis/Twitter_sna_big.svg';
import { changeLanguage } from "../../../redux/slices/langugagesSlice";
import AdvancedTools from "../../Navigation/AdvancedTools/AdvancedTools";
import CustomCardHeader from "../../shared/CustomCardHeader/CustomCardheader";
import convertToGMT from "../../shared/DateTimePicker/convertToGMT";
import DateTimePicker from "../../shared/DateTimePicker/DateTimePicker";
import MyErrorbar from "../../shared/ErrorBar/ErrorBar";
import FeedBack from "../../shared/FeedBack/FeedBack";
import HeaderTool from "../../shared/HeaderTool/HeaderTool";
import { TW_SNA_TYPE } from "../../shared/hooks/SnaTypes";
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage";
import { replaceAll, stringToList } from "../../shared/lib/StringUtil";
import OnWarningInfo from "../../shared/OnClickInfo/OnWarningInfo";
import useMyStyles, { myCardStyles } from "../../shared/styles/useMyStyles";
import useTwitterSnaRequest from "./Hooks/useTwitterSnaRequest";
import TwitterSnaResult from "./Results/TwitterSnaResult";
import { errorCleaned, errorSet } from '../../../redux/slices/errorSlice';
import { tweetsDetailBubbleChartResultSet, tweetsDetailHistogramResultSet, tweetsDetailPieChartResultSet, twitterSnaCleanedState, twitterSnaLoadingSet, twitterSnaNewRequestSet } from '../../../redux/slices/tools/twitterSnaSlice';
import { snaTypeSet } from '../../../redux/slices/tools/snaTypeSlice';

export function setTweetsDetail (from, data, dispatch) {
	
	let payload;

	switch (from) {
		case "PLOT_LINE":
            
			dispatch(tweetsDetailHistogramResultSet(data));
			break;

        case "PLOT_PIE_CHART_0":

			payload = data != null ? null : 0;
			dispatch(tweetsDetailPieChartResultSet(payload));
			break;

        case "PLOT_PIE_CHART_1":
            
			payload = data != null ? null : 1;
			dispatch(tweetsDetailPieChartResultSet(payload));
			break;

        case "PLOT_PIE_CHART_2":

            payload = data != null ? null : 2;
			dispatch(tweetsDetailPieChartResultSet(payload));
			break;

        case "PLOT_PIE_CHART_3":

            payload = data != null ? null : 3;
			dispatch(tweetsDetailPieChartResultSet(payload));
			break;

        case "PLOT_BUBBLE_CHART":

			dispatch(tweetsDetailBubbleChartResultSet(data));
			break;

        default:

            // There were other non implemented cases in the previous actions class, such as "PLOT_HEAT_MAP" and "PLOT_HASHTAG_GRAPH" that had no corresponding reducers
			break;
		}
}

//keyword from /components/NavItems/tools/TwitterSna.tsv
const TwitterSna = () => {
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
			MuiAccordion:{
				root:{
					boxShadow: "none",
					'&:before': {
						width: "0px",
					},
					border: "1px solid #00926c",			
				},
				rounded:{
					borderRadius: "15px",
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

	const dispatch = useDispatch();
	const sna = { type: TW_SNA_TYPE, tsv: "/components/NavItems/tools/TwitterSna.tsv", tsvInfo: "/components/Shared/OnClickInfo.tsv" };
	const keyword = useLoadLanguage(sna.tsv)
	const classes = useMyStyles();
	const cardClasses = myCardStyles();
	const request = useSelector((state) => state.twitterSna.request);
	const isRedirect = useSelector((state) => state.twitterSna.redirect);
	const error = useSelector((state) => state.error);
	const [loading, setLoading] = useState(false);
	const isLoading = useSelector((state) => state.twitterSna.loading);
	const stage = useSelector((state) => state.twitterSna.stage);
	const maxStage = useSelector((state) => state.twitterSna.maxStage);
	const loadingMessage = useSelector(
		(state) => state.twitterSna.loadingMessage
	);
	const reduxResult = useSelector((state) => state.twitterSna.result);

	const lang = useSelector((state) => state.language);

	const userAuthenticated = useSelector(
		(state) => state.userSession && state.userSession.userAuthenticated
	);

	const [sinceError, setSinceError] = useState(false);
	const [untilError, setUntilError] = useState(false);
	// const [localTime, setLocalTime] = useState("true");
	const [openLangInput, setLangInputOpen] = useState(false);
	const [keyWordsError, setKeyWordsError] = useState(false);
	const [keyWordsAnyError, setKeyWordsAnyError] = useState(false);

	const role = useSelector((state) => state.userSession.user.roles);

	const [cache, setCache] = useState(
		request && request.cached !== null ? !request.cached : false
	);

	const [mediaVideo, setMediaVideo] = useState(
		request && (request.media === "video" || request.media === "both")
			? true
			: false
	);

	const [mediaImage, setMediaImage] = useState(
		request && (request.media === "image" || request.media === "both")
			? true
			: false
	);

	const [langPage, setLangPage] = useState(
		request && request.pageLanguage && request.pageLanguage !== lang
			? dispatch(changeLanguage(request.pageLanguage))
			: null
	);
	//HANDLE INPUT

	const [localTime, setLocalTime] = useState(
		request && request.localTime ? request.localTime : "true"
	);

	const [usersInput, setUsersInput] = useState(
		request && request.userList ? request.userList.join(" ") : ""
	);

	const [keyWords, setKeywords] = useState(
		request && request.keywordList ? request.keywordList.join(" ") : ""
	);

	const [keyWordsAny, setKeywordsAny] = useState(
		request && request.keywordAnyList ? request.keywordAnyList.join(" ") : ""
	);

	const [verifiedUsers, setVerifiedUsers] = useState(
		request && request.verified ? listToString(request.verified) : false
	);

	const [filters, setFilers] = useState(
		request && request.media ? request.media : "none"
	);
	const [until, setUntil] = useState(request ? new Date(request.until) : null);
	const [since, setSince] = useState(request ? new Date(request.from) : null);
	const [bannedWords, setBannedWords] = useState(
		request && request.bannedWords ? request.bannedWords.join(" ") : ""
	);

	const searchFormDisabled = isLoading || !userAuthenticated;

	//HANDLERS
	const cacheChange = () => {
		setCache(!cache);
	};

	const verifiedChange = () => {
		setVerifiedUsers(!verifiedUsers);
	};

	const videoChange = () => {
		setMediaVideo(!mediaVideo);
	};

	const imageChange = () => {
		setMediaImage(!mediaImage);
	};

	const handleVerifiedUsersChange = (event) => {
		setVerifiedUsers(event.target.value);
	};

	//HANDLE DATE

	const untilDateIsValid = (momentDate) => {
		const itemDate = momentDate.toDate();
		const currentDate = new Date();
		if (since) {
			return itemDate <= currentDate && since < itemDate;
		}
		return itemDate <= currentDate;
	};
	const sinceDateIsValid = (momentDate) => {
		const itemDate = momentDate.toDate();
		const currentDate = new Date();
		if (until) {
			return itemDate <= currentDate && itemDate < until;
		}
		return itemDate <= currentDate;
	};

	const handleSinceDateChange = (date) => {
		setSinceError(date === null);
		if (until && date >= until) setSinceError(true);
		setSince(date);
	};

	const handleUntilDateChange = (date) => {
		setUntilError(date === null);
		if (since && date < since) setUntilError(true);
		setUntil(date);
	};

	//HANDLE LANGUAGE

	const [langInput, setLangInput] = useState(
		request && request.lang ? "lang_" + request.lang : "lang_all"
	);
	const handleErrors = (e) => {
		dispatch(errorSet(e));
	};

	const makeRequest = () => {
		//Creating Request Object.
		const removeQuotes = (list) => {
			let res = [];
			!_.isNil(list) &&
				list.forEach((string) => {
					res.push(replaceAll(string, '"', ""));
				});
			return res;
		};

		let trimedKeywords = !_.isNil(keyWords)
			? removeQuotes(keyWords.trim().match(/("[^"]+"|[^"\s]+)/g))
			: [];

		let trimedKeywordsAny = !_.isNil(keyWordsAny)
			? removeQuotes(keyWordsAny.trim().match(/("[^"]+"|[^"\s]+)/g))
			: [];

		let trimedBannedWords = null;
		if (!_.isNil(bannedWords) && bannedWords.trim() !== "")
			trimedBannedWords = removeQuotes(
				bannedWords.trim().match(/("[^"]+"|[^"\s]+)/g)
			);
		const newFrom = localTime === "false" ? convertToGMT(since) : since;
		const newUntil = localTime === "false" ? convertToGMT(until) : until;

		let filter;
		if (mediaImage && mediaVideo) {
			filter = "both";
		} else if (mediaImage) {
			filter = "image";
		} else if (mediaVideo) {
			filter = "video";
		} else {
			filter = null;
		}

		return {
			keywordList: trimedKeywords,
			keywordAnyList: trimedKeywordsAny,
			bannedWords: trimedBannedWords,
			lang: langInput === "lang_all" ? null : langInput.replace("lang_", ""),
			userList: stringToList(usersInput),
			from: dateFormat(newFrom, "yyyy-mm-dd HH:MM:ss"),
			until: dateFormat(newUntil, "yyyy-mm-dd HH:MM:ss"),
			//verified: String(verifiedUsers) === "true",
			media: filter,
			retweetsHandling: null,
			cached: !cache,
		};
	};

	//HANDLE SUBMISSION
	//const [submittedRequest, setSubmittedRequest] = useState(makeRequest());
	const [submittedRequest, setSubmittedRequest] = useState(null);
	const onSubmit = () => {
		//Mandatory Fields errors

		if ((keyWords.trim() === "") && (keyWordsAny.trim() === "")){
			if (keyWords.trim() === "") {
				handleErrors(keyword("twitterStatsErrorMessage"));
				setKeyWordsError(true);
				return;
			}
			if (keyWordsAny.trim() === "") {
				handleErrors(keyword("twitterStatsErrorMessage"));
				setKeyWordsAnyError(true);
				return;
			}

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
		let newRequest = makeRequest();

		//console.log("Submit, newRequest: ", newRequest);
		if (JSON.stringify(newRequest) !== JSON.stringify(request)) {
			
			let prevResult = reduxResult;
			// if (prevResult && prevResult.coHashtagGraph) {
			// 	delete prevResult.coHashtagGraph;
			// }
			// if (prevResult && prevResult.socioSemanticGraph) {
			// 	delete prevResult.socioSemanticGraph;
			// }
			// if (prevResult && prevResult.socioSemantic4ModeGraph) {
			// 	delete prevResult.socioSemantic4ModeGraph;
			// }
			setSubmittedRequest(newRequest);
			dispatch(twitterSnaNewRequestSet(newRequest));
			dispatch(snaTypeSet(sna));
		}
	};
	
	
	if(isRedirect){
		let newRequest = makeRequest();
		setSubmittedRequest(newRequest)
		dispatch(twitterSnaNewRequestSet(newRequest));
		dispatch(snaTypeSet(sna));
	}

	
	function listToString(list) {
		var index = 0;
		var mystring = "";
		while (list[index]) {
			mystring = mystring + " " + list[index];
			index++;
		}
		return mystring;
	}

	useEffect(() => {
		if (isLoading) {
			setLoading(isLoading);
		}
		if (maxStage != 0 && stage === maxStage) {
			setLoading(false);
			dispatch(twitterSnaLoadingSet(false))
		}
	}, [isLoading, stage]);

	// Reset form & result when user login
	useEffect(() => {
		//console.log("use effect TNSA ... ")
		if (!userAuthenticated) {
			dispatch(twitterSnaCleanedState());
			setSubmittedRequest(null);
		}
	}, [userAuthenticated]);

	function cacheCheck() {
		for (let index in role) {
			if (role[index] == "CACHEOVERRIDE") {
				return true;
			}
		}
		return false;
	}
	useTwitterSnaRequest(submittedRequest);
	return (
		<div className={classes.all}>
			<ThemeProvider theme={theme}>

				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="center">

					<Grid item xs>
						<HeaderTool name={keyword("navbar_twitter_sna")} description={keyword("navbar_twitter_sna_description")} icon={<TwitterSNAIcon style={{ fill: "#00926c" }} />} />
					</Grid>
					<Grid item>
						<AdvancedTools />
					</Grid>
				</Grid>


				<StylesProvider injectFirst>

					<Card className={cardClasses.root}>

						<CustomCardHeader title={keyword("twittersna_searchparameters")} showHelp={true} helpText={"twittersna_explication"}/>

						<Box p={4}>

						<Grid container direction="column" spacing={0} >

							<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
								{keyword("twittersna_title_elements")}
							</Typography>
							<Box m={1} />

							
							<Grid container spacing={4} alignItems="center">
								<Grid item xs={8}>
									<TextField
										disabled={searchFormDisabled}
										error={keyWordsError}
										value={keyWords}
										onChange={(e) => {
											setKeywords(e.target.value);
											setKeyWordsError(false);
										}}
										id="standard-full-width"
											label={"* " + keyword("twittersna_field_all")}
										className={classes.neededField}
										placeholder={keyword("twitter_sna_search")}
										fullWidth
										variant="outlined"
									/>
								</Grid>

								<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
									<Grid item>
										<SearchIcon style={{ color: "#757575" }} />
									</Grid>
									<Grid>
										<Box m={1} />
									</Grid>
									<Grid item xs>
										<Typography variant="body2" align="left" style={{ color: "#757575" }}>
												{keyword("explanation_allelements")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							<Box m={1} />

							<Grid container spacing={4} alignItems="center">
								<Grid item xs={8}>
									<TextField
										disabled={searchFormDisabled}
										error={keyWordsAnyError}
										value={keyWordsAny}
										onChange={(e) => {
											setKeywordsAny(e.target.value);
											setKeyWordsAnyError(false);
										}}
										id="standard-full-width"
											label={"*  " + keyword("twittersna_field_any")}
										className={classes.neededField}
										placeholder={keyword("twitter_sna_search")}
										fullWidth
										variant="outlined"
									/>
								</Grid>

								<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
									<Grid item>
										<SearchIcon style={{ color: "#757575" }} />
									</Grid>
									<Grid>
										<Box m={1} />
									</Grid>
									<Grid item xs>
										<Typography variant="body2" align="left" style={{ color: "#757575" }}>
												{keyword("explanation_anyelements")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							<Box m={2} />	

							<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
								{keyword("twittersna_title_time")}
							</Typography>
							<Box m={1} />


							<Grid container spacing={4} alignItems="center">
								<Grid item xs={4}>
									<DateTimePicker
										id="standard-full-width-since"
										disabled={searchFormDisabled}
										input={true}
										isValidDate={sinceDateIsValid}
										label={"*  " + keyword("twitter_sna_from_date")}
										className={classes.neededField}
										dateFormat={"YYYY-MM-DD"}
										timeFormat={"HH:mm:ss"}
										value={since}
										handleChange={handleSinceDateChange}
										error={sinceError}
										placeholder={keyword("twitter_sna_selectdate")}

									/>
								</Grid>
								<Grid item xs={4}>
									<DateTimePicker
										id="standard-full-width-until"
										disabled={searchFormDisabled}
										input={true}
										isValidDate={untilDateIsValid}
										label={"*  " + keyword("twitter_sna_until_date")}
										className={classes.neededField}
										dateFormat={"YYYY-MM-DD"}
										timeFormat={"HH:mm:ss"}
										value={until}
										handleChange={handleUntilDateChange}
										error={untilError}
										placeholder={keyword("twitter_sna_selectdate")}
									/>
								</Grid>

								<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
									<Grid item>
										<CalendarTodayIcon style={{ color: "#757575" }} />
									</Grid>
									<Grid>
										<Box m={1} />
									</Grid>
									<Grid item xs>
										<Typography variant="body2" align="left" style={{ color: "#757575" }}>
											{keyword("explanation_dates")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							
							{/* 
							<Grid container spacing={4} alignItems="center">
								<Grid item xs={8}>
									<Typography variant="h6" align="left" style={{ paddingLeft: "0px"}}>
										{keyword("twittersna_title_timezone")}
									</Typography>
								</Grid>

								<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
									<Grid item>
										<GlobeIcon style={{ color: "#757575" }} />
									</Grid>
									<Grid>
										<Box m={1} />
									</Grid>
									<Grid item xs>
										<Typography variant="body2" align="left" style={{ color: "#757575" }}>
											{keyword("explanation_timezone")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							*/}

							<Box m={1}/>

							<Grid container spacing={4} alignItems="center">
								<Grid item xs={8}>
									<Box pl={3}>

										<FormControl component="fieldset" disabled={searchFormDisabled} style={{ width: "100%" }}>
											<RadioGroup
												aria-label="position"
												name="position"
												value={localTime}
												onChange={(e) => setLocalTime(e.target.value)}
												row
											>
												<Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
													<FormControlLabel
														value={"true"}
														control={<Radio color="primary" />}
														label={keyword("twitter_local_time")}
														labelPlacement="end"
													/>
													<Box m={1} />
													<FormControlLabel
														value={"false"}
														control={<Radio color="primary" />}
														label={keyword("twitter_sna_gmt")}
														labelPlacement="end"
													/>
												</Grid>
											</RadioGroup>
										</FormControl>

									</Box>
								</Grid>

								<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
									<Grid item>
										<GlobeIcon style={{ color: "#757575" }} />
									</Grid>
									<Grid>
										<Box m={1} />
									</Grid>
									<Grid item xs>
										<Typography variant="body2" align="left" style={{ color: "#757575" }}>
											{keyword("explanation_timezone")}
										</Typography>
									</Grid>
								</Grid>
							</Grid>
							

							<Box m={2} />
		
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon style={{ color: "#00926c"}}/>}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Box pl={3} pr={3} pt={1} pb={1}>
									<Typography variant="h6" align="left" style={{ color: "#00926c"}}>
										{keyword("twittersna_title_optional")}
									</Typography>
									</Box>
								</AccordionSummary>
									<AccordionDetails style={{ flexDirection: "column"}}>

									<Box pl={3} pr={3}>

									<Grid container direction="column" spacing={0}>

										<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
											{keyword("twittersna_title_words")}
										</Typography>
										<Box m={1} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<TextField
													disabled={searchFormDisabled}
													value={bannedWords}
													onChange={(e) => setBannedWords(e.target.value)}
													id="standard-full-width"
													label={keyword("twitter_sna_not")}
													placeholder={"word word2"}
													fullWidth
													variant="outlined"
												/>
											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<ExcludeIcon style={{ color: "#757575" }} />
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														{keyword("explanation_exclude")}
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										<Box m={1} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<FormControl
													variant="outlined"
													className={classes.formControl}
													disabled={searchFormDisabled}
												>
													<InputLabel id="test-select-label">
														{keyword("lang_choices")}
													</InputLabel>
													<Select
														native
														labelId="test-select-label"
														label={keyword("lang_choices")}
														id="demo-controlled-open-select"
														open={openLangInput}
														onClose={() => setLangInputOpen(false)}
														onOpen={() => setLangInputOpen(true)}
														value={langInput}
														onChange={(e) => setLangInput(e.target.value)}
													>
														<option value=""></option>
														<option value={"lang_fr"}>{keyword("lang_fr")}</option>
														<option value={"lang_en"}>{keyword("lang_en")}</option>
														<option value={"lang_es"}>{keyword("lang_es")}</option>
														<option value={"lang_ar"}>{keyword("lang_ar")}</option>
														<option value={"lang_de"}>{keyword("lang_de")}</option>
														<option value={"lang_it"}>{keyword("lang_it")}</option>
														<option value={"lang_id"}>{keyword("lang_id")}</option>
														<option value={"lang_pt"}>{keyword("lang_pt")}</option>
														<option value={"lang_ko"}>{keyword("lang_ko")}</option>
														<option value={"lang_tr"}>{keyword("lang_tr")}</option>
														<option value={"lang_ru"}>{keyword("lang_ru")}</option>
														<option value={"lang_nl"}>{keyword("lang_nl")}</option>
														<option value={"lang_hi"}>{keyword("lang_hi")}</option>
														<option value={"lang_no"}>{keyword("lang_no")}</option>
														<option value={"lang_sv"}>{keyword("lang_sv")}</option>
														<option value={"lang_fi"}>{keyword("lang_fi")}</option>
														<option value={"lang_da"}>{keyword("lang_da")}</option>
														<option value={"lang_pl"}>{keyword("lang_pl")}</option>
														<option value={"lang_hu"}>{keyword("lang_hu")}</option>
														<option value={"lang_fa"}>{keyword("lang_fa")}</option>
														<option value={"lang_he"}>{keyword("lang_he")}</option>
														<option value={"lang_ur"}>{keyword("lang_ur")}</option>
														<option value={"lang_th"}>{keyword("lang_th")}</option>
													</Select>
												</FormControl>
											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<TranslateIcon style={{ color: "#757575" }} />
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														{keyword("explanation_language")}
													</Typography>
												</Grid>
											</Grid>
										</Grid>
										<Box m={3} />
										<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
											{keyword("twittersna_title_accounts")}
										</Typography>
										<Box m={1} />


										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<TextField
													disabled={searchFormDisabled}
													value={usersInput}
													onChange={(e) => setUsersInput(e.target.value)}
													id="standard-full-width"
													label={keyword("twitter_sna_user")}
														placeholder={keyword("twitter_sna_placholder_tweetedby")}
													fullWidth
													variant="outlined"
												/>
											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<PersonOutlineIcon style={{ color: "#757575" }} />
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														{keyword("explanation_account")}
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										<Box m={1} />
										{/*
										<Grid container spacing={4} alignItems="center" style={{ paddingLeft: "0px" }}>
											<Grid item xs={8}>
												<Box pl={3}>
													<FormControl component="fieldset" disabled={searchFormDisabled}>
															<FormControlLabel
																aria-label="position"
																name="position"
																control={
																	<Checkbox 
																		color="primary"
																		onChange={verifiedChange}
																		disabled={searchFormDisabled}
																		checked={verifiedUsers}/>
																}
																label={keyword("twitter_sna_verified")}
																labelPlacement="end"
															/>
													</FormControl>
												</Box>

											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<DoneIcon style={{ color: "#757575" }} />
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														{keyword("explanation_verified")}
													</Typography>
												</Grid>
											</Grid>
										</Grid> */}

										<Box m={3} />
										
										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
													{keyword("twittersna_title_media")}
												</Typography>
											</Grid>

											
											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												
											</Grid>
											
										</Grid>
										

										<Box m={1} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<Box pl={3}>
													<FormControlLabel
														control={
															<Checkbox
																disabled={searchFormDisabled}
																checked={mediaImage}
																onChange={imageChange}
																value="checkedBox"
																color="primary"
															/>
														}
														label={keyword("twitterStats_media_images")}
														style={{ paddingLeft: "0px" }}

													/>
													<Box mt={1} />
													<FormControlLabel
														control={
															<Checkbox
																disabled={searchFormDisabled}
																checked={mediaVideo}
																onChange={videoChange}
																value="checkedBox"
																color="primary"
															/>
														}
														label={keyword("twitterStats_media_videos")}
														style={{ paddingLeft: "0px" }}
													/>
												</Box>
											</Grid>


											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<PermMediaIcon style={{ color: "#757575" }} />
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														{keyword("explanation_media")}
													</Typography>
												</Grid>
											</Grid>

										</Grid>
										
										

										{cacheCheck() && (
											<>
										<Box m={3} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<Typography variant="h6" align="left">
													{keyword("twittersna_title_advanced")}
												</Typography>
											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
											</Grid>
										</Grid>

										<Box m={1} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<Box pl={3}>
													<FormControlLabel
														control={
															<Checkbox
																disabled={searchFormDisabled}
																checked={cache}
																onChange={cacheChange}
																value="checkedBox"
																color="primary"
															/>
														}
														label={keyword("disable_cache")}
													/>
												</Box>
											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<LaptopIcon style={{ color: "#757575" }} />Fee
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														{keyword("explanation_cache")}
													</Typography>
												</Grid>
											</Grid>
										</Grid>


											
										</>
										)}
									</Grid>
									</Box>
								</AccordionDetails>
							</Accordion>
							<Box m={2} />
							<Button
								fullWidth
								variant="contained"
								color="primary"
								startIcon={<SearchIcon />}
								onClick={onSubmit}
								disabled={
									searchFormDisabled || keyWordsError || keyWordsAnyError || sinceError || untilError || loading
								}
							>
								{keyword("button_submit")}
							</Button>
							{error !== null && (
								<MyErrorbar
									variant="error"
									message={error}
									onClick={() => dispatch(errorCleaned())}
								/>
							)}
							<Box m={1} />
							<Typography>{loadingMessage}</Typography>
							{loading ? <LinearProgress /> : null}
							{!userAuthenticated && <OnWarningInfo keyword={"warning_sna"} />}
							</Grid>
						</Box>		
					</Card>
				</StylesProvider>
				{reduxResult && (
					<TwitterSnaResult result={reduxResult} request={request} />
				)}
				<FeedBack />

			</ThemeProvider>
		</div>
	);
};
export default TwitterSna;
