import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from "@material-ui/icons/Twitter";
import {downloadClick} from "../lib/downloadClick"
import useLoadLanguage from "../../shared/hooks/useRemoteLoadLanguage";
import React, {useState} from 'react';
import CustomTable from '../../shared/CustomTable/CustomTable';
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

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

function getLabelsColumns(keyword, columns){
    const labeledColumns = columns.map((obj,index ) => {
        return {...obj, title: keyword(obj.title)};
    });
    return labeledColumns;
}

export default function PostViewTable ({snatype, setTypeValue, data, downloadEnable, request}){
    console.log("data POSTED", downloadEnable);
    const keyword = useLoadLanguage(snatype.tsv);
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
                            keyword('sna_result_hide')
                        }
                    </Button>
                </Grid>
                {
                    downloadEnable && 
                    <Grid item>
                        <Button
                            variant={"contained"}
                            color={"primary"}
                            onClick={() => downloadClick(request, data.csvArr, data.selected)}>
                            {
                                keyword('sna_result_download')
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