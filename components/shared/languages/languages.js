import React, {useState} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from "@material-ui/core/Tooltip";
import {useSelector, useDispatch} from "react-redux";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";

import {changeLanguage} from "../../../redux/actions"
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import TranslateIcon from '@material-ui/icons/Translate';

//const tsv = "/localDictionary/components/languages.tsv";
const tsv = "/components/NavItems/languages.tsv";

const Languages = () => {
    
    const keyword = useLoadLanguage(tsv);
    const dictionary = useSelector(state => state.dictionary);
    const storeLanguage = useSelector(state => state.language);
    
    const keywordByLang = (language) => {
        return (dictionary && dictionary[tsv] && dictionary[tsv][language])? dictionary[tsv][language]["lang_label"]: "";
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

    const language_list = (dictionary && dictionary[tsv])? Object.keys(dictionary[tsv]) : [];

    return (
        <div>
            <span id="language"
                style={{
                    color: "#596977",
                    fontSize: "16px",
                    fontWeight: "500",
                    marginRight: "5px",
                }}>

                {keywordByLang(storeLanguage)}
            </span>
             <Tooltip title={keyword("translations")} placement="bottom">
                <IconButton aria-label="add to favorites"
                            onClick={handleClick}>
                    <TranslateIcon fontSize="large" style={{ color: "#596977" }} />
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