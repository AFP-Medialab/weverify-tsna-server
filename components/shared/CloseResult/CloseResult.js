import CancelIcon from '@material-ui/icons/Cancel';
import React from "react";
import useMyStyles from "../styles/useMyStyles";

const CloseResult = (props) => {
    const classes = useMyStyles();
    return (
        <div className={classes.closeResult}>
            <CancelIcon
                color={"secondary"}
                fontSize={"medium"}
                onClick={() => props.onClick()}
            />
        </div>
    )
};
export default CloseResult;