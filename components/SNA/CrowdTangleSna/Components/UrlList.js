import { useDispatch, useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import useMyStyles from "../../../shared/styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../../shared/hooks/useRemoteLoadLanguage"

import CustomTableURL from "../../../shared/CustomTable/CustomTableURL";
import OnClickInfo from '../../../shared/OnClickInfo/OnClickInfoFB';


export default function cloudChart (props) {

    const sna = useSelector((state) => state.sna);
    const keyword = useLoadLanguage(sna.tsv);
    //to redirect
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
                                                (sna.type=="INSTA"? keyword('ct_sna_result_submit_insta_sna') : keyword('ct_sna_result_submit_fb_sna'))
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