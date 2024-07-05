import MaterialTable from '@material-table/core';
import { createTheme } from '@mui/material';
import { ThemeProvider} from '@mui/material/styles';
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
import { i18nLoadNamespace, i18nLoadNamespaceNoSuspense } from '../languages/i18nLoadNamespace';
import { CROWDTANGLE_PATH, CUSTOMTABLE_PATH, TWITTERSNA_PATH } from '../languages/LanguagePaths';
import { TW_SNA_TYPE } from '../hooks/SnaTypes';




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

export default function CustomTable(props) {

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


            MuiOutlinedInput: {
                input: {
                    padding: "10.5px 14px"
                },

                root: {
                    backgroundColor: "white"
                }
            },

            MuiTableCell: {
                root: {
                    overflowWrap: "break-word"
                }
            },

            MuiFormControl: {
                root: {
                    paddingLeft: "0px!important"
                }
            },

            MuiPaper: {
                elevation2: {
                    boxShadow: "none",
                    backgroundColor: "#fbfbfb"
                }
            },

            MuiTypography: {
                h6: {
                    
                }
            },
            MuiTablePagination: {
                root: {
                    border: "none"
                }
            },

            MuiTableCell:{
                head:{
                    color: "#186a70",
                    backgroundColor: "#fbfbfb!important",
                }
            },





        },

    });


    const [state, setState] = useState(
        {
            title: props.title,
            columns: props.columns,
            data: props.data,
            actions: props.actions
        }
    );

    var keyword = (word) => "";


    const { t, ready } = i18nLoadNamespaceNoSuspense(CUSTOMTABLE_PATH);

    if(ready) keyword = t;

    var keywordSna = (word) => "";

    if(props.type === TW_SNA_TYPE) {
        keywordSna = i18nLoadNamespace(TWITTERSNA_PATH);
    }
    else {
        keywordSna = i18nLoadNamespace(CROWDTANGLE_PATH);
    }

    useEffect(() => {
        setState({
            ...state,
            data: props.data,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.data)]);
    
    return (
        <ThemeProvider theme={theme}>
        <MaterialTable
            //components={{Pagination: PatchedPagination}}
            //more custom info at https://material-table.com/#/docs/features/localization
            localization={{
                pagination: {
                    firstTooltip: keyword("first_page"),
                    previousTooltip: keyword("previous_page"),
                    nextTooltip: keyword("next_page"),
                    lastTooltip: keyword("last_page"),
                    labelRowsSelect: "",
                    labelDisplayedRows: keyword("from_to_text")
                },
                toolbar: {
                    nRowsSelected: keyword("row_selected"),
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
            title={keywordSna(state.title)}
            columns={
                    
                state.columns.map((obj) => {
                    if (obj.title === "Tweet") {
                        return {
                            title: keywordSna(obj.title),
                            field: obj.field,
                            width: "75%"
                        }
                    }else if (obj.title === "Date") {
                        return {
                            title: keywordSna(obj.title),
                            field: obj.field,
                            width: "20%",
                        }
                    } else if (obj.title === "Post description") {
                        return {
                            title: keywordSna(obj.title),
                            field: obj.field,
                            width: "50%",
                        }
                    } else {
                        return {
                            title: keywordSna(obj.title),
                            field: obj.field,
                            width: "5%"
                        }
                    }

                })}
            data={state.data}
            actions={state.actions}
            options={{
                search: true,
                emptyRowsWhenPaging: false,
                pageSizeOptions:[5, 10, 20, 50],
                searchFieldVariant: 'outlined',
            }}
        />
        </ThemeProvider>
    );
}