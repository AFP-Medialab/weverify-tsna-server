import useLoadLanguage from "../../hooks/useLoadLanguage";
import React, {useEffect, useState} from 'react';
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CustomTable from "../../CustomTable/CustomTable";
import TwitterIcon from '@material-ui/icons/Twitter';
import {setHistogram} from "../../../../redux/actions/tools/twitterSnaActions";

export default function HistoTweetsTable (props) {

    const dispatch = useDispatch();
    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

    const [histoTweets, setHistoTweets] = useState(null);


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
                    onClick={() => dispatch(setHistogram(null))}
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
                    onClick={() => downloadClick(props.histoTweets.csvArr, props.histoTweets.data[0].date.split(' ')[0], true)}>
                    {
                        keyword('twittersna_result_download')
                    }
                </Button>
            </Grid>
        </Grid>
        <Box m={2} />
        <CustomTable
            title={keyword("twittersna_result_slected_tweets")}
            colums={props.histoTweets.columns}
            data={props.histoTweets.data}
            actions={goToTweetAction}
        />
    </div>
);
}