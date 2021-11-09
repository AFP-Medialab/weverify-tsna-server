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

const tsv = "/components/Shared/CustomTable.tsv";
let postWithBotTweetUrl = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweetBot`;
let postTweet = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweet`;

const TweetDialog = (props) => {
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
                maxWidth={'xs'}
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="max-width-dialog-title"
            >
            <Box p={2}>
            {props.selectedURL[0] && <>
                <DialogTitle id="max-width-dialog-title">
                    <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px" }}>
                        {props.creditType === desinfo ? keyword("credibility_desinfo_title"): keyword("credibility_fct_title")}
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ height: '300px' }}>
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
                </DialogContent>
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
                </>
                }
            </Box>
        </Dialog>
        
        </>
    )
}
export default TweetDialog;