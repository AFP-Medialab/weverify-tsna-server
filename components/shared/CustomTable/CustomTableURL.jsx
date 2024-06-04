import MaterialTable from '@material-table/core';
import { ThemeProvider } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import { createTheme } from '@mui/material/styles';
import AddBox from '@mui/icons-material/AddBox';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Check from '@mui/icons-material/Check';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Clear from '@mui/icons-material/Clear';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import Edit from '@mui/icons-material/Edit';
import FilterList from '@mui/icons-material/FilterList';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import Remove from '@mui/icons-material/Remove';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Search from '@mui/icons-material/Search';
import ViewColumn from '@mui/icons-material/ViewColumn';
import React, { useEffect, useState } from 'react';
import DesinformationIcon from "../../../images/SVG/DataAnalysis/Credibility/Desinformation.svg";
import FactCheckerIcon from "../../../images/SVG/DataAnalysis/Credibility/Fact-checker.svg";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";
import TweetDialog from '../TweetDialog/TweetDialog';

//const tsv = "/localDictionary/components/Shared/CustomTable.tsv";
const tsv = "/components/Shared/CustomTable.tsv";



const tableIcons = {
    Add: AddBox,
    Check: Check,
    Clear: Clear,
    Delete: DeleteOutline,
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

    const theme = createTheme({
        palette: {
            primary: {
                main: '#05A9B4',
            },
            secondary: {
                main: '#05A9B4',
            },
        },

        overrides: {

            MuiToolbar: {
                root: {
                    borderRadius: "10px",
                    padding: "10px"
                },

            },

            MuiIconButton: {
                colorInherit: {
                    backgroundColor: "#51A5B2",
                    borderRadius: "4px",
                    fontSize: "14px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    color: "white",
                    marginRight:"8px",
                    marginLeft: "20px",
                },
            },


            MuiOutlinedInput: {
                input:{
                    padding: "10.5px 14px"
                },

                root: {
                    backgroundColor: "white"
                }
            },

            MuiTableCell:{
                root:{
                    overflowWrap: "break-word"
                }
            },

            MuiFormControl: {
                root: {
                    paddingLeft: "0px!important"
                }
            }

            

        },

    });


    var desinfo = "desinfo";
    var factcheck = "factchecker"
    const [open, setOpen] = useState(false);
    const [selectedURL, setSelectedURL] = useState([]);
    const [creditType, setCreditType] = useState();
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
        //console.log("use effect");
        setState({
            ...state,
            data: props.data,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.data)]);

    const handleClick = (data, type) => {
        //console.log("onclick ", data);
        setSelectedURL(data)
        setCreditType(type);
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setSelectedURL([]);
    };

    return (
        <div>
            <ThemeProvider theme={theme}>
            <MaterialTable
                // components={{Container: props => <Paper {...props} elevation={0}/>, Pagination: PatchedPagination}}
                components={{ Container: props => <Paper {...props} elevation={0} /> }}
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
                title={""}
                columns={
                    state.columns.map((obj) => {
                        //console.log("COLUMN", obj);
                        if (obj.field === "credibility") {
                            return {
                                title: obj.title,
                                field: obj.field,
                                width: "15%",
                                cellStyle: {
                                    textAlign: "center"
                                },
                                render: rowData => rowData.credibility === 'OK' ?
                                    <FactCheckerIcon onClick={() => handleClick(rowData.credibility_details, factcheck)} style={{ cursor: 'pointer' }} /> : rowData.credibility === 'KO' ?
                                        <DesinformationIcon onClick={() => handleClick(rowData.credibility_details, desinfo)} style={{ cursor: 'pointer' }} /> : ''
                            }
                        } else if (obj.field === "url" || obj.field === "URL") {
                            return {
                                title: obj.title,
                                field: obj.field,
                                width: "100%",
                                render: rowData => <a href={rowData.url} target="_blank" style={{ color: "#51A5B2"}}>{rowData.url}</a>
                            }
                        } else if (obj.field === "count") {
                            return {
                                title: obj.title,
                                field: obj.field,
                                width: "10%",
                                cellStyle: {
                                    textAlign: "center"
                                }
                            }
                        } else {
                            return {
                                title: obj.title,
                                field: obj.field,
                                width: "5%"
                            }
                        }
                    })
                }
                data={state.data}
                actions={state.actions}
                options={{
                    actionsCellStyle: {backgroundColor: "#00ffff!important"},
                    emptyRowsWhenPaging: false,
                    pageSizeOptions: [5, 10, 15, 20, 25],
                    search: true,
                    selection: true,
                    sorting: true,
                    searchFieldVariant: 'outlined',
                    tableLayout: 'fixed',
                    searchFieldAlignment: "left",
                    searchFieldStyle: {

                    }
                }}
            />
            <TweetDialog open={open} selectedURL={selectedURL} handleClose={handleClose} creditType={creditType} topic={props.topic}/>
            </ThemeProvider>
        </div>

    );
}