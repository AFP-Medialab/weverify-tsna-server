import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import { useDispatch, useSelector } from "react-redux";
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import React from "react";
import AllTools from './AllTools';
import Footer from '../shared/Footer/Footer';
import Alert from "@material-ui/lab/Alert";
import AppBar from '@material-ui/core/AppBar';
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import IconButton from '@material-ui/core/IconButton';
import useLoadLanguage from '../shared/hooks/useRemoteLoadLanguage';
import CsvSnaIcon from "../../images/SVG/DataAnalysis/CSV_SNA.svg";
import CsvSnaIconBig from "../../images/SVG/DataAnalysis/CSV_SNA_big.svg";
import TwitterSnaIcon from "../../images/SVG/DataAnalysis/Twitter_sna.svg";
import TwitterSnaIconBig from "../../images/SVG/DataAnalysis/Twitter_sna_big.svg";
import LogoWeVerify2 from "../../images/SVG/NavBar/WeVerify.svg"
import LogoInvid2 from "../../images/SVG/NavBar/InVID.svg"
import Toolbar from '@material-ui/core/Toolbar';
import FactcheckIcon from "../../images/SVG/Search/Factcheck.svg";
import XnetworkIcon from "../../images/SVG/Search/Xnetwork.svg"
import ToolsIcon from "../../images/SVG/NavBar/Tools.svg"
import AboutIcon from "../../images/SVG/NavBar/About.svg"
import DataIcon from "../../images/SVG/DataAnalysis/Data_analysis.svg"
import SearchIcon from "../../images/SVG/Search/Search.svg"
import useMyStyles from '../shared/styles/useMyStyles';
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import { useRouter } from 'next/router';
import { Collapse, ListSubheader, Tab, Tabs } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Languages from '../shared/languages/languages';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import TabItem from "../Navigation/TabItem/TabItem"


function a11yProps(index) {
  return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}


const NavBar = () => {
  const keyword = useLoadLanguage("/components/NavBar.tsv");
  const keywordWarning = useLoadLanguage("/components/Shared/OnWarningInfo.tsv");
  const tabValue = useSelector(state => state.nav);
  const drawerValue = useSelector(state => state.tool.selected);

  const classes = useMyStyles();
  const [openAlert, setOpenAlert] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [classWidthToolbar, setClassWidthToolbar] = React.useState(classes.drawerWidth);

  const drawerRef = React.createRef();
  const router = useRouter();
  const [classListHeading, setClassListHeading] = React.useState(classes.drawerListHeadingLeft);
  const userAuthenticated = useSelector(
    (state) => state.userSession && state.userSession.userAuthenticated
);

  
  const changeValue = (newValue, newValueType, mediaTool) => {

    if (newValueType === "TOOL"){

        if (newValue.toolRestrictions !== undefined && newValue.toolRestrictions.includes("lock")) {
            if (userAuthenticated) {
              router.push({
                    pathname: "/" + newValue.path,
                    state: { media: mediaTool }
                })
            } else {
                setOpenAlert(true);
            }
        } else { 
          router.push({
                pathname: "/" + newValue.path,
                state: { media: mediaTool }
            })
        }


    } else if (newValueType === "OTHER"){
      router.push("/" + newValue.path) 
    }

};

  const handleDrawerToggle = () => {
    setOpen(!open);

    if (classWidthToolbar === classes.drawerWidth){
        setClassWidthToolbar(classes.drawerWidthClose);
        setTimeout(function () {
            setClassListHeading(classes.drawerListHeadingCenter);
        }, 194);
        
    }else{
        setClassWidthToolbar(classes.drawerWidth);
        setClassListHeading(classes.drawerListHeadingLeft);
        
    }

};
  const handleCloseAlert = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }
      setOpenAlert(false);
  };
  const handleImageClick = () => {
    router.push('/', undefined, { shallow: true })
  };
  const handleChange = (event, newValue) => {
    if (tabItems[newValue].path === "tools")
      router.push("/" + drawerItems[newValue].path);
    else
      router.push("/" + tabItems[newValue].path)
};

const drawerItems = [
  {
    id: 1,
    title: "navbar_tools",
    icon: (tabValue === 0 && drawerValue === 0) ? <ToolsIcon width="40px" height="40px" style={{ fill: "#51A5B2" }} title={keyword("navbar_tools")}/>
        : <ToolsIcon width="40px" height="40px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_tools")}/>,
    tsvPrefix: "all",
    path: "",
    pathGroup: "TOOL",
    type: keyword("navbar_category_general"),
    typeId: 0,
    icons: [],
    toolRestrictions: [],
},
{
  id: 2,
  title: "navbar_twitter_sna",
  description: "navbar_twitter_sna_description",
  icon: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title="Twitter SNA"/>,
  iconColored: <TwitterSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="Twitter SNA"/>,
  iconBig: <TwitterSnaIconBig width="75px" height="75px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />,
  tsvPrefix: "twitter_sna",
  path: "twitterSna",
  type: keyword("navbar_category_data"),
  icons: ["lock"],
  toolRestrictions: ["lock"],
},
{
  id: 3,
  title: "navbar_csv_sna",
  description: "navbar_csv_sna_description",
  icon: <CsvSnaIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title="CSV SNA"/>,
  iconColored: <CsvSnaIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title="CSV SNA"/>,
  iconBig: <CsvSnaIconBig width="75px" height="75px" style={{ fill: "#51A5B2" }} title="Twitter SNA" />,
  tsvPrefix: "csv_sna",
  path: "csvSna",
  type: keyword("navbar_category_data"),
  icons: [],
  toolRestrictions: []
},
{
  id: 4,
  title: "navbar_factcheck",
  description: "navbar_factcheck_description",
  icon: <FactcheckIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_factcheck")}/>,
  iconColored: <FactcheckIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_factcheck")}/>,
  tsvPrefix: "factcheck",
  path: "factcheck",
  pathGroup: "TOOL",
  type: keyword("navbar_category_search"),
  icons: ["new"],
  toolRestrictions: []
},
{
  id: 5,
  title: "navbar_xnetwork",
  description: "navbar_xnetwork_description",
  icon: <XnetworkIcon width="45px" height="45px" style={{ fill: "#4c4c4c" }} title={keyword("navbar_xnetwork")}/>,
  iconColored: <XnetworkIcon width="45px" height="45px" style={{ fill: "#51A5B2" }} title={keyword("navbar_xnetwork")}/>,
  tsvPrefix: "xnetwork",
  path: "xnetwork",
  pathGroup: "TOOL",
  type: keyword("navbar_category_search"),
  typeId: 3,
  icons: ["new"],
  toolRestrictions: []
}
];
//Search items
const drawerItemsSearch = drawerItems.filter(item => item.type === keyword("navbar_category_search"));
const [openListSeach, setOpenListSeach] = React.useState(false);
const [classBorderSearch, setClassBorderSearch] = React.useState(null);

const handleClickListSearch = () => {
  setOpenListSeach(!openListSeach);
  if (!openListSeach) {
      setClassBorderSearch(classes.drawerCategoryBorder);
  } else {
      setClassBorderSearch(null);
  }
};

//Data items
const drawerItemsData = drawerItems.filter(item => item.type === keyword("navbar_category_data"));
const [openListData, setOpenListData] = React.useState(false);
const [classBorderData, setClassBorderData] = React.useState(null);

const handleClickListData = () => {
  setOpenListData(!openListData);
  if (!openListData) {
      setClassBorderData(classes.drawerCategoryBorder);
  } else {
      setClassBorderData(null);
  }
};
  const themeFab = createTheme({
    palette: {
        primary: {
            light: '#5cdbe6',
            main: '#05a9b4',
            dark: '#007984',
            contrastText: '#fff',
        },
    },
    overrides: {
        MuiAppBar:{
            colorPrimary:{
                backgroundColor: "#ffffff",
            },
            root:{
                zIndex: 1300,
                height: "87px",
                boxShadow: "none",
                paddingTop: "12px"
            }
        },
        MuiListItem:{
            gutters:{
                paddingLeft: "26px"
            },
            
        },
        MuiAutocomplete:{
            popupIndicatorOpen: {
                transform: "none!important"
            },
            popper:{
                zIndex: 99999
            }
            
        },
        MuiCard: {
            root: {
                borderRadius: "10px!important"
            }
        }
        
        
    }
});
const tabItems = [
  {
      title: "navbar_tools",
      icon: (tabValue === 0 && drawerValue === 0) ? <ToolsIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
          : <ToolsIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
      content: <div />,
      path: "tools",
      pathGroup: "OTHER",
      footer: <div />,
      typeTab: "verification",
      type: keyword("navbar_category_general"),
      typeId: 0,
  },
  {
      title: "navbar_about",
      icon: (tabValue === 1) ? <AboutIcon width="30px" height="30px" style={{ fill: "#51A5B2" }} />
          : <AboutIcon width="30px" height="30px" style={{ fill: "#4c4c4c" }} />,
      content: <div />,
      path: "about",
      pathGroup: "OTHER",
      footer: <Footer type={"afp"} />,
      typeTab: "more",
      type: keyword("navbar_category_general"),
      typeId: 0,
  },

];
  
  const listItems = [ 
    {
        title: keyword("navbar_category_search"),
        icon: <SearchIcon style = {{ fill: "#4c4c4c" }} title={keyword("navbar_category_search")}/>,
        list: drawerItemsSearch,
        variableOpen: openListSeach,
        setVariableOpen: setOpenListSeach,
        functionHandleClick: handleClickListSearch,
        classBorder: classBorderSearch,
    },
    {
        title: keyword("navbar_category_data"),
        icon: <DataIcon style={{ fill: "#4c4c4c" }} title={keyword("navbar_category_data")}/>,
        list: drawerItemsData,
        variableOpen: openListData,
        setVariableOpen: setOpenListData,
        functionHandleClick: handleClickListData,
        classBorder: classBorderData,
    },


];
  const toolsItem = drawerItems.find(data => data.title === 'navbar_tools');
  const drawerItemsMore = tabItems.filter(item => item.typeTab === "more");
  return (
    <div className={classes.flex}>
      <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
          <Alert onClose={handleCloseAlert} severity="warning">
              {keywordWarning("warning_advanced_tools")}
          </Alert>
      </Snackbar>
      <ThemeProvider theme={themeFab}>
      {
        <AppBar position="fixed">
           <Toolbar className={classes.toolbar} style={{ borderBottom: "solid 1px #dedbdb"}}>
            <LogoWeVerify2
                style={{ height: "35px", width: "auto" }}
                alt="logo"
                className={classes.logoLeft}
                onClick={handleImageClick} />
             <LogoInvid2
                style={{ height: "30px", width: "auto" }}
                alt="logo"
                className={classes.logoRight}
                onClick={handleImageClick} />
            <Box m={3}></Box>
            <div className={classes.grow} />

            <Tabs
                value={tabValue}
                variant="scrollable"
                onChange={handleChange}
                scrollButtons="on"
                indicatorColor="primary"
                textColor="primary"
                aria-label="scrollable force tabs example"
                style={{ marginRight: "30px" }}
                TabIndicatorProps={{
                    style: { display: 'none' }
                }}
                >
                {
                    tabItems.map((item, index) => {
                      console.log("index   .... ", item)
                        return <Tab key={index}
                            label={keyword(item.title)}
                            icon={item.icon}
                            className={classes.tab}
                            {...a11yProps(index)} />
                    })
                }
            </Tabs>
            <div className={classes.grow} />
            <Languages />
           </Toolbar>
        </AppBar>
      }
       <Drawer 
          variant="permanent"
          className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
          })}
          classes={{
              paper: clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
              }),
          }}
          ref={drawerRef}        
          open={open}>
            <List style={{marginTop: "80px", paddingLeft: "4px"}}>
              <ListSubheader style={{ paddingTop: "16px", paddingBottom: "16px", backgroundColor: "#ffffff" }} className={classListHeading}>
                  <Typography type="body1" style={{ fontWeight: "500", fontSize: "10px", color: "#B0B0B0", textTransform: "uppercase" }}>{open ? keyword("navbar_verification") : keyword("navbar_verification_short")}</Typography>
              </ListSubheader>
              <ListItem button onClick={() => changeValue(toolsItem, "TOOL")} >
                <ListItemIcon color="primary.main">
                    {
                        <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                            {toolsItem.icon}
                        </IconButton>
                    }
                </ListItemIcon>
                <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(toolsItem.title)}</Typography>} />
              </ListItem>
              {
                listItems.map((item, key) => {
                    const element = 
                        <div style={{ margin: "-5px -15px -5px -15px" }}>
                            <ListItem button onClick={item.functionHandleClick}>

                                <ListItemIcon color="primary.main">
                                    <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>{item.icon}</IconButton>
                                </ListItemIcon>

                                <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{item.title}</Typography>} />

                                {openListData ? <ExpandLess /> : <ExpandMore />}

                            </ListItem>

                            <Collapse in={item.variableOpen} timeout="auto" unmountOnExit>

                                <List component="div" disablePadding>
                                    {
                                        item.list.map((itemList, keyList) => {

                                            var element = 
                                                <ListItem button key={keyList} onClick={() => changeValue(itemList, "TOOL")} >
                                                    {
                                                        open ?
                                                            <ListItemIcon color="primary.main" className={classes.drawerListNested}>
                                                                {
                                                                    <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                                                        {itemList.icon}
                                                                    </IconButton>
                                                                }
                                                            </ListItemIcon>
                                                            :
                                                            <ListItemIcon color="primary.main">
                                                                {
                                                                    <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                                                        {itemList.icon}
                                                                    </IconButton>
                                                                }
                                                            </ListItemIcon>

                                                    }
                                                    <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(itemList.title)}</Typography>} />
                                                </ListItem>
                                            
                                            if (itemList.toolRestrictions.includes("beta")){
                                                if(betaTester){
                                                    return (
                                                        element
                                                    )
                                                } else {
                                                    return (
                                                        null
                                                    )
                                                }
                                            }else{
                                                return (
                                                    element
                                                )
                                            }
                                            
                                        })
                                    }
                                </List>

                            </Collapse>
                        
                        </div>

                    return(
                        <div key={key}>

                            {open ? 
                                <div style={{ margin: "5px 18px 5px 14px", borderRadius: "10px" }}>
                                    {element}
                                </div>
                                :
                                <div style={{ margin: "14px 18px 14px 14px", borderRadius: "10px" }} className={item.classBorder}>
                                    {element}
                                </div>
                            }
                            
                        </div>
                        
                        
                    )
                })
            }
            <Box m={2} />

            <ListSubheader style={{ paddingTop: "16px", paddingBottom: "16px" }} className={classListHeading} >
                <Typography type="body1" style={{ fontWeight: "500", fontSize: "10px", color: "#B0B0B0", textTransform: "uppercase" }}>{open ? keyword("navbar_more") : keyword("navbar_more_short")}</Typography>
            </ListSubheader>

            {
                drawerItemsMore.map((item, key) => {
                    return (
                        <ListItem button key={key} onClick={() => changeValue(item, "OTHER")}>
                            <ListItemIcon color="primary.main">
                                {
                                    <IconButton className={classes.customAllToolsButton} style={{ "width": 24, "height": 24 }}>
                                        {item.icon}
                                    </IconButton>
                                }
                            </ListItemIcon>
                            <ListItemText primary={<Typography type="body1" className={classes.drawerListText}>{keyword(item.title)}</Typography>} />
                        </ListItem>

                    )
                })
            }
           </List>
           <div className={classes.grow}/>
                
                
            <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", position: "sticky", bottom: "0px", backgroundColor:"#ffffff", zIndex: "9" }}>
                <Box p={1}><Divider /></Box>
                <Button
                    onClick={handleDrawerToggle}
                    style={{ alignSelf: "center" }}
                    startIcon={!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}

                >
                    {open ? keyword("navbar_collapse") : ""}
                </Button>
                <Box m={1}/>
            </div>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} id="back-to-top-anchor" />
          <TabItem className={classes.noMargin} tabItems={tabItems} drawerItems={drawerItems} />
          
        </main>
      </ThemeProvider>
    </div>
  );
};

export default NavBar;
