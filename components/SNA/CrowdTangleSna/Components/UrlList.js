import { useDispatch, useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage"

import CustomTableURL from "../../../shared/CustomTable/CustomTableURL";
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfoFB';


//const tsv = "/localDictionary/tools/TwitterSna.tsv";
const tsv = "/components/NavItems/tools/TwitterSna.tsv";

export default function cloudChart (props) {

    const dispatch = useDispatch();
    const snatype = useSelector((state) => state.ctSna.result.snaType);

    const keyword = useLoadLanguage(snatype.tsv);
    const classes = useMyStyles();
    //to redirect
    const userLogined = useSelector(state => state.userSession && state.userSession.user);
    const userToken = useSelector(state => state.userSession && state.userSession.accessToken);

    const userData = encodeURIComponent(JSON.stringify(userLogined));



    function goToTwitterSnaWithUrlSearch(event, rowData) {
        console.log("goToTwitterSnaWithUrlSearch-rowData", rowData)

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
                    
                    <CustomTableURL
                        title={keyword("ct_sna_result_url_in_posts")}
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
                                                        (snatype.snaType=="INSTA"? keyword('ct_sna_result_submit_insta_sna') : keyword('ct_sna_result_submit_fb_sna'))
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