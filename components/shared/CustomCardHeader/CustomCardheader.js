import { CardHeader, IconButton, Popover } from '@material-ui/core';
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import IconCSV from "../../../images/SVG/CardHeader/CSV.svg";
import IconHelp from "../../../images/SVG/CardHeader/Help.svg";
import IconPNG from "../../../images/SVG/CardHeader/PNG.svg";
import IconSVG from "../../../images/SVG/CardHeader/SVG.svg";
import { TW_SNA_TYPE } from "../hooks/SnaTypes";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import useMyStyles from "../styles/useMyStyles";

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
                                            {keyword("whatisthis")}
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
