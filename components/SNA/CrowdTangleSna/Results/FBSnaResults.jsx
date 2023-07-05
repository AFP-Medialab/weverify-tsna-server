import { Paper } from "@material-ui/core";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { cleanCsvSnaState } from "../../../../redux/actions/tools/crowdTangleSnaActions";
import CloseResult from "../../CloseResult/CloseResult";
import useMyStyles from "../../styles/useMyStyles";
import Count from "../Components/Count";
const PlotTimeLine = dynamic(import("../Components/PlotTimeLine"), {
  ssr: false,
});
const PlotPieChart = dynamic(import("../Components/PlotPieChart"), {
  ssr: false,
});

export default function CsvSnaResults(props) {
  const classes = useMyStyles();
  const dispatch = useDispatch();

  return (
    <Paper className={classes.root}>
      <CloseResult onClick={() => dispatch(cleanCsvSnaState())} />
      {
        <Count
          result={props.result}
          //onClickInfoLabel={"fb_sna_tweetnb_tip"}
        />
      }

      {props.result.histogram && (
        <PlotTimeLine
          result={props.result}
          // onClickInfoLabel={"fb_sna_tweetnb_tip"}
        />
      )}

      {props.result && props.result.pieCharts && (
        <PlotPieChart
          result={props.result}
          // onClickInfoLabel={"fb_sna_tweetnb_tip"}
        />
      )}
    </Paper>
  );
}
