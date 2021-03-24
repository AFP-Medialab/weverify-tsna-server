import { Paper } from "@material-ui/core";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";

import useLoadLanguage from "../../hooks/useRemoteLoadLanguage";
const tsv = "/components/fb/OnClickInfo.tsv";

export default function CsvSnaResults(props) {
  const classes = useMyStyles();
  const keyword = useLoadLanguage(tsv);

  console.log("ICI FB ", JSON.stringify(props.result));
  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanTwitterSnaState())} />
      {<Count result={props.result} keyword={keyword}/>}
    </Paper>
  );
}
