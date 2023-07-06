import React from "react";
import Box from "@mui/material/Box";
import useMyStyles from "../styles/useMyStyles";

function CustomTitle(props) {
  const classes = useMyStyles();
  return <Box className={classes.customTitle}>{props.text}</Box>;
}
export default CustomTitle;
