import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import React, {useEffect, useState} from 'react';
import useLoadLanguage from "../../hooks/useLoadLanguage";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import useMyStyles from "../../styles/useMyStyles";
import Grid from "@material-ui/core/Grid";


export default function TweetCountInsta(props){


    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const classes = useMyStyles();
    const [countVisible, setCountVisible] = useState(true);
    const [state, setState] = useState(
        {
            result: props.result        
        }
    );
    useEffect(() => {
        setState({
            ...state,
            result: props.result,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.result.TweetCountInsta]);


    return (
        <Accordion expanded={countVisible} onChange={() => setCountVisible(!countVisible)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel0a-content"}
                        id={"panel0a-header"}
                    >
                        <Typography className={classes.heading} >{keyword("tweetCounter_title")}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box alignItems="center" justifyContent="center" width={"100%"}>
                            <Grid container justify="space-around" spacing={2}
                                alignContent={"center"}>
                                <Grid item>
                                    <Typography variant={"h6"}>Publications</Typography>
                                    <Typography variant={"h2"}>{props.result.tweetCountInsta.count}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Total interactions</Typography>
                                    <Typography variant={"h2"}>{props.result.tweetCountInsta.total_interactions}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Likes</Typography>
                                    <Typography variant={"h2"}>{props.result.tweetCountInsta.likes}</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant={"h6"}>Comments</Typography>
                                    <Typography variant={"h2"}>{props.result.tweetCountInsta.comments}</Typography>
                                </Grid>
                            </Grid>
                            <Box m={3}/>
                            <OnClickInfo keyword={"twittersna_tweetnb_tip"}/>
                        </Box>
                    </AccordionDetails>
                </Accordion>
    )
}