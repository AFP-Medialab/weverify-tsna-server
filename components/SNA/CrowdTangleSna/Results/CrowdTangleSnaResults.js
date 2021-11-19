
import { CardHeader, IconButton } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cleanCsvSnaState } from "../../../../redux/actions/tools/crowdTangleSnaActions";
import CloseResult from "../../../shared/CloseResult/CloseResult";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import UrlList from "../../Components/UrlList";
import Count from "../Components/Count";

const tsv = "/components/NavItems/tools/TwitterSna.tsv";
const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {
	ssr: false,
});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {
	ssr: false,
});
const HeatMap = dynamic(import("../Components/HeatMap"), { ssr: false });
const BubbleChart = dynamic(import("../Components/BubbleChartCSV"), { ssr: false });
const HashtagGraph = dynamic(import("../Components/HashtagGraph"), { ssr: false });
const SocioSemGraph = dynamic(import("../Components/SocioSemGraph"), { ssr: false });
const CloudChart = dynamic(import("../Components/CloudChart"), { ssr: false });


export default function CrowdTangleSnaResults(props) {
	const sna = useSelector((state) => state.sna);
	const classes = useMyStyles();
	const dispatch = useDispatch();
	const keyword = useLoadLanguage(tsv);
	const snatsv = useSelector((state) => state.sna.tsv);
	const keyword2 = useLoadLanguage(snatsv);

	const [widthIndex, setWidthIndex] = useState(4);
	const [widthCards, setWidthCards] = useState(8);
	const [collapsed, setCollapsed] = useState(false);
	const [alignIndex, setAlignIndex] = useState("flex-start");
	function onClickCollapseIndex() {
		if (widthIndex == 4) {
			setCollapsed(true);
			setWidthIndex(1);
			setWidthCards(11);
			setAlignIndex("center");

		} else {
			setCollapsed(false);
			setWidthIndex(4);
			setWidthCards(8);
			setAlignIndex("flex-start");

		}
	}


	return (

		<Box>
			<CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
			<Box m={4} />

			<Grid
				container
				direction="row"
				justifyContent="space-between"
				alignItems="flex-start"
				spacing={3}
			>

				<Grid item xs={widthIndex} style={{ position: "sticky", top: "100px" }}>
					<Card>
						<CardHeader
							className={classes.headerCard}
							title={
								<Grid
									container
									direction="row"
									justifyContent="center"
									alignItems="center">

									{!collapsed &&
										<Grid item xs>
											<span>
												{keyword("twitter_sna_index")}
											</span>
										</Grid>
									}

									{!collapsed &&
										<Grid item>
											<IconButton onClick={props.functionNodes} onClick={onClickCollapseIndex}>
												<ArrowBackIosIcon style={{ marginRight: "-5px", color: "white"}} />
											</IconButton>
										</Grid>
									}
									{collapsed &&
										<Grid item>
											<IconButton onClick={props.functionNodes} onClick={onClickCollapseIndex}>
												<ArrowForwardIosIcon style={{color: "white"}} />
											</IconButton>
										</Grid>
									}

								</Grid>
							}
						/>

						<Box p={3}>

							<Grid
								container
								direction="column"
								alignItems={alignIndex}
							>

								<a href="#tweets" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"1."}
										{!collapsed &&
											" " + keyword2("ct_counter_title")
										}

									</Typography>
									<Box m={1} />
								</a>


								<a href="#bubble0" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"2."}
										{!collapsed &&
											" " + keyword("retweets_cloud_chart_title")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#bubble1" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"3."}
										{!collapsed &&
											" " + keyword("likes_cloud_chart_title")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#bubble2" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"4."}
										{!collapsed &&
											" " + keyword("top_users_pie_chart_title")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#bubble3" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"5."}
										{!collapsed &&
											" " + keyword("mention_cloud_chart_title")
										}
									</Typography>
									<Box m={1} />
								</a>


								<a href="#heatmap" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"6."}
										{!collapsed &&
											" " + keyword("heatmap_chart_title")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#hastag" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"7."}
										{!collapsed &&
											" " + keyword("hashtag_graph_title")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#sociosemantic" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"8."}
										{!collapsed &&
											" " + keyword("sosem_graph_title2")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#words" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"9."}
										{!collapsed &&
											" " + keyword("top_words_cloud_chart_title")
										}
									</Typography>
									<Box m={1} />
								</a>

								<a href="#urls" style={{ textDecoration: "none", color: "black" }}>
									<Typography variant={"h6"} >
										{"10."}
										{!collapsed &&
											" " + keyword("twittersna_result_url_in_tweets")
										}
									</Typography>
									<Box m={1} />
								</a>

							</Grid>

						</Box>




					</Card>


				</Grid>


				<Grid item xs={widthCards}>
					{
						<div style={{ position: "relative" }}>
							<span id="tweets" style={{ position: "absolute", top: "-112px" }}></span>
							{props.result.countSna &&
								<Count result={props.result}
								/>}
						</div>
					}
					{
						<div style={{ position: "relative" }}>
							<span id="propagation" style={{ position: "absolute", top: "-112px" }}></span>
							<Box m={3} />
							{props.result.histogram && (
								<PlotTimeLine
									result={props.result}
								/>
							)}
						</div>
					}

					{
						<div style={{ position: "relative" }}>
							<Box m={3} />
							{props.result && props.result.pieCharts && (
								<PlotPieChart
									result={props.result}
								/>)}
						</div>
					}
					{
						<div style={{ position: "relative" }}>
							<span id="bubble" style={{ position: "absolute", top: "-112px" }}></span>
							<Box m={3} />
							{
								props.result && props.result.bubbleChart &&
								<BubbleChart result={props.result} />
							}
						</div>
					}
					{
						<div style={{ position: "relative" }}>
							<span id="heatmap" style={{ position: "absolute", top: "-112px" }}></span>
							<Box m={3} />
							{
								props.result.heatMap &&
								<HeatMap result={props.result} />
							}
						</div>
					}
					{
						<div style={{ position: "relative" }}>
							<span id="hastag" style={{ position: "absolute", top: "-112px" }}></span>
							<Box m={3} />
							{
								props.result.coHashtagGraph &&
								<HashtagGraph result={props.result} />
							}
						</div>
					}
					{
						<div style={{ position: "relative" }}>
							<span id="sociosemantic" style={{ position: "absolute", top: "-112px" }}></span>
							<Box m={3} />
							{
								props.result.socioSemantic4ModeGraph &&
								<SocioSemGraph result={props.result} />
							}
						</div>
					}
					{
						<div style={{ position: "relative" }}>
							<span id="words" style={{ position: "absolute", top: "-112px" }}></span>
							<Box m={3} />
							{
								props.result.cloudChart &&
								<CloudChart result={props.result} />
							}
						</div>
					}

					<Box m={3} />
					{
						<div style={{ position: "relative" }}>
							<span id="urls" style={{ position: "absolute", top: "-112px" }}></span>
							{
								props.result.urls &&
								<UrlList result={props.result} title_message={'ct_sna_result_url_in_posts'}
									tooltip_message={'twittersna_result_submit_twitter_sna'} downloadable={false} topic={"this topic"}/>
							}
						</div>
					}


				</Grid>



			</Grid>

		</Box>
	);
}
