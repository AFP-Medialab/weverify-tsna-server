import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from "@mui/icons-material/Twitter";
import React from 'react';
import CustomTable from '../../shared/CustomTable/CustomTable';
import { getLabelsColumns } from "../../shared/lib/StringUtil";
import { downloadClick } from "../lib/downloadClick";
import{FB_SNA_TYPE, TW_SNA_TYPE, INSTA_SNA_TYPE} from "../../shared/hooks/SnaTypes"
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { i18nLoadNamespace, i18nLoadNamespaceNoSuspense } from "../../shared/languages/i18nLoadNamespace";
import { CROWDTANGLE_PATH, SNA_PATH, TWITTERSNA_PATH } from "../../shared/languages/LanguagePaths";

function getIcon(snaType){
    switch (snaType){
        case INSTA_SNA_TYPE: 
            return () => <InstagramIcon style={{ color: "#C13584" }} />;
        case FB_SNA_TYPE:
            return () => <FacebookIcon style={{ color: "#3b5998" }} />;;
        case TW_SNA_TYPE :
            return () => <TwitterIcon style={{ color: "#00acee" }} />;;
        default:
            return null;
    }
}

export default function PostViewTable ({snatype, setTypeValue, data, downloadEnable, request, csvArr, selected}){
    //console.log("data POSTED", downloadEnable);

    var keyword = (word) => "";
    var path;

    if(snatype.type === TW_SNA_TYPE) {
        path = TWITTERSNA_PATH;
    }
    else {
        path = CROWDTANGLE_PATH;
    }

    // here useSuspense is set to false and ready boolean is used to set the value of keyword, otherwise keywords don't load properly
    const {t, ready} = i18nLoadNamespaceNoSuspense(path);
    if(ready) keyword = t;

    const keywordSNA = i18nLoadNamespace(SNA_PATH);
    var goToAction = [
        {
          icon: getIcon(snatype.type),
          tooltip: keyword("twittersna_result_go_to"),
          onClick: (event, rowData) => {
            if(snatype.type == TW_SNA_TYPE)
                window.open(rowData.link, "_blank");
            else
                window.open(rowData.link.props.href, "_blank");
          },
        },
      ];
    
    var labeledColumns = getLabelsColumns(keyword, data.columns);
    //console.log("labeledColumns  ", labeledColumns);
    return (
        <div
            style={{
                padding: "16px",
                margin: "16px",
                backgroundColor: "#fbfbfb",
                borderRadius: "15px"
            }}>
            <Grid container justifyContent="space-between" spacing={2}
                alignContent={"center"}>
                <Grid item>
                    <Box ml={1}>
                    <Button
                        startIcon={<ExpandLessIcon />}
                        color={"primary"}
                        onClick={() => setTypeValue(null)}>
                        {
                            keywordSNA('sna_result_hide')
                        }
                    </Button>
                    </Box>
                </Grid>
                {
                    downloadEnable && 
                    <Grid item>
                        <Button
                            startIcon={<SaveAltIcon />}
                            color={"primary"}
                            onClick={() => downloadClick(request, csvArr, selected)}>
                            {
                                keywordSNA('sna_result_download')
                            }
                        </Button>
                    </Grid>
                }
            </Grid>
            <Box m={2} />
            <CustomTable title={keywordSNA("sna_result_selected_posts")}
                columns={labeledColumns}
                data={data.data}
                actions={goToAction}
            />
        </div>
    )

}