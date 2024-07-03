import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { IconButton } from "@mui/material";
//import { select } from 'd3-selection';
import Plotly from 'plotly.js-dist';
import React, { useCallback, useEffect, useState } from 'react';
import { CSVLink } from "react-csv";
import { useSelector } from "react-redux";
//import ReactWordcloud from "react-wordcloud";
import { saveSvgAsPng } from 'save-svg-as-png';
import "tippy.js/animations/scale.css";
import "tippy.js/dist/tippy.css";
import IconCSV from "../../../../images/SVG/CardHeader/CSV.svg";
import CustomCardHeader from "../../../shared/CustomCardHeader/CustomCardheader";
import useMyStyles from "../../../shared/styles/useMyStyles";
import { displayPosts } from "../../../SNA/lib/displayTweets";
import PostViewTable from "../../Components/PostViewTable";
import {widgetSimpleFilename} from "../Hooks/tsnaUtils";
import { i18nLoadNamespace } from "../../../shared/languages/i18nLoadNamespace";
import { TWITTERSNA_PATH } from "../../../shared/languages/LanguagePaths";
import { scaleLog } from "@visx/scale";
import { Wordcloud } from "@visx/wordcloud";
import { Text } from "@visx/text";

export default function cloudChart (props) {

    const sna = useSelector(state => state.sna)
    const keyword = i18nLoadNamespace(TWITTERSNA_PATH);
    const classes = useMyStyles();

    const [filesNames, setfilesNames] = useState(null);
    const [cloudTweets, setCloudTweets] = useState(null);

    const [state, setState] = useState(
        {
            result: props.result        
        }
    );
    useEffect(() => {
        setState({
            ...state,
            result: props.result,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.result.cloudChart]);

    useEffect(() => {
        setCloudTweets(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.request])

    //Set the file name for wordsCloud export
    useEffect(() => {
        setfilesNames('WordCloud_' + widgetSimpleFilename(props.request));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.request), props.request]);

    const CSVheaders = [{ label: keyword('twittersna_result_word'), key: "word" }, { label: keyword("twittersna_result_nb_occ"), key: "nb_occ" }, { label: keyword("twittersna_result_entity"), key: "entity" }];

    function getCSVData() {
        if (!props.result.cloudChart.json)
            return "";
        let csvData = props.result.cloudChart.json.map(wordObj => { return { word: wordObj.text, nb_occ: wordObj.value, entity: wordObj.entity } });
        return csvData;
    };

    function filterTweetsGivenWord(word) {
        let filteredTweets = props.result.tweets.filter(function (tweetObj) {
            return tweetObj._source.full_text.toLowerCase().match(new RegExp('(^|((.)*[.()0-9!?\'’‘":,/\\%><«» ^#]))' + word + '(([.()!?\'’‘":,/><«» ](.)*)|$)', "i"));
        });
        return filteredTweets;
    }

    function click(word) {
        let selectedWord = word;
        let filteredTweets = filterTweetsGivenWord(selectedWord);
        let dataToDisplay = displayPosts(filteredTweets, keyword);
        dataToDisplay["selected"] = selectedWord;
        setCloudTweets(dataToDisplay);
    }
    //createGraphWhenClickANode;

    function downloadAsSVG(elementId, keyword, filesNames) {

        if (elementId === "top_words_cloud_chart") {
            let name = filesNames + '.svg';
            var svgEl = document.getElementById("top_words_cloud_chart").children[0].children[0];
            svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            var svgData = svgEl.outerHTML;
            var preface = '<?xml version="1.0" standalone="no"?>\r\n';
            var svgBlob = new Blob([preface, svgData], { type: "image/svg+xml;charset=utf-8" });
            var svgUrl = URL.createObjectURL(svgBlob);
            var downloadLink = document.createElement("a");
            downloadLink.href = svgUrl;
            downloadLink.download = name;
            downloadLink.click();
        } else {
            let element = document.getElementById(elementId);
            let positionInfo = element.getBoundingClientRect();
            let height = positionInfo.height;
            let width = positionInfo.width;
            let name = keyword(elementId) + filesNames.replace("WordCloud", "");
            Plotly.downloadImage(elementId,
                { format: 'svg', width: width * 1.2, height: height * 1.2, filename: name }
            );
        }
      
      }
      function downloadAsPNG(elementId, keyword, filesNames) {
        let element = document.getElementById(elementId);
    
        if (elementId === "top_words_cloud_chart") {
            let name = filesNames + '.png';
            saveSvgAsPng(element.children[0].children[0], name, { backgroundColor: "white", scale: 2 });
        } else {
            let positionInfo = element.getBoundingClientRect();
            let height = positionInfo.height;
            let width = positionInfo.width;
            let name = keyword(elementId) + filesNames.replace("WordCloud", "") + '.png';
            Plotly.downloadImage(elementId,
                { format: 'png', width: width * 1.2, height: height * 1.2, filename: name }
            );
        }
    }

    const getWords = () => {
        if (props.result.cloudChart && props.result.cloudChart.json) {
            return JSON.parse(JSON.stringify(props.result.cloudChart.json));
        }
        else {
            return [];
        }
    };

    const words = getWords();
    const colors = ['#143059', '#2F6B9A', '#82a6c2'];
    const fontScale = scaleLog({
        domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
        range: [15, 70],
    });
    const fontSizeSetter = (datum) => fontScale(datum.value);

    const [hovering, setHovering] = useState();

    return (
        <Card>
            {(props.result && props.result.cloudChart && props.result.cloudChart.json && props.result.cloudChart.json.length !== 0) &&
                <CustomCardHeader 
                    title={"11. " + keyword("top_words_cloud_chart_title")}
                    showHelp={true} 
                    helpText={"twittersna_wordcloud_tip"} 
                    showPNG={true}
                    functionPNG={() => 
                        downloadAsPNG("top_words_cloud_chart", keyword, filesNames)
                    }
                    showSVG={true}
                    functionSVG={() => 
                        downloadAsSVG("top_words_cloud_chart", keyword, filesNames)
                    }
                    showSpecialCSV={true}
                    functionSpecialCSV={
                        <Grid item>
                            <CSVLink
                                data={getCSVData()} headers={CSVheaders} filename={filesNames + ".csv"} className="MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary">
                                    <IconButton>
                                        <IconCSV />
                                    </IconButton>
                                    
                                
                            </CSVLink>
                            
                        </Grid>
                        
                    }
                    />
                }

                        {
                            props.result && props.result.cloudChart && props.result.cloudChart.json &&
                            <Box alignItems="center" justifyContent="center" width={"100%"}>
                                <div height={"700"} width={"100%"} >
                                    {
                                        (props.result.cloudChart.json && props.result.cloudChart.json.length === 0) &&
                                        <Typography variant={"body2"}>{keyword("twittersna_no_data")}</Typography>}

                                </div>
                                <Box m={2} />
                                {
                                    props.result.cloudChart && props.result.cloudChart.json && (props.result.cloudChart.json.length !== 0) &&
                                    <Grid container justifyContent="center">
                                    <Grid item id="top_words_cloud_chart">
                                        
                                        <Wordcloud 
                                            words={words}
                                            height={500} 
                                            width={800}
                                            rotate={0}
                                            fontSize={fontSizeSetter}
                                            random={()=>0.5}
                                        >
                                                {(cloudWords) =>
                                                    cloudWords.map((w, i) => (
                                                        <Text
                                                            key={w.text}
                                                            fill={colors[i % colors.length]}
                                                            textAnchor={'middle'}
                                                            transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
                                                            fontSize={w.size}
                                                            fontFamily={w.font}
                                                            onClick={() => {click(w.text)}}
                                                            style ={{
                                                                cursor: "pointer", 
                                                                textDecorationLine: ((hovering === w.text)?'underline':undefined)
                                                            }}
                                                            onMouseEnter={()=>{setHovering(w.text)}}
                                                            onMouseLeave={()=>{setHovering(false)}}

                                                        >
                                                            {w.text}
                                                        </Text>
                                                    ))
                                                }
                                        </Wordcloud>
                                        <Box m={1} />
                                    
                                    </Grid>
                                    </Grid>

                                }
                                {
                                    cloudTweets &&
                                    <PostViewTable 
                                        snatype={sna} 
                                        setTypeValue={setCloudTweets} 
                                        data={cloudTweets} 
                                        downloadEnable={true} 
                                        request={props.request}
                                        csvArr={cloudTweets.csvArr} 
                                        selected={"word_" + cloudTweets.selected} />
                                }
                            </Box>
                        }
                        {
                             props.result.cloudChart  === undefined &&
                            <CircularProgress className={classes.circularProgress} />
                        }

                </Card>
    )
}