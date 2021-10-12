import {useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import React  from "react";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage";
import Button from "@material-ui/core/Button";
import OnClickInfo from "../../../shared/OnClickInfo/OnClickInfo";
import {downloadClick} from "../../lib/downloadClick";
import CustomTableURL from "../../../shared/CustomTable/CustomTableURL";



export default function cloudChart (props) {

    const sna = useSelector(state => state.sna)
    const keyword = useLoadLanguage(sna.tsv);    
    
    const userLogined = useSelector(state => state.userSession && state.userSession.user);

    const userData = encodeURIComponent(JSON.stringify(userLogined));



    function goToTwitterSnaWithUrlSearch(event, rowData) {

        let newReq = props.request;
        newReq.keywordList = [];
        let index = 0;

        //NEED TO ASK PEOPLE TO ALLOW POPUP

        for (let obj in rowData) {
            newReq.keywordList[0] = rowData[index].url;
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
                    <Box pb={3}>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => downloadClick(props.request,createCSVFromURLTable(props.result.urls), "Urls", false, "")}
                        >
                            CSV
                        </Button>
                    </Box>
                    <CustomTableURL
                        title={keyword("twittersna_result_url_in_tweets")}
                        colums={props.result.urls.columns}
                        data={props.result.urls.data}
                        actions={[
                            {
                                icon: props => (<span className="MuiButtonBase-root 
                                                                MuiButton-root 
                                                                MuiButton-contained 
                                                                MuiButton-containedPrimary"
                                                    >
                                                    {
                                                        keyword('twittersna_result_submit_twitter_sna')
                                                    }
                                                    </span>),
                                tooltip: keyword("twittersna_result_submit_twitter_sna"),
                                onClick: (event, rowData) => {
                                    goToTwitterSnaWithUrlSearch(event, rowData)
                                }
                            }
                        ]}
                    />
                    <Box m={1}/>
                    <OnClickInfo keyword={"twittersna_urls_tip"}/>
                </Paper>

    )

}