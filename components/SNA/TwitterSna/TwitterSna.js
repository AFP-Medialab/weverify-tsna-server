
import useMyStyles, { myCardStyles } from "../../shared/styles/useMyStyles";
import { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import "../../../redux/actions/tools/twitterSnaActions";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import DateTimePicker from "../../shared/DateTimePicker/DateTimePicker"
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
import Typography from "@material-ui/core/Typography";
import useTwitterSnaRequest from "./Hooks/useTwitterSnaRequest";
import TwitterSnaResult from "./Results/TwitterSnaResult";
import _ from "lodash";
import { replaceAll, stringToList } from "../../shared/lib/StringUtil"
import dateFormat from "dateformat";

import { setError } from "../../../redux/actions/errorActions";
import {
	cleanTwitterSnaState,
	setTwitterSnaNewRequest,
	setSnaType
} from "../../../redux/actions/tools/twitterSnaActions";
import convertToGMT from "../../shared/DateTimePicker/convertToGMT";
import MyErrorbar from "../../shared/ErrorBar/ErrorBar";
import { cleanError } from "../../../redux/actions/errorActions";
import OnClickInfo from "../../shared/OnClickInfo/OnClickInfo";
import OnWarningInfo from "../../shared/OnClickInfo/OnWarningInfo";
import FeedBack from "../../shared/FeedBack/FeedBack";
import { changeLanguage } from "../../../redux/actions";

import HeaderTool from "../../shared/HeaderTool/HeaderTool";
import { StylesProvider } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import TwitterSNAIcon from '../../../images/SVG/DataAnalysis/Twitter_sna_big.svg';
import AdvancedTools from "../../Navigation/AdvancedTools/AdvancedTools";
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage";
import { TW_SNA_TYPE } from "../../shared/hooks/SnaTypes";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

import SearchIcon from '@material-ui/icons/Search';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import GlobeIcon from '@material-ui/icons/Public';
import ExcludeIcon from '@material-ui/icons/HighlightOff';
import TranslateIcon from '@material-ui/icons/Translate';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import DoneIcon from '@material-ui/icons/Done';
import PermMediaIcon from '@material-ui/icons/PermMedia';
import LaptopIcon from '@material-ui/icons/Laptop';

import Divider from '@material-ui/core/Divider';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

//keyword from /components/NavItems/tools/TwitterSna.tsv
const TwitterSna = () => {


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


			MuiAccordion:{
				root:{
					boxShadow: "none",
					'&:before': {
						width: "0px",
					}
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


	const dispatch = useDispatch();
	const sna = { type: TW_SNA_TYPE, tsv: "/components/NavItems/tools/TwitterSna.tsv", tsvInfo: "/components/Shared/OnClickInfo.tsv" };
	const keyword = useLoadLanguage(sna.tsv)
	const classes = useMyStyles();
	const cardClasses = myCardStyles();
	const request = useSelector((state) => state.twitterSna.request);
	const error = useSelector((state) => state.error);

	const isLoading = useSelector((state) => state.twitterSna.loading);
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

	const [verifiedUsers, setVerifiedUsers] = useState(
		request && request.verified ? listToString(request.verified) : "false"
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
		dispatch(setError(e));
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
			bannedWords: trimedBannedWords,
			lang: langInput === "lang_all" ? null : langInput.replace("lang_", ""),
			userList: stringToList(usersInput),
			from: dateFormat(newFrom, "yyyy-mm-dd HH:MM:ss"),
			until: dateFormat(newUntil, "yyyy-mm-dd HH:MM:ss"),
			verified: String(verifiedUsers) === "true",
			media: filter,
			retweetsHandling: null,
			cached: !cache,
		};
	};

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
		let newRequest = makeRequest();

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
			dispatch(setSnaType(sna));
		}
	};

	// const [submittedRequest, setSubmittedRequest] = useState(null);
	const [submittedRequest, setSubmittedRequest] = useState(makeRequest());

	useTwitterSnaRequest(submittedRequest, keyword);

	function listToString(list) {
		var index = 0;
		var mystring = "";
		while (list[index]) {
			mystring = mystring + " " + list[index];
			index++;
		}
		return mystring;
	}

	// Reset form & result when user login
	useEffect(() => {
		//console.log("use effect TNSA ... ")
		if (!userAuthenticated) {
			dispatch(cleanTwitterSnaState());
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


	return (
		<div className={classes.all}>
			<ThemeProvider theme={theme}>

				<Grid
					container
					direction="row"
					justifyContent="space-between"
					alignItems="center">

					<Grid item xs>
						<HeaderTool name={keyword("navbar_twitter_sna")} description={keyword("navbar_twitter_sna_description")} icon={<TwitterSNAIcon style={{ fill: "#51A5B2" }} />} />
					</Grid>
					<Grid item>
						<AdvancedTools />
					</Grid>
				</Grid>


				<StylesProvider injectFirst>

					<Card className={cardClasses.root}>

						<CardHeader
							title="Search parameters"
							className={classes.headerUpladedImage}
						/>

						<Box p={4}>

						<Grid container direction="column" spacing={0}>

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
										label={"*  " + keyword("twitter_sna_search")}
										className={classes.neededField}
										placeholder={"#example"}
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
											Specify words that you don’t want to analyze in the search results
										</Typography>
									</Grid>
								</Grid>
							</Grid>

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
											Dates between the tweets were analyzed for the search term indicated
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							<Box m={1} />

							<Grid container spacing={4} alignItems="center">
								<Grid item xs={8}>
									<Typography variant="h6" align="left" style={{ paddingLeft: "0px"}}>
										Time zone of the dates
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
											Specify the time zone of the dates introduced before
										</Typography>
									</Grid>
								</Grid>
							</Grid>

							<Box m={1} />

							<FormControl component="fieldset" disabled={searchFormDisabled} style={{ width: "100%", paddingLeft: "30px" }}>
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

							<Box m={3} />

							<Divider style={{marginRight: "32px"}}/>

							<Box m={1} />
		
							<Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1a-content"
									id="panel1a-header"
								>
									<Typography variant="h5" align="left">
										Optional parameters
									</Typography>
								</AccordionSummary>
								<AccordionDetails>

									<Grid container direction="column" spacing={0}>

										

										<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
											Words
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
														Specify words that you don’t want to analyze in the search results
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
													<InputLabel id="demo-controlled-open-select-label">
														{keyword("lang_choices")}
													</InputLabel>
													<Select
														labelid="demo-controlled-open-select-label"
														id="demo-controlled-open-select"
														open={openLangInput}
														onClose={() => setLangInputOpen(false)}
														onOpen={() => setLangInputOpen(true)}
														value={langInput}
														onChange={(e) => setLangInput(e.target.value)}
													>
														<MenuItem value={"lang_all"}>{keyword("lang_all")}</MenuItem>
														<MenuItem value={"lang_fr"}>{keyword("lang_fr")}</MenuItem>
														<MenuItem value={"lang_en"}>{keyword("lang_en")}</MenuItem>
														<MenuItem value={"lang_es"}>{keyword("lang_es")}</MenuItem>
														<MenuItem value={"lang_ar"}>{keyword("lang_ar")}</MenuItem>
														<MenuItem value={"lang_de"}>{keyword("lang_de")}</MenuItem>
														<MenuItem value={"lang_it"}>{keyword("lang_it")}</MenuItem>
														<MenuItem value={"lang_id"}>{keyword("lang_id")}</MenuItem>
														<MenuItem value={"lang_pt"}>{keyword("lang_pt")}</MenuItem>
														<MenuItem value={"lang_ko"}>{keyword("lang_ko")}</MenuItem>
														<MenuItem value={"lang_tr"}>{keyword("lang_tr")}</MenuItem>
														<MenuItem value={"lang_ru"}>{keyword("lang_ru")}</MenuItem>
														<MenuItem value={"lang_nl"}>{keyword("lang_nl")}</MenuItem>
														<MenuItem value={"lang_hi"}>{keyword("lang_hi")}</MenuItem>
														<MenuItem value={"lang_no"}>{keyword("lang_no")}</MenuItem>
														<MenuItem value={"lang_sv"}>{keyword("lang_sv")}</MenuItem>
														<MenuItem value={"lang_fi"}>{keyword("lang_fi")}</MenuItem>
														<MenuItem value={"lang_da"}>{keyword("lang_da")}</MenuItem>
														<MenuItem value={"lang_pl"}>{keyword("lang_pl")}</MenuItem>
														<MenuItem value={"lang_hu"}>{keyword("lang_hu")}</MenuItem>
														<MenuItem value={"lang_fa"}>{keyword("lang_fa")}</MenuItem>
														<MenuItem value={"lang_he"}>{keyword("lang_he")}</MenuItem>
														<MenuItem value={"lang_ur"}>{keyword("lang_ur")}</MenuItem>
														<MenuItem value={"lang_th"}>{keyword("lang_th")}</MenuItem>
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
														Specify the language in which the tweets are going to be analyzed
													</Typography>
												</Grid>
											</Grid>
										</Grid>
										<Box m={3} />
										<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
											Accounts
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
													placeholder={keyword("user_placeholder")}
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
														Specify the twitter account whose tweets are going to be analyzed
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										<Box m={1} />

										<Grid container spacing={4} alignItems="center" style={{ paddingLeft: "0px" }}>
											<Grid item xs={8}>
												<Grid item >
													<FormControl component="fieldset" disabled={searchFormDisabled}>
														<FormLabel component="legend">
															{keyword("twitter_sna_verified")}
														</FormLabel>
															<Box m={1} />
														<RadioGroup
															aria-label="position"
															name="position"
															value={verifiedUsers}
															onChange={handleVerifiedUsersChange}
															row
														>
															<FormControlLabel
																value={"false"}
																control={<Radio color="primary" />}
																label={keyword("twitterStats_verified_no")}
																labelPlacement="end"
															/>
															<FormControlLabel
																value={"true"}
																control={<Radio color="primary" />}
																label={keyword("twitterStats_verified_yes")}
																labelPlacement="end"
															/>
														</RadioGroup>
													</FormControl>
												</Grid>
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
														Specify if you only want to analyze tweets of verified accounts
													</Typography>
												</Grid>
											</Grid>
										</Grid>

											<Box m={3} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<Typography variant="h6" align="left" style={{ paddingLeft: "0px" }}>
													Media
												</Typography>
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
														Specify the media elements that you want to analyze
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										<Box m={1} />
										

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

										<Box m={3} />

										<Grid container spacing={4} alignItems="center">
											<Grid item xs={8}>
												<Typography variant="h6" align="left">
													Advanced tools
												</Typography>
											</Grid>

											<Grid item xs={4} container direction="row" justifyContent="flex-start" alignItems="center">
												<Grid item>
													<LaptopIcon style={{ color: "#757575" }} />
												</Grid>
												<Grid>
													<Box m={1} />
												</Grid>
												<Grid item xs>
													<Typography variant="body2" align="left" style={{ color: "#757575" }}>
														Explanation
													</Typography>
												</Grid>
											</Grid>
										</Grid>

										<Box m={1} />

										{cacheCheck() && (
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
										)}
									</Grid>
								</AccordionDetails>
							</Accordion>


							<Box m={1} />


							<Button
								fullWidth
								variant="contained"
								color="primary"
								startIcon={<SearchIcon />}
								onClick={onSubmit}
								disabled={
									searchFormDisabled || keyWordsError || sinceError || untilError
								}
							>
								{keyword("button_submit")}
							</Button>
							{error !== null && (
								<MyErrorbar
									variant="error"
									message={error}
									onClick={() => dispatch(cleanError())}
								/>
							)}
							<Box m={2} />
							<Typography>{loadingMessage}</Typography>
							<LinearProgress hidden={!isLoading} />
							{userAuthenticated && (
								<OnClickInfo keyword={"twittersna_explication"} tsvInfo={sna.tsvInfo} />
							)}
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
