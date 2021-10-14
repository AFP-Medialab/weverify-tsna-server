import React, {useEffect, useState} from 'react';
import MaterialTable  from 'material-table';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import { Paper } from "@material-ui/core";
import { PatchedPagination } from '../../patch/PatchedTablePagination';
import Link from "@material-ui/core/Link";
import DesinformationIcon from "../../../images/SVG/DataAnalysis/Credibility/Desinformation.svg";
import FactCheckerIcon from "../../../images/SVG/DataAnalysis/Credibility/Fact-checker.svg";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Typography from "@material-ui/core/Typography";

//const tsv = "/localDictionary/components/Shared/CustomTable.tsv";
const tsv = "/components/Shared/CustomTable.tsv";

const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline ,
    DetailPanel: ChevronRight,
    Edit: Edit,
    Export: SaveAlt,
    Filter: FilterList,
    FirstPage: FirstPage,
    LastPage: LastPage,
    NextPage: ChevronRight,
    PreviousPage: ChevronLeft,
    ResetSearch: Clear,
    Search: Search,
    SortArrow: ArrowUpward,
    ThirdStateCheck: Remove,
    ViewColumn: ViewColumn
};

export default function CustomTableURL(props) {
    const [open, setOpen] = useState(false);
    const [selectedURL, setSelectedURL] = useState([]);
    const [state, setState] = useState(
        {
            title: props.title,
            columns: props.columns,
            data: props.data,
            actions: props.actions
        }
    );
    const keyword = useLoadLanguage(tsv);

    useEffect(() => {
        console.log("use effect");
        setState({
            ...state,
            data: props.data,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.data)]);
    
    const handleClick = (data) => {
        console.log("onclick ", data);
        setSelectedURL(data)
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setSelectedURL([]);
    };

    return (
        <div>
            <MaterialTable
            components={{Container: props => <Paper {...props} elevation={0}/>, Pagination: PatchedPagination}}
            //more custom info at https://material-table.com/#/docs/features/localization
            localization={{
                pagination: {
                    firstTooltip: keyword("first_page"),
                    previousTooltip: keyword("previous_page"),
                    nextTooltip: keyword("next_page"),
                    lastTooltip: keyword("last_page"),
                    labelRowsSelect: keyword(""),
                    labelDisplayedRows: keyword("from_to_text")
                },
                toolbar: {
                    nRowsSelected: keyword('{0} row(s) selected (add tsv)'),
                    searchPlaceholder: keyword("search")
                },
                header: {
                    actions: ""
                },
                body: {
                    emptyDataSourceMessage: keyword('no_records'),
                    filterRow: {
                        filterTooltip: keyword("filter")
                    }
                }
            }}
            
            icons={tableIcons}
            title={state.title}
            columns={
                state.columns.map((obj) => {
                    if (obj.field === "url") {
                        return {
                            title: obj.title,
                            field: obj.field,
                            render: rowData => <Link target="_blank" href={rowData.url}>{rowData.url}</Link>
                        }
                    } else if (obj.field === "credibility"){
                        return {
                            title: obj.title,
                            field: obj.field,
                            render: rowData => rowData.credibility === 'OK' ? 
                                <FactCheckerIcon/> :rowData.credibility === 'KO' ?
                                    <DesinformationIcon onClick={() => handleClick(rowData.credibility_details)} style={{ cursor: 'pointer'}}/> : ''
                        }
                    } else {
                        return obj;
                    }
                })
            }
            data={state.data}
            actions={state.actions}
            options={{
                emptyRowsWhenPaging: false,
                pageSizeOptions:[5, 10, 15, 20, 25],
                search: true,
                selection: true,
                sorting: true
            }}
        />
        <Dialog
                fullWidth
                maxWidth={'xs'}
                open={open}
                onClose={handleClose}
                aria-labelledby="max-width-dialog-title"
            >
            <Box p={2}>
            {selectedURL[0] && <>
                <DialogTitle id="max-width-dialog-title">
                    <Typography gutterBottom style={{ color: "#51A5B2", fontSize: "24px" }}>
                        {"title"}
                    </Typography>
                </DialogTitle>
                <DialogContent style={{ height: '300px' }}>
                <Typography variant="body2">
                    {"resolved-url : "}{selectedURL[0].string}
                </Typography>
                <Box m={4} />
                <Typography variant="body2">
                    {selectedURL[0].description}
                </Typography>
                <Box m={4} />
                <Typography variant="body2" style={{ color: "#51A5B2" }}>
                    {selectedURL[0].debunks}
                </Typography>
                <Box m={2} />
                </DialogContent>
                </>
                }
            </Box>
        </Dialog>
        </div>
        
    );
}