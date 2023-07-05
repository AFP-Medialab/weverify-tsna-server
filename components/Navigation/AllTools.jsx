import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Typography } from "@mui/material";
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/router';
import React from "react";
import { useSelector } from 'react-redux';
import IconData from '../../images/SVG/DataAnalysis/Data_analysis.svg';
import IconSearch from '../../images/SVG/Search/Search.svg'
import IconTools from '../../images/SVG/NavBar/Tools.svg';
import HeaderTool from '../shared/HeaderTool/HeaderTool';
import useLoadLanguage from '../shared/hooks/useRemoteLoadLanguage';
import useMyStyles from '../shared/styles/useMyStyles';
import AdvancedTools from './AdvancedTools/AdvancedTools';
import ToolCard from "./ToolCard";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
    const keywordNavbar = useLoadLanguage("/components/NavBar.tsv");
    const keywordWarning = useLoadLanguage("/components/Shared/OnWarningInfo.tsv");
    const [openAlert, setOpenAlert] = React.useState(false);
    const userAuthenticated = useSelector(
        (state) => state.userSession && state.userSession.userAuthenticated
    );
    const role = useSelector((state) => state.userSession.user.roles);
    const betaTester = role.includes('BETA_TESTER')

    const handleClick = (path, mediaTool, restrictions) => {
        //console.log(type);
         if (restrictions !== undefined && restrictions.includes("lock")) {
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
    const toolsSearch = [];
    const tools = props.tools;
    //console.log("tools ", tools);
    /*tools.forEach((value) => {
        if (value.title === "navbar_twitter_sna") {
            value.type = "lock";
        }
        toolsData.push(value);

    });*/

    tools.forEach((value) => {
        if (value.type === keywordNavbar("navbar_category_search")) {
            toolsSearch.push(value);
        }

        if (value.type === keywordNavbar("navbar_category_data")) {
            toolsData.push(value);
        }

    })
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const theme = createTheme(
    {
        overrides:{
            MuiTab:{
                root: {
                    maxWidth: "290px"
                }
            }
        }
    }
    )

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
                    <HeaderTool name={keyword("navbar_tools")} icon={<IconTools width="45px" height="45px" style={{ fill: "#51A5B2" }} />} />
                </Grid>

                <Grid item>
                    <AdvancedTools />
                </Grid>

            </Grid>
            <Card>
                <Tabs value={value} onChange={handleChange} indicatorColor={'primary'}>
                    <ThemeProvider theme={theme}>
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
                                    <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize"}}>{keyword("category_data")}</Typography>
                                </Grid>

                            </Grid>
                        </Box>
                    } />
                    </ThemeProvider>
                    <Tab label={
                        <Box mt={1}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                            >
                                <Grid item>
                                    <IconSearch width="40px" height="40px" style={{ fill: "#596977" }} />
                                </Grid>

                                <Grid item>
                                    <Box m={1} />
                                </Grid>

                                <Grid item>
                                    <Typography variant="h6" style={{ color: "#596977", textTransform: "capitalize" }}>{keyword("category_search")}</Typography>
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
                                        <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "datas", value.toolRestrictions)}>
                                            <ToolCard
                                                name={keyword(value.title)}
                                                description={keyword(value.description)}
                                                icon={value.iconColored}
                                                iconsAttributes={value.icons}  />
                                        </Grid>
                                    );
                                })
                            }

                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container justifyContent="flex-start" spacing={2} className={classes.toolCardsContainer}>

                            {
                                toolsSearch.map((value, key) => {
                                    var element = 
                                        <Grid className={classes.toolCardStyle} item key={key} onClick={() => handleClick(value.path, "search", value.toolRestrictions)}>
                                            <ToolCard
                                                name={keyword(value.title)}
                                                description={keyword(value.description)}
                                                icon={value.iconColored}
                                                iconsAttributes={value.icons} />
                                        </Grid>
                                    if (value.toolRestrictions.includes("beta")) {
                                        if (betaTester) {
                                            return (
                                                element
                                            )
                                        } else {
                                            return (
                                                null
                                            )
                                        }
                                    } else {
                                        return (
                                            element
                                        )
                                    }
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