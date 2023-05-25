import {Container} from "@material-ui/core";
import Fade from "@material-ui/core/Fade";
import React from "react";
import {useDispatch} from "react-redux";
import {selectTool} from "../../../redux/actions";
import AllTools from "../AllTools";
import Footer from "../../shared/Footer/Footer"
import TwitterSna from "../../SNA/TwitterSna/TwitterSna"
import CrowdTangleSnaComponent from "../../SNA/CrowdTangleSna/CrowdTangleSnaComponent"
import FactcheckSearch from "../../Search/FactcheckSearch";
import XNetworkSearch from "../../Search/XNetworkSearch"
import useMyStyles from "../../shared/styles/useMyStyles";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import { useRouter } from 'next/router'

const DrawerItem = (props) => {
    const router = useRouter()
    const path = router.query;
    const classes = useMyStyles();

    const drawerItemsContent = [
        {
            content: <AllTools tools={props.drawerItems}/>,
            footer: <div/>
        },
        {
            content: <FactcheckSearch/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <XNetworkSearch/>,
            footer: <Footer type={"afp"}/>
        },
        {
            content: <TwitterSna />,
            footer: <Footer type={"afp-usfd-eudisinfolab"} />
        },
        {
            content: <CrowdTangleSnaComponent />,
            footer:  <Footer type={"afp"}/>
        }
        
        
    ];

    const dispatch = useDispatch();

    //Style elements
    //============================================================================================

    const theme = createTheme({
        overrides: {

            MuiCardHeader: {
                root: {
                    backgroundColor: "#05A9B4",
                },
                title: {
                    color: 'white',
                    fontSize: 20,
                    fontweight: 500,
                }
            },

            MuiTab: {
                wrapper: {
                    fontSize: 12,

                },
                root: {
                    minWidth: "25%!important",
                }
            },
            MuiCard: {
                root: {
                    borderRadius: "10px!important"
                }
            }

        },

        palette: {
            primary: {
                light: '#5cdbe6',
                main: '#05a9b4',
                dark: '#007984',
                contrastText: '#fff',
            },
        },

    });

    return (
            
            props.drawerItems.map((item, index) => {
                if (item.path) {
                    dispatch(selectTool(index));
                    console.log("path ", path)
                   /* return (
                        <Route
                            key={index}
                            path={"/" + item.path + "/:url?/:type?/"}
                            render={() => {
                                    dispatch(selectTool(index));
                                    return (
                                        <Container key={index} className={classes.noMargin} maxWidth={false}>
                                            <Fade in={true}>
                                                <div>
                                                    <ThemeProvider theme={theme}>
                                                        {drawerItemsContent[index].content}
                                                        {drawerItemsContent[index].footer}
                                                    </ThemeProvider>
                                                </div>
                                            </Fade>
                                        </Container>
                                    )
                                }
                            }
                        />
                    );*/
                }
                return null;
            })
    );
};
export default DrawerItem;