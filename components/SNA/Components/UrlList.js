import {useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import React  from "react";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage";
import Button from "@material-ui/core/Button";
import OnClickInfo from "../../shared/OnClickInfo/OnClickInfo";
import CustomTableURL from "../../shared/CustomTable/CustomTableURL";
import {downloadClick} from "../lib/downloadClick";


export default function UrlList (props) {

    const sna = useSelector(state => state.sna)
    const keyword = useLoadLanguage(sna.tsv);    
    
    const userLogined = useSelector(state => state.userSession && state.userSession.user);
    const userData = encodeURIComponent(JSON.stringify(userLogined));
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
    console.log("cho " , props);
    function goToTwitterSnaWithUrlSearch(event, rowData) {

        let newReq = props.request;
        newReq.keywordList = [];
        let index = 0;

        //NEED TO ASK PEOPLE TO ALLOW POPUP

        for (let obj in rowData) {           
            newReq.keywordList[0] = rowData[index].url;
            console.log(newReq.keywordList[0])
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
        <Paper>
            <br></br><br></br>
            {
            props.downloadable && 
            <Box pb={3}>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => downloadClick(props.request,createCSVFromURLTable(props.result.urls), "Urls", false, "")}
                >
                    CSV
                </Button>
            </Box>
                }
            <CustomTableURL
                //title={keyword("twittersna_result_url_in_tweets")}
                title={keyword(props.title_message)}
                columns={props.result.urls.columns}
                data={props.result.urls.data}
                actions={actions}
            />
            <Box m={1}/>
            <OnClickInfo keyword={"twittersna_urls_tip"}/>
        </Paper>

    )

}