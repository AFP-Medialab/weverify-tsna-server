
import CustomTitle from "../../components/shared/CustomTitle/CustomTitle"
import Paper from "@material-ui/core/Paper";
import useMyStyles from '../../components/shared/styles/useMyStyles';
import useLoadLanguage from "../../components/shared/hooks/useLoadLanguage";
import { useEffect, useState } from "react";



const TwitterSna = () => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("components/NavItems/tools/TwitterSna.tsv", "/localDictionary/tools/TwitterSna.tsv");
   
    return (
        <div>
            <Paper className={classes.root} style={{marginTop: "0px", marginBottom: "0px", paddingTop: "0px"}}>
                <CustomTitle text={keyword("twitter_sna_title")} />

            </Paper>
        </div>
    );
}
export default TwitterSna;