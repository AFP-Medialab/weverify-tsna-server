import React, { Component } from 'react';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import useMyStyles from "../styles/useMyStyles";
import IconHelp from "../../../images/SVG/CardHeader/Help.svg";
import IconCSV from "../../../images/SVG/CardHeader/CSV.svg";
import IconPNG from "../../../images/SVG/CardHeader/PNG.svg";
import IconSVG from "../../../images/SVG/CardHeader/SVG.svg";
import IconNodes from "../../../images/SVG/CardHeader/Nodes.svg";
import IconEdges from "../../../images/SVG/CardHeader/Edges.svg";
import { CardHeader, IconButton, Popover } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import { TW_SNA_TYPE } from "../hooks/SnaTypes";

export default function CustomCardHeader(props) {

    const classes = useMyStyles();
    const sna = { type: TW_SNA_TYPE, tsv: "/components/NavItems/tools/TwitterSna.tsv", tsvInfo: "/components/Shared/OnClickInfo.tsv" };
    var keyword = useLoadLanguage(sna.tsvInfo);

    var title = props.title;
    var id = props.id;
    var showHelp = props.showHelp;
    var showCSV = props.showCSV;
    var showPNG = props.showPNG;
    var showSVG = props.showSVG;
    var showNodes = props.showNodes;
    var showEdges = props.showEdges;
    var helpText = props.helpText;
    var showSpecialCSV = props.showSpecialCSV;

    
    const [anchorHelpPopover, setAnchorHelpPopover] = React.useState(null);
    const openHelpPopover = Boolean(anchorHelpPopover);
    const helpPopover = openHelpPopover ? 'simple-popover' : undefined;

    function clickHelpPopover(event) {
        setAnchorHelpPopover(event.currentTarget);
    }

    function closeHelpPopover() {
        setAnchorHelpPopover(null);
    }
    

    return(

        <div>
            <CardHeader
                className={classes.headerCard}
                title={
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}>

                        <Grid item xs>
                            <span >{title}</span>
                        </Grid>


                        {showNodes &&
                            props.functionNodes
                        }

                        {showEdges &&
                            props.functionEdges
                        }

                        {showSpecialCSV &&
                            props.functionSpecialCSV
                        }


                        {showCSV &&
                            <Grid item>
                                <IconButton onClick={props.functionCSV}>
                                    <IconCSV />
                                </IconButton>
                            </Grid>
                        }

                        {showPNG &&
                            <Grid item>
                                <IconButton onClick={props.functionPNG}>
                                    <IconPNG />
                                </IconButton>
                            </Grid>
                        }

                        {showSVG &&
                            <Grid item>
                                <IconButton onClick={props.functionSVG}>
                                    <IconSVG />
                                </IconButton>
                            </Grid>
                        }

                        {showHelp &&
                            <Grid item>
                                <IconButton onClick={clickHelpPopover}>
                                    <IconHelp />
                                </IconButton>

                                <Popover
                                    id={helpPopover}
                                    open={openHelpPopover}
                                    anchorEl={anchorHelpPopover}
                                    onClose={closeHelpPopover}
                                    PaperProps={{
                                        style: {
                                            width: '300px',
                                            fontSize: 14
                                        },
                                    }}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}>

                                    <Box p={3}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="stretch">

                                            <Typography variant="h6" gutterBottom>
                                                {"What is this?"}
                                            </Typography>

                                        <CloseIcon onClick={closeHelpPopover} />
                                        </Grid>

                                        <Box m={1} />
                                        <Typography variant="body2">
                                            {keyword(helpText)}
                                        </Typography>

                                    </Box>

                                </Popover>
                            </Grid>
                        }

                    </Grid>
                    }
                aria-controls={""}
                id={id}
            />

            

        </div>

    );
    


} 