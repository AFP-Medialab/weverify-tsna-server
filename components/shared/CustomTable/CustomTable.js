import React, {useEffect, useState} from 'react';
import MaterialTable  from '@material-table/core';
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

//const tsv = "/localDictionary/components/Shared/CustomTable.tsv";
const tsv = "/components/Shared/CustomTable.tsv";

import { PatchedPagination } from '../../patch/PatchedTablePagination';

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
        setState({
            ...state,
            data: props.data,
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(props.data)]);
    
    return (
        <MaterialTable
            //components={{Pagination: PatchedPagination}}
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
                    if (obj.title === "Tweet") {
                        return {
                            title: obj.title,
                            field: obj.field,
                            width: "75%"
                        }
                    }else if (obj.title === "Date") {
                        return {
                            title: obj.title,
                            field: obj.field,
                            width: "20%",
                        }
                    } else if (obj.title === "Post description") {
                        return {
                            title: obj.title,
                            field: obj.field,
                            width: "50%",
                        }
                    } else {
                        return {
                            title: obj.title,
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
            }}
        />
    );
}