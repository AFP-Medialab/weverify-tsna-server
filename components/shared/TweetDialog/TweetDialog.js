import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from "@material-ui/core/Typography";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import {connectionWindow, connectionEnable} from "../../../redux/actions/connectionAction"
import { Grid, TextField } from '@material-ui/core';
import DesinformationIcon from "../../../images/SVG/DataAnalysis/Credibility/Desinformation.svg";
import FactCheckerIcon from "../../../images/SVG/DataAnalysis/Credibility/Fact-checker.svg";

const tsv = "/components/Shared/CustomTable.tsv";
let postWithBotTweetUrl = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweetBot`;
let postTweet = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweet`;
import LinkIcon from '@material-ui/icons/Link';



const TweetDialog = (props) => {
    //console.log("props");
    //console.log(props);
    var desinfo = "desinfo";
    const keyword = useLoadLanguage(tsv);
    const windowConnection = useSelector(state => state.conn.windowsOpen);
    const isConnectionEnable = useSelector(state => state.conn.connectionEnable)
    const dispatch = useDispatch();
    const [popup, setPopup] = useState(null)

    const topic = useSelector(state => state.twitterSna.request.keywordList[0]);

    const [tweetText, setTweetText] = useState("There's a lot of misinformation on this topic checkout alternative reading :");

    if (props.selectedURL[0] && props.selectedURL[0].string && tweetText === "There's a lot of misinformation on this topic checkout alternative reading :"){
        setTweetText("There's a lot of misinformation on " + topic + ", checkout alternative reading : " + props.selectedURL[0].string);
    }

    
    
    useEffect(() => {
        console.log("effect ", windowConnection)
        if(isConnectionEnable && !windowConnection){
            console.log("connection is false")
            postUserTweetContent();
        }
        return () => dispatch(connectionEnable(false))  
    }, [windowConnection])
   
    /*useEffect(() => {
        console.log("popip ", popup)
        if(popup){
            popup.addEventListener("close",props.onEvent)
        }
        return () => popup.removeEventListener("close",props.onEvent)
    }, [popup])*/

    const handleChange = e =>{
        setTweetText(e.target.value);
    }


    const postTweetContent = () => {
        console.log(tweetText);
        //console.log(topic);
        
        //const content = props.selectedURL[0].description
        
        const content = tweetText;
        const response =  fetch(postWithBotTweetUrl, {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        const status =  response.status;
       
        console.log("post response ", response)
        console.log("post response status", status)
        
    }
    const oncloseWindown= () => {
        console.log("close ...")
    }
    const postUserTweetContent = () => {
        console.log("icic user ....")
        const content = props.selectedURL[0].description
        var status =''
        //Todo connection handler if not connect -> connect with Oauth
        fetch(postTweet, 
        {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then((response) => {status = response.status; 
            return response.json()})
        .then((data) => { 
            console.log("body ", data)
            console.log("status ", status)
            if(status === 301){
                window.open(data.authLink, '', 'width=600,height=400,left=200,top=200');
                
                dispatch(connectionEnable(true)) 
                dispatch(connectionWindow(true))
            }else if (status === 200){
                props.handleClose()
            }
        }
        )
        .catch((err) => {
            console.log("error connection ", err)
        })
    }
    return (
        <>
        <Dialog
                fullWidth
                maxWidth={'lg'}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="max-width-dialog-title"
            >
            <Box p={2}>
            {props.selectedURL[0] && <>

                {/*
                
                <DialogTitle id="max-width-dialog-title">
                    <Typography gutterBottom  >
                        {props.creditType === desinfo ? keyword("credibility_desinfo_title"): keyword("credibility_fct_title")}
                    </Typography>
                </DialogTitle>

                */}


                <DialogContent style={{ height: '507px' }}>


                    <Grid
                        container
                        direction="row">

                            <Grid item xs={8} container direction="column" style={{ paddingRight: "35px", borderRight: "1px solid #CACACA"}}>
                                <Typography variant="h4" style={{ color: "#51A5B2"}}>
                                    Link Information
                                </Typography>

                                <Box m={2} />

                                <Typography variant="h6">
                                    Selected link
                                </Typography>
                                    <Typography variant="body1" >
                                        <a style={{ color: "#51A5B2" }} href={props.selectedURL[0].string} target="_blank">{props.selectedURL[0].string}</a>
                                </Typography>

                                <Box m={2} />

                                <TextField
                                    id="outlined-multiline-static"
                                    label="Multiline"
                                    multiline
                                    rows={11}
                                    value={tweetText}
                                    variant="outlined"
                                    onChange={handleChange}
                                />

                                <Box m={2} />

                                 <Grid
                                    container
                                    direction="row"
                                    spacing={4}>

                                    <Grid item xs={6}>
                                            <Button variant="contained" color="primary" fullWidth onClick={postTweetContent} style={{color: "white"}}>
                                                Tweet with WeVerify Bot
                                            </Button>
                                    </Grid>

                                    <Grid item xs={6}>
                                            <Button variant="contained" color="primary" fullWidth onClick={postUserTweetContent} style={{ color: "white" }}>
                                                Tweet with your account
                                            </Button>
                                    </Grid>


                                </Grid>


                            </Grid>


                            <Grid item xs={4} container direction="column" style={{ paddingLeft: "35px", display: "flex", overflow: "auto", minHeight: "100%", maxHeight: "472px", flexWrap: "nowrap" }}>
                                <Typography variant="h4" style={{ color: "#51A5B2" }}>
                                    Author
                                </Typography>
                                    
                                    <Box m={2} />
                                    {props.selectedURL[0].name &&
                                        <div>
                                        <Typography variant="h6">
                                            Name
                                        </Typography>
                                        <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >

                                            <a href={"https://" + props.selectedURL[0].website} target="_blank"><LinkIcon  style={{ marginRight: "10px", marginLeft: "2px", color:"#51A5B2" }}/></a>

                                            <Typography variant="body1">
                                                {props.selectedURL[0].name}
                                            </Typography>

                                        </Grid>
                                        
                                    

                                        <Box m={1} />
                                        </div>
                                    }

                                    {props.creditType === "desinfo" ?

                                        <div>

                                            <Typography variant="h6">
                                                Credibility
                                            </Typography>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <DesinformationIcon viewBox="0 0 50 50" width="30" height="30" style={{marginRight: "10px"}}/>
                                                <Typography variant="body1">
                                                    Desinformation
                                                </Typography>

                                            </Grid>
                                            <Box m={1} />
                                        </div>     
                                    
                                    :
                                        <div>

                                            <Typography variant="h6">
                                                Credibility
                                            </Typography>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <FactCheckerIcon viewBox="0 0 50 50" width="30" height="30" style={{ marginRight: "10px" }} />
                                                <Typography variant="body1">
                                                    Fact Checker
                                                </Typography>

                                            </Grid>

                                            <Box m={1} />
                                        </div>
                                    }

                                    <Typography variant="h6">
                                        Description
                                    </Typography>
                                    <Typography variant="body1" style={{lineHeight: "24px"}}>
                                        {props.selectedURL[0].description}
                                    </Typography>

                                    {props.selectedURL[0].debunks && <>
                                        <Box m={1} />
                                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                            {props.creditType === desinfo ? props.selectedURL[0].debunks.map((debunk, index) => (
                                                <ListItem key={index} component="a" href={debunk.trim()} target="_blank">
                                                    <ListItemText primary={debunk.trim()} />
                                                </ListItem>
                                            )) : <Typography variant="body2">props.selectedURL[0].description</Typography>}
                                        </List>
                                    </>}

                            </Grid>

                    </Grid>

                <Box m={4} />

                {/*

                <Typography variant="body2">
                    {"resolved-url : "}{props.selectedURL[0].string}
                </Typography>
                <Box m={4} />
                <Typography variant="body2">
                    {props.selectedURL[0].description}
                </Typography>
                {props.selectedURL[0].debunks &&<>
                <Box m={4} />
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {props.creditType === desinfo ? props.selectedURL[0].debunks.map((debunk, index) => (
                        <ListItem key={index} component="a" href={debunk.trim()} target="_blank">
                            <ListItemText primary={debunk.trim()} />
                        </ListItem>
                    )) : <Typography variant="body2">props.selectedURL[0].description</Typography>}
                </List>
                </>}
                <Box m={2} />
                */ }

                </DialogContent>

                        {/*
                        
                <Box m={1} />
                <DialogActions>
                    <Button variant="contained" color="primary" fullWidth onClick={postTweetContent}>
                            Tweet
                    </Button>
                </DialogActions>
                <DialogActions>
                    <Button variant="contained" color="primary" fullWidth onClick={postUserTweetContent}>
                        Tweet with your account
                    </Button>
                </DialogActions>

                */ }
                 
                </>
                }
            </Box>
        </Dialog>
        
        </>
    )
}
export default TweetDialog;