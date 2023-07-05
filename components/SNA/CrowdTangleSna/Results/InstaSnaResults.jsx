import { Paper } from "@material-ui/core";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";
import { useDispatch } from "react-redux";
import { cleanCsvSnaState } from "../../../../redux/actions/tools/crowdTangleSnaActions";
import dynamic from "next/dynamic";
const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {
  ssr: false,
});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {
  ssr: false,
});

export default function InstaSnaResults(props) {
  const dispatch = useDispatch();
  const classes = useMyStyles();

  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
      {
        <Count
          result={props.result}
          //onClickInfoLabel={"insta_sna_tweetnb_tip"}
        />
      }
      {props.result.histogram && (
        <PlotTimeLine
          result={props.result}
          // onClickInfoLabel={"insta_sna_tweetnb_tip"}
        />
      )}
      {props.result && props.result.pieCharts && (
        <PlotPieChart
          result={props.result}
          // onClickInfoLabel={"insta_sna_tweetnb_tip"}
        />
      )}
    </Paper>
  );
}
