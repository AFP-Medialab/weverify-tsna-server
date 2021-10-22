import { Card, Paper } from "@material-ui/core";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import React, {useEffect, useState} from 'react';
import SaveIcon from '@material-ui/icons/Save';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import BigButton from "../../../shared/BigButon/BigButton";
import { BurstMode } from "@material-ui/icons";

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

                    <Typography variant="h6">Open</Typography>
                    {
                        gexfExport && gexfExport.map((gexfRes, index) => {
                            return (
                                <div>
                                    <Box m={1} />
                                    <Button href={gexfExport ? gexfRes.visualizationUrl : undefined} disableRipple style={{ backgroundColor: 'transparent', textTransform: "none", width:"100%" }} >
                                        <BigButton title={gexfRes.title} subtitle="Subtitle" icon={<BubbleChartIcon fontSize="large" className={classes.bigButtonIcon} />} />
                                    </Button>
                                </div>
                            )
                        })
                    }

                </Grid>

                

                <Box m={2} style={{ borderRight: '0.1em solid #ECECEC' }}/>

                <Grid item xs container direction="column" >

                    <Typography variant="h6">Download</Typography>
                        {
                            gexfExport && gexfExport.map((gexfRes, index) => {
                                var title = keyword("twittersna_result_download") + " " + gexfRes.title;
                                return (
                                    <div>
                                        <Box m={1} />
                                        <Button href={gexfExport ? gexfRes.getUrl : undefined} disableRipple style={{ backgroundColor: 'transparent', textTransform: "none", width:"100%" }} >
                                            <BigButton title={title} subtitle="Subtitle" icon={<SaveIcon fontSize="large" className={classes.bigButtonIcon} />}/>
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