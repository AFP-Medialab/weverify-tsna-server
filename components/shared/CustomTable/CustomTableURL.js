import React, { useEffect, useState } from 'react';
import MaterialTable from '@material-table/core';
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
import { createMuiTheme, MuiThemeProvider, Paper } from "@material-ui/core";
import DesinformationIcon from "../../../images/SVG/DataAnalysis/Credibility/Desinformation.svg";
import FactCheckerIcon from "../../../images/SVG/DataAnalysis/Credibility/Fact-checker.svg";
import TweetDialog from '../TweetDialog/TweetDialog'
import { PostAdd } from '@material-ui/icons';

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

    const theme = createMuiTheme({
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
        console.log("use effect");
        setState({
            ...state,
            data: props.data,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.data)]);

    const handleClick = (data, type) => {
        console.log("onclick ", data);
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
            <MuiThemeProvider theme={theme}>
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
                        //console.log("COLUMN");
                        //console.log(obj);
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
                        } else if (obj.field === "url") {
                            return {
                                title: obj.title,
                                field: obj.field,
                                width: "70%"
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
            <TweetDialog open={open} selectedURL={selectedURL} handleClose={handleClose} creditType={creditType} />
            </MuiThemeProvider>
        </div>

    );
}