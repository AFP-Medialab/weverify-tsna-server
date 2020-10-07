
import useLoadLanguage from "../../languages/languages";
import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CustomTable from "../../CustomTable/CustomTable";

export default function HistoTweetsTable (props) {


    const keyword = useLoadLanguage("/localDictionary/tools/TwitterSna.tsv");

    const [histoTweets, setHistoTweets] = useState(null);

    const [state, setState] = useState(
        {
            histoTweets: props.histoTweets,        
        }
    );
    useEffect(() => {
        setState({
            ...state,
            histoTweets: props.histoTweets,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.histoTweets]);

    

return (
<div>
        <Grid container justify="space-between" spacing={2}
            alignContent={"center"}>
            <Grid item>
                <Button
                    variant={"contained"}
                    color={"secondary"}
                    onClick={() => setHistoTweets(null)}
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