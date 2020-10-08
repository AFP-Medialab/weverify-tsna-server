import useLoadLanguage from "../../hooks/useLoadLanguage";
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CustomTable from "../../CustomTable/CustomTable";
import TwitterIcon from '@material-ui/icons/Twitter';
import {setTweetsDetailPanel} from "../../../../redux/actions/tools/twitterSnaActions";


export default function HistoTweetsTable (props) {

    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");
    const request = useSelector(state => state.twitterSna.request);

    function downloadClick(csvArr, name, histo, type = "Tweets_") {
        let encodedUri = encodeURIComponent(csvArr);
        let link = document.createElement("a");
        link.setAttribute("href", 'data:text/plain;charset=utf-8,' + encodedUri);
        link.setAttribute("download", type + name + "_" + request.keywordList.join('&') + '_' + ((!histo) ? (request.from + "_" + request.until) : "") + ".csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    let goToTweetAction = [{
        icon: TwitterIcon,
        tooltip: keyword("twittersna_result_go_to_tweet"),
        onClick: (event, rowData) => {
            window.open(rowData.link, '_blank');
        }
    }]

return (
<div>
        <Grid container justify="space-between" spacing={2}
            alignContent={"center"}>
            <Grid item>
                <Button
                    variant={"contained"}
                    color={"secondary"}
                    onClick={() => dispatch(setTweetsDetailPanel(props.from, null))}
                >
                    {
                        keyword('twittersna_result_hide')
                    }
                </Button>
            </Grid>
            <Grid item>
                <Button
                    variant={"contained"}
                    color={"primary"}
                    onClick={() => downloadClick(props.data.csvArr, props.data.data[0].date.split(' ')[0], true)}>
                    {
                        keyword('twittersna_result_download')
                    }
                </Button>
            </Grid>
        </Grid>
        <Box m={2} />
        <CustomTable
            title={keyword("twittersna_result_slected_tweets")}
            colums={props.data.columns}
            data={props.data.data}
            actions={goToTweetAction}
        />
    </div>
);
}