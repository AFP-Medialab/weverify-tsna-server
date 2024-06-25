import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import SaveIcon from '@mui/icons-material/Save';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import BigButton from "../../../shared/BigButon/BigButton";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";
import { TWITTERSNA_PATH } from "../../../shared/languages/LanguagePaths";


export default function GexfExport(props) {
   
    const keyword = i18nLoadNamespace(TWITTERSNA_PATH);
    const classes = useMyStyles();
    const gexfExport = useSelector(state => state.twitterSna.gexfExport);
    return (
    
    props.request.userList.length === 0 && props.result &&
    <Card>
        <CustomCardHeader title={"12. " + keyword("export_graph_title")} showHelp={true} helpText={"twittersna_export_graph_tip"} />

        <Box m={3}>
        <Grid container direction="row" 
            >
                <Grid item xs container direction="column" >

                    <Typography variant="h6" style={{marginLeft: "8px"}}>{keyword("interaction_graph_open")} </Typography>
                    {
                        gexfExport && gexfExport.map((gexfRes, index) => {
                            return (
                                <div key={index}>
                                    <Box m={1} />
                                    <Button href={gexfExport ? gexfRes.visualizationUrl : undefined} target="_blank" disableRipple style={{ backgroundColor: 'transparent', textTransform: "none", width:"100%" }} >
                                        <BigButton title={gexfRes.title} subtitle={keyword("interaction_graph_open_subtitle")} icon={<BubbleChartIcon fontSize="large" className={classes.bigButtonIcon} />} />
                                    </Button>
                                </div>
                            )
                        })
                    }

                </Grid>

                

                <Box m={2} style={{ borderRight: '0.1em solid #ECECEC' }}/>

                <Grid item xs container direction="column" >

                        <Typography variant="h6" style={{ marginLeft: "8px" }}>{keyword("interaction_graph_export")} </Typography>
                        {
                            gexfExport && gexfExport.map((gexfRes, index) => {
                                var title = keyword("twittersna_result_download") + " " + gexfRes.title;
                                return (
                                    <div key={index}>
                                        <Box m={1} />
                                        <Button href={gexfExport ? gexfRes.getUrl : undefined} target="_blank" disableRipple style={{ backgroundColor: 'transparent', textTransform: "none", width:"100%" }} >
                                            <BigButton title={title} subtitle={keyword("interaction_graph_export_subtitle")} icon={<SaveIcon fontSize="large" className={classes.bigButtonIcon} />}/>
                                        </Button>
                                    </div>
                                )
                            })
                        }
                </Grid>
            
        </Grid>
                
        </Box>

        <Box pb={2}>
        {
            (!gexfExport && props.result.tweetCount && props.result.tweetCount.count !== "0") &&
            <CircularProgress className={classes.circularProgress} />
        }
        </Box>
        <Box m={1} />
        
    </Card>
    )
}