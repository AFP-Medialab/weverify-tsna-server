import { Paper } from "@material-ui/core";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";
import { useDispatch} from "react-redux";
import {cleanCsvSnaState} from "../../../../redux/actions/tools/csvSnaActions"




export default function CsvSnaResults(props) {
  const dispatch = useDispatch();
  const classes = useMyStyles();

  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
      {<Count result={props.result} onClickInfoLabel={"insta_sna_tweetnb_tip"}/>}
    </Paper>
  );
}
