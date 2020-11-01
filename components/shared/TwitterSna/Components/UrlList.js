import { useDispatch, useSelector } from "react-redux";
import { Paper } from "@material-ui/core";
import useMyStyles from "../../styles/useMyStyles";
import React, { useEffect, useState, useCallback } from "react";
import Box from "@material-ui/core/Box";
import useLoadLanguage from "../../hooks/useLoadLanguage"
import Button from "@material-ui/core/Button";
import CustomTableURL from "../../CustomTable/CustomTableURL";
import OnClickInfo from '../../OnClickInfo/OnClickInfo';
import {downloadClick} from "../lib/downloadClick";

export default function cloudChart (props) {

    const dispatch = useDispatch();

    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const classes = useMyStyles();

    function createCSVFromURLTable(urls) {
        let csvArr = "Url,Count\n";
        urls.data.forEach(row => 
            csvArr += row.url + "," + row.count + "\n"
        );
        return csvArr;
    }

    return (

        <Paper>
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