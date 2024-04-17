import React, { Component } from 'react';
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export class HeaderTool extends Component {

    render() {

        var name = this.props.name;
        var description = this.props.description;
        var icon = this.props.icon;

        return(

            <div>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    style={{flexWrap: "nowrap"}}
                >

                    {icon}
                    <Typography variant="h4" color={'primary'}>
                        {name}
                    </Typography>

                </Grid>

                <Box ml={1}>
                    <Typography variant="body1">
                        {description}
                    </Typography>
                </Box>
                <Box m={3} />

            </div>

        )
    }


} 
export default HeaderTool;