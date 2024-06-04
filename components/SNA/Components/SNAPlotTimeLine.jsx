import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import OnClickInfo from "../../shared/OnClickInfo/OnClickInfo";
import Typography from "@mui/material/Typography";
import useMyStyles from "../../shared/styles/useMyStyles";

export const SNAPlotTimeLine = (histogram, title, onHistogramClick, keyword) => {
    const [histoVisible, setHistoVisible] = useState(true);
    const classes = useMyStyles();
    
return (
    <Accordion expanded={histoVisible} onChange={() => setHistoVisible(!histoVisible)}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={"panel0a-content"}
            id={"panel0a-header"}
        >
            <Typography className={classes.heading}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
            {
            <div style={{ width: '100%', }}>
                {(histogram.json && (histogram.json.length === 0) &&
                    <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>)}
                {(histogram.json && histogram.json.length !== 0) &&
                <Plot useResizeHandler
                    style={{ width: '100%', height: "450px" }}
                    data={histogram.json}
                    layout={histogram.layout}
                    config={histogram.config}
                    onClick={(e) => onHistogramClick(e)}
                    onPurge={(a, b) => {
                    }}
                />
                }
                <Box m={1} />
                <OnClickInfo keyword={"twittersna_timeline_tip"}/>
                <Box m={2} />
                
                {
                    
                    histoPosts &&
                    <HistoTweetsTable 
                        data={histoPosts} 
                        from={from} 
                    />
                    
                }
            </div>
            }
            {
            histogram === undefined &&
            <CircularProgress className={classes.circularProgress} />
            }
        </AccordionDetails>
    </Accordion>
    );
}