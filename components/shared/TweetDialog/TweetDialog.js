import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import { useEffect, useState } from "react";
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
import { Grid, TextField } from '@material-ui/core';

const tsv = "/components/Shared/CustomTable.tsv";
let postWithBotTweetUrl = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweetBot`;
let postTweet = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweet`;

const TweetDialog = (props) => {
    console.log("props");
    console.log(props);
    var desinfo = "desinfo";
    const keyword = useLoadLanguage(tsv);
    const [twitterOAuthUrl, setTwitterOAuthUrl] = useState();
    const [showConnectionIframe, setShowConnectionIframe] = useState(false);

    const postTweetContent = () => {
        const content = props.selectedURL[0].description
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
    const postUserTweetContent = () => {
        console.log("icic user ....")
        //Todo connection handler if not connect -> connect with Oauth
        fetch(postTweet).then((response) => response.json())
            .then((data) => { 
                setTwitterOAuthUrl(data.authLink)
                setShowConnectionIframe(true);
                window.open(data.authLink, '', 'width=600,height=400,left=200,top=200')
                console.log("body ", data)})
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


                <DialogContent style={{ height: '505px' }}>


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
                                    <Typography variant="body" >
                                        <a style={{ color: "#51A5B2" }} href={props.selectedURL[0].string }>{props.selectedURL[0].string}</a>
                                </Typography>

                                <Box m={2} />

                                <TextField
                                    id="outlined-multiline-static"
                                    label="Multiline"
                                    multiline
                                    rows={11}
                                    defaultValue={"There's a lot of misinformation on this topic checkout alternative reading : " + props.selectedURL[0].string }
                                    variant="outlined"
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


                            <Grid item xs={4} container direction="column" style={{ paddingLeft: "35px", display: "flex", overflow: "auto", minHeight: "100%", maxHeight: "469px", flexWrap: "nowrap" }}>
                                <Typography variant="h4" style={{ color: "#51A5B2" }}>
                                    Author
                                </Typography>
                                    <Box m={2} />
                                    <Typography variant="h6">
                                        Name
                                    </Typography>
                                    <Typography variant="body">
                                        {props.selectedURL[0].name}
                                    </Typography>

                                    <Box m={1} />

                                    <Typography variant="h6">
                                        Credibility
                                    </Typography>
                                    <Typography variant="body">
                                        {props.creditType}
                                    </Typography>

                                    <Box m={1} />

                                    <Typography variant="h6">
                                        Description
                                    </Typography>
                                    <Typography variant="body" style={{lineHeight: "24px"}}>
                                        {props.selectedURL[0].description}
                                    </Typography>

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
                */}
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
                 */}
                </>
                }
            </Box>
        </Dialog>
        
        </>
    )
}
export default TweetDialog;