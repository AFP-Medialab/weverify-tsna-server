import AdvancedTools from './AdvancedTools/AdvancedTools';
import Alert from '@material-ui/lab/Alert';
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import HeaderTool from '../shared/HeaderTool/HeaderTool';
import IconData from '../../images/SVG/DataAnalysis/Data_analysis.svg';
import IconTools from '../../images/SVG/NavBar/Tools.svg'
import React, {useState} from "react";
import Snackbar from '@material-ui/core/Snackbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ToolCard from "./ToolCard"
import Typography from "@material-ui/core/Typography";


import useMyStyles from '../shared/styles/useMyStyles';
import useLoadLanguage from '../shared/hooks/useRemoteLoadLanguage';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

const AllTools = (props) => {
    const router = useRouter();
    const classes = useMyStyles();
    const keyword = useLoadLanguage("/components/NavItems/tools/AllTools.tsv");
    const keywordWarning = useLoadLanguage("/components/Shared/OnWarningInfo.tsv");
    const [openAlert, setOpenAlert] = React.useState(false);
    const userAuthenticated = useSelector(
        (state) => state.userSession && state.userSession.userAuthenticated
    );
    const handleClick = (path, mediaTool, type) => {
        //console.log(type);
        if (type === "lock" || type === "lock and new"){
            if (userAuthenticated){
                //console.log("LOGGED");
                handlePush(path, mediaTool);
            }else{
                setOpenAlert(true);
            }
        }else{
            //console.log("NOT LOGGED");
            handlePush(path, mediaTool);
        }
    };

    const handlePush = (path, mediaTool) => {
        router.push('/'+ path, undefined, { shallow: true })
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };
    
    const toolsData = [];
    const tools = props.tools;
    tools.forEach((value) => {
        if (value.title === "navbar_twitter_sna") {
            value.type = "lock";
            toolsData.push(value);
        }

    });
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div className={classes.all}>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="warning">
                    {keywordWarning("warning_advanced_tools")}
                </Alert>
            </Snackbar>
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center">

                <Grid item xs>
                    <HeaderTool name={keyword("navbar_tools")} icon={<IconTools style={{ fill: "#51A5B2" }} />} />
                </Grid>

                <Grid item>
                    <AdvancedTools />
                </Grid>

            </Grid>
            <Card>
                <Tabs value={value} onChange={handleChange} indicatorColor={'primary'}>
                    <Tab label={
                            <Box mt={1}>
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                >
                                    <Grid item>
                                        <IconData width="45px" height="45px" style={{ fill: "#596977" }} />
                                    </Grid>

                                    <Grid item>
                                        <Box m={1} />
                                    </Grid>

                                    <Grid item>
                                        <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize" }}>{keyword("category_data")}</Typography>
                                    </Grid>

                                </Grid>
                            </Box>
                        } />
                </Tabs>
                <Box m={1} />
                <div style={{minHeight: "340px"}}>
                    <TabPanel value={value} index={0}>
                        <Grid container justifyContent="flex-start" spacing={2} className={classes.toolCardsContainer}>

                            {
                                toolsData.map((value, key) => {
                                    return (
                                        <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "datas", value.type)}>
                                            <ToolCard
                                                name={keyword(value.title)}
                                                description={keyword(value.description)}
                                                icon={value.iconColored}
                                                type={value.type} />
                                        </Grid>
                                    );
                                })
                            }

                        </Grid>
                    </TabPanel>
                </div>
            </Card>
        </div>
    );

};

export default AllTools;