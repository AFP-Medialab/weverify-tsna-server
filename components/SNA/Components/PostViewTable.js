import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from "@material-ui/icons/Twitter";
import React from 'react';
import CustomTable from '../../shared/CustomTable/CustomTable';
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage";
import { getLabelsColumns } from "../../shared/lib/StringUtil";
import { downloadClick } from "../lib/downloadClick";

function getIcon(snaType){
    switch (snaType){
        case "INSTA": 
            return  InstagramIcon;
        case "FB":
            return FacebookIcon;
        case "TWITTER" :
            return TwitterIcon;
        default:
            return null;
    }
}

export default function PostViewTable ({snatype, setTypeValue, data, downloadEnable, request, csvArr, selected}){
    console.log("data POSTED", downloadEnable);
    const keyword = useLoadLanguage(snatype.tsv);
    const keywordSNA = useLoadLanguage("/components/NavItems/tools/SNA.tsv");
    var goToAction = [
        {
          icon: getIcon(snatype.type),
          tooltip: keyword("sna_result_go_to_post"),
          onClick: (event, rowData) => {
            window.open(rowData.link.props.href, "_blank");
          },
        },
      ];
    
    var labeledColumns = getLabelsColumns(keyword, data.columns);
    console.log("labeledColumns  ", labeledColumns);
    return (
        <div>
            <Grid container justifyContent="space-between" spacing={2}
                alignContent={"center"}>
                <Grid item>
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        onClick={() => setTypeValue(null)}>
                        {
                            keywordSNA('sna_result_hide')
                        }
                    </Button>
                </Grid>
                {
                    downloadEnable && 
                    <Grid item>
                        <Button
                            variant={"contained"}
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
            <CustomTable title={keyword("sna_result_selected_post")}
                columns={labeledColumns}
                data={data.data}
                actions={goToAction}
            />
        </div>
    )

}