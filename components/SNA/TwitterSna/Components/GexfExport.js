import { Card } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import SaveIcon from '@material-ui/icons/Save';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import BigButton from "../../../shared/BigButon/BigButton";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";

//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

export default function GexfExport(props) {
   
    const keyword = useLoadLanguage(tsv);
    const classes = useMyStyles();
    const request = useSelector(state => state.twitterSna.request);

    const gexfExport = useSelector(state => state.twitterSna.gexfExport);

    const [state, setState] = useState(
        {
            result: props.result        
        }
    );
    return (
    
    props.request.userList.length === 0 && props.result &&
    <Card>
        <CustomCardHeader title={keyword("export_graph_title")} showHelp={true} helpText={"twittersna_export_graph_tip"} />

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