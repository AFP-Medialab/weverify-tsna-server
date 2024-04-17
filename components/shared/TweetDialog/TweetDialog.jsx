import { Grid, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from "@mui/material/Typography";
import LaptopIcon from '@mui/icons-material/Laptop';
import LinkIcon from '@mui/icons-material/Link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import getConfig from 'next/config';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DesinformationIcon from "../../../images/SVG/DataAnalysis/Credibility/Desinformation.svg";
import FactCheckerIcon from "../../../images/SVG/DataAnalysis/Credibility/Fact-checker.svg";
import { connectionEnable, connectionWindow } from "../../../redux/actions/connectionAction";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
const { publicRuntimeConfig } = getConfig();


const tsv = "/components/Shared/TweetDialog.tsv";
let postWithBotTweetUrl = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweetBot`;
let postTweet = `${publicRuntimeConfig.baseFolder}/api/twitter/postTweet`;


const TweetDialog = (props) => {
    
    var desinfo = "desinfo";
    const keyword = useLoadLanguage(tsv);
    const windowConnection = useSelector(state => state.conn.windowsOpen);
    const isConnectionEnable = useSelector(state => state.conn.connectionEnable)
    const dispatch = useDispatch();
    const topic = props.topic;
    const [tweetText, setTweetText] = useState("");


    if(props.open && tweetText=== ""){
        if (props.creditType === "desinfo") {
            var tweetTextTemp = keyword("textTweet_1") + topic + keyword("textTweet_2")  + "\n";
            props.selectedURL[0].debunks.map((debunk, index) => {
                tweetTextTemp += "\n" + debunk;
            });
            setTweetText(tweetTextTemp);
        } else if (props.creditType === "factchecker"){
            setTweetText(keyword("textTweet_1") + topic + keyword("textTweet_2") + props.selectedURL[0].string);
        }
    }
    
    useEffect(() => {
        //console.log("effect ", windowConnection)
        if(isConnectionEnable && !windowConnection){
            //console.log("connection is false")
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
        //console.log(tweetText);
        const content = tweetText;
        
        fetch(postWithBotTweetUrl, {
            method: 'POST',
            body: content,
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then((response) => {
            //console.log("post response ", response.status)
            props.handleClose()
        });
    }
    const oncloseWindown = () => {
        //console.log("close ...")
    }
    const postUserTweetContent = () => {
        const content = tweetText;
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
            //console.log("body ", data)
            //console.log("status ", status)
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
            //console.log("error connection ", err)
        })
    }

    if(!props.open && tweetText !== ""){
        //console.log("Closing dialog text and cleaning tweet text");
        setTweetText("");
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

                <DialogContent style={{ height: '507px' }}>

                    <Grid
                        container
                        direction="row">

                            <Grid item xs={8} container direction="column" style={{ paddingRight: "35px", borderRight: "1px solid #CACACA"}}>
                                <Typography variant="h4" style={{ color: "#51A5B2"}}>
                                    {keyword("title_infotmationLink")}
                                </Typography>

                                <Box m={2} />

                                <Typography variant="h6">
                                    {keyword("title_selectedLink")}
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
                                            <Button variant="contained" color="primary" fullWidth onClick={postTweetContent} style={{ color: "white" }} startIcon={<LaptopIcon/>}>
                                                {keyword("tweet_bot")}
                                            </Button>
                                    </Grid>

                                    <Grid item xs={6}>
                                            <Button variant="contained" color="primary" fullWidth onClick={postUserTweetContent} style={{ color: "white" }} startIcon={<PersonOutlineIcon />}>
                                                {keyword("tweet_account")}
                                            </Button>
                                    </Grid>


                                </Grid>


                            </Grid>


                            <Grid item xs={4} container direction="column" style={{ paddingLeft: "35px", display: "flex", overflow: "auto", minHeight: "100%", maxHeight: "472px", flexWrap: "nowrap" }}>
                                <Typography variant="h4" style={{ color: "#51A5B2" }}>
                                    {keyword("title_author")}
                                </Typography>
                                    
                                    <Box m={2} />
                                    {props.selectedURL[0].name &&
                                        <div>
                                        <Typography variant="h6">
                                            {keyword("title_name")}
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
                                                {keyword("title_credibility")}
                                            </Typography>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <DesinformationIcon viewBox="0 0 50 50" width="30" height="30" style={{marginRight: "10px"}}/>
                                                <Typography variant="body1">
                                                    {keyword("desinformation")}
                                                </Typography>

                                            </Grid>
                                            <Box m={1} />
                                        </div>     
                                    
                                    :
                                        <div>

                                            <Typography variant="h6">
                                                {keyword("title_credibility")}
                                            </Typography>
                                            <Grid
                                                container
                                                direction="row"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <FactCheckerIcon viewBox="0 0 50 50" width="30" height="30" style={{ marginRight: "10px" }} />
                                                <Typography variant="body1">
                                                    {keyword("factchecker")}
                                                </Typography>

                                            </Grid>

                                            <Box m={1} />
                                        </div>
                                    }

                                    <Typography variant="h6">
                                        {keyword("title_description")}
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
                                            )) : <Typography variant="body2">{props.selectedURL[0].description}</Typography>}
                                        </List>
                                    </>}

                            </Grid>

                    </Grid>

                <Box m={4} />


                </DialogContent>
                 
                </>
                }
            </Box>
        </Dialog>
        
        </>
    )
}
export default TweetDialog;