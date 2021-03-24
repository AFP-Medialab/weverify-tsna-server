import { Paper } from "@material-ui/core";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";

import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
const tsv = "";

export default function CsvSnaResults(props) {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(tsv);

  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
      {<Count result={props.result} onClickInfoLabel={"insta_sna_tweetnb_tip"}/>}
    </Paper>
  );
}
