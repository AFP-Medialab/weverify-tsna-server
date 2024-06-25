import { Card } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { useSelector } from "react-redux";
import CustomCardHeader from "../../shared/CustomCardHeader/CustomCardheader";
import CustomTableURL from "../../shared/CustomTable/CustomTableURL";
import useMyStyles from "../../shared/styles/useMyStyles";
import { downloadClick } from "../lib/downloadClick";
import { i18nLoadNamespace } from "../../shared/languages/i18nLoadNamespace";


export default function UrlList (props) {

    const sna = useSelector(state => state.sna);
    // const keyword = i18nLoadNamespace(sna.tsv);
    var keyword;
    if(props.type === "TW") {
        keyword = i18nLoadNamespace("components/NavItems/tools/TwitterSna");
    }
    else {
        keyword = i18nLoadNamespace("components/NavItems/tools/CrowdTangle");
    }
    
    const userLogined = useSelector(state => state.userSession && state.userSession.user);
    const userData = encodeURIComponent(JSON.stringify(userLogined));

    const classes = useMyStyles();
    var actions = [];
    if(props.action)
        actions = [
            {
                icon: () => (<span className="MuiButtonBase-root 
                                                MuiButton-root 
                                                MuiButton-contained 
                                                MuiButton-containedPrimary"
                                    >
                                    {
                                        //keyword('twittersna_result_submit_twitter_sna')
                                        keyword(props.tooltip_message)
                                    }
                                    </span>),
                tooltip: keyword("twittersna_result_submit_twitter_sna"),
                //tooltip: keyword(props.submit_message),
                onClick: (event, rowData) => {
                    goToTwitterSnaWithUrlSearch(event, rowData)
                }
            }
        ]

    function goToTwitterSnaWithUrlSearch(event, rowData) {

        let newReq = props.request;
        newReq.keywordList = [];
        let index = 0;

        //NEED TO ASK PEOPLE TO ALLOW POPUP

        for (let obj in rowData) {           
            newReq.keywordList[0] = rowData[index].url;
            //console.log(newReq.keywordList[0])
            window.open("/pluginredirect" + "?data=" + encodeURIComponent(JSON.stringify(newReq)) + "&user=" + userData, "_blank");
            index++;
        }       
    }

    function createCSVFromURLTable(urls) {
        let csvArr = "Url,Count\n";
        urls.data.forEach(row => 
            csvArr += row.url + "," + row.count + "\n"
        );
        return csvArr;
    }

    return (
        <Card>
            
            <CustomCardHeader title={(props.type === "TW" ? "13. " : "") + keyword(props.title_message)} showHelp={true} helpText={"twittersna_urls_tip"} showCSV={true} functionCSV={() => downloadClick(props.request, createCSVFromURLTable(props.result.urls), "Urls", false, "")} />
            <Box p={2}>
            {

            props.downloadable && 
            <Box>
            </Box>
                }
            <CustomTableURL
                //title={keyword("twittersna_result_url_in_tweets")}
                title={keyword(props.title_message)}
                columns={props.result.urls.columns}
                data={props.result.urls.data}
                actions={actions}
                topic={props.topic}
            />
            <Box m={1}/>
            </Box>
        </Card>

    )

}