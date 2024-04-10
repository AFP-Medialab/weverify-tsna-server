import React, {useEffect, useState} from 'react';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from "@mui/material/Tooltip";
import {useSelector, useDispatch} from "react-redux";
import useLoadLanguage from "../hooks/useRemoteLoadLanguage";

import {changeLanguage} from "../../../redux/actions"
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import TranslateIcon from '@material-ui/icons/Translate';
import { useRouter } from 'next/router'
import _ from 'lodash'

//const tsv = "/localDictionary/components/languages.tsv";
const tsv = "/components/NavItems/languages.tsv";

const Languages = () => {
    const router = useRouter()
    const keyword = useLoadLanguage(tsv);
    const dictionary = useSelector(state => state.dictionary);
    const storeLanguage = useSelector(state => state.language);
    const dispatch = useDispatch();
    const lang = router.query.lang
    const language_list = (dictionary && dictionary[tsv])? Object.keys(dictionary[tsv]) : [];
    useEffect(() => {
        if(!_.isUndefined(lang)){
            if(language_list.includes(lang))
                dispatch(changeLanguage(lang));
        }
    }, [lang, language_list]);
    
    const keywordByLang = (language) => {
        return (dictionary && dictionary[tsv] && dictionary[tsv][language])? dictionary[tsv][language]["lang_label"]: "";
    };


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