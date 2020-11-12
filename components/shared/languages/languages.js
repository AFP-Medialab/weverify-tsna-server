import React, {useState} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from "@material-ui/core/Tooltip";
import TranslateIcon from '@material-ui/icons/Language';
import {useSelector, useDispatch} from "react-redux";
import useLoadLanguage from "../hooks/useLoadLanguage";
import {changeLanguage} from "../../../redux/actions"
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

const tsv = "/localDictionary/components/languages.tsv";


const Languages = () => {
    const keyword = useLoadLanguage(tsv);
    const dictionary = useSelector(state => state.dictionary);
    const localtsv = `${publicRuntimeConfig.baseFolder}`+tsv;
    const keywordByLang = (language) => {
        return (dictionary && dictionary[localtsv] && dictionary[localtsv][language])? dictionary[localtsv][language]["lang_label"]: "";
    };

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseItem = (lang) => {
        setAnchorEl(null);
        dispatch(changeLanguage(lang));
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const language_list = (dictionary && dictionary[localtsv])? Object.keys(dictionary[localtsv]) : [];

    return (
        <div>
             <Tooltip title={keyword("translations")} placement="bottom">
                <IconButton aria-label="add to favorites"
                            onClick={handleClick}>
                     <TranslateIcon/>
                </IconButton>
             </Tooltip>
             <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {
                    language_list.map((key) => {
                        return <MenuItem key={key} onClick={() => handleCloseItem(key)}> {keywordByLang(key) } </MenuItem>
                    })
                }
            </Menu>
        </div>
    );

};
export default Languages;