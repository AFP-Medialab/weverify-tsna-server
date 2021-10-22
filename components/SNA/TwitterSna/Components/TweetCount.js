import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import React, { useEffect, useState } from "react";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import useMyStyles from "../../../shared/styles/useMyStyles";
import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import { CardHeader } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import IconTweet from "../../../../images/SVG/TweetCount/Tweet.svg";
import IconRetweet from "../../../../images/SVG/TweetCount/Retweet.svg";
import IconLike from "../../../../images/SVG/TweetCount/Like.svg";


export default function TweetCount(props) {
	const sna = useSelector(state => state.sna)
	const keyword = useLoadLanguage(sna.tsv);
	const classes = useMyStyles();
	const [countVisible, setCountVisible] = useState(true);
	const [tweetCount, setTweetCount] = useState({
		count: 0,
		retweet: 0,
		like: 0,
	});

	useEffect(() => {
		if (!_.isNil(props.result.tweetCount))
			setTweetCount({
				...tweetCount,
				count: props.result.tweetCount.count,
				retweet: props.result.tweetCount.retweet,
				like: props.result.tweetCount.like,
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.result.tweetCount]);

	return (
		<Card>
			<CustomCardHeader title={keyword("tweetCounter_title")} showHelp={true} helpText={"twittersna_tweetnb_tip"} />
			<Box alignItems="center" justifyContent="center" width={"100%"} mt={4} className={classes.cardsResults}>
				<Grid
					container
					justifyContent="space-around"
					spacing={2}
					alignContent={"center"}
				>
					<Grid item style={{ minWidth: "120px", display: "flex", flexDirection: "column", alignItems: "center" }} >
						<Typography style={{ fontSize: "60px" }}>
							{tweetCount.count}
						</Typography>
						<div style={{display: "flex"}}>
							<IconTweet style={{ marginRight: "10px", marginTop:"2px" }} />
							<Typography variant={"h5"} style={{ color: "#818B95" }}>Tweets</Typography>
						</div>
					</Grid>
					<Grid item style={{ minWidth: "120px", display: "flex", flexDirection: "column", alignItems: "center" }} >
						<Typography style={{ fontSize: "60px" }}>
							{tweetCount.retweet}
						</Typography>
						<div style={{display: "flex"}}>
							<IconRetweet style={{ marginRight: "10px", marginTop:"2px" }} />
							<Typography variant={"h5"} style={{ color: "#818B95" }}>Retweets</Typography>
						</div>
					</Grid>
					<Grid item style={{minWidth: "120px", display: "flex", flexDirection: "column", alignItems: "center" }} >
						<Typography style={{ fontSize: "60px" }}>
							{tweetCount.like}
						</Typography>
						<div style={{display: "flex"}}>
							<IconLike style={{ marginRight: "10px", marginTop:"2px" }} />
							<Typography variant={"h5"} style={{ color: "#818B95" }}>Likes</Typography>
						</div>
					</Grid>
				</Grid>
				<Box m={4} />
			</Box>
		</Card>
	);
}
