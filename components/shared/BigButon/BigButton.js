import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from 'react';
import useMyStyles from "../styles/useMyStyles";

export default function BigButton(props) {

    const classes = useMyStyles();

    var title = props.title;
    var subtitle = props.subtitle;
    var icon = props.icon;

    return (

        <div style={{width: "100%"}}>

            <Box p={2} className={classes.bigButtonDiv} href={props.href}>
                <Grid
                    container
                    direction="row"
                    alignItems="center"

                >
                    <Grid item>
                        <Box ml={1} mr={3}>
                            {icon}
                        </Box>

                    </Grid>

                    <Grid item>
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            <Grid item>
                                <Typography variant="body1" style={{ fontWeight: 600 }}>{title}</Typography>
                            </Grid>

                            <Box mt={1} />

                            <Grid item>
                                <Typography variant="body1">{subtitle}</Typography>
                            </Grid>

                        </Grid>
                    </Grid>

                </Grid>
            </Box>
            

        </div>

    );



}
