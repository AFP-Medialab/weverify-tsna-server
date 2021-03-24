import { Paper } from "@material-ui/core";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";
import { useDispatch} from "react-redux";
import {cleanCsvSnaState} from "../../../../redux/actions/tools/csvSnaActions"

import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";


export default function CsvSnaResults(props) {
  const classes = useMyStyles();
  const dispatch = useDispatch();


  console.log("ICI FB ", JSON.stringify(props.result));
  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
      {<Count result={props.result}  onClickInfoLabel={"fb_sna_tweetnb_tip"} />}
    </Paper>
  );
}
