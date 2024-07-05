import React, {useEffect, useState} from 'react';
import IconButton from "@mui/material/IconButton";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from "@mui/material/Tooltip";
import {useSelector, useDispatch} from "react-redux";

import {changeLanguage, loadLanguages} from "../../../redux/slices/langugagesSlice"
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();
import TranslateIcon from '@mui/icons-material/Translate';
import { useRouter } from 'next/router'
import _ from 'lodash'
import { useTranslation } from 'react-i18next';
import { i18nLoadNamespace } from './i18nLoadNamespace';

import axios from "axios";
import { LANGUAGES_PATH } from './LanguagePaths';

const useLoadSupportedLanguage = () => {
    const dispatch = useDispatch();
    const lngurl =
    publicRuntimeConfig.translateUrl +
        "/languages?tag=" +
        publicRuntimeConfig.translateTag;

    useEffect(() => {

        axios.get(lngurl).then((result) => {
            dispatch(loadLanguages({languagesList: result.data}));
        }).catch((error) => {
            if(error) console.error(error)
        });

    }, []);
};




const Languages = () => {
    // const router = useRouter()
    useLoadSupportedLanguage();
    // const dictionary = useSelector(state => state.dictionary);
    const storeLanguage = useSelector(state => state.language.selectedLanguage);
    const languagesSupport = useSelector ((state) => state.language.languagesList);

    //const [lang, setLang] = useState("en");

    const dispatch = useDispatch();
    //const lang = router.query.lang
    // const language_list = (dictionary && dictionary[tsv])? Object.keys(dictionary[tsv]) : [];
    const [ keyword, i18n ] = useTranslation(LANGUAGES_PATH);

    // useEffect(() => {
    //     if(!_.isUndefined(lang)){
    //         if(language_list.includes(lang))
    //             dispatch(changeLanguage({lang: lang}));
    //     }
    // }, [lang, language_list]);
    
    // const keywordByLang = (language) => {
    //     return (dictionary && dictionary[tsv] && dictionary[tsv][language])? dictionary[tsv][language]["lang_label"]: "";
    // };


    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseItem = (lang) => {
        setAnchorEl(null);
        i18n.changeLanguage(lang);
        dispatch(changeLanguage({lang: lang}));
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

                {languagesSupport[storeLanguage]}
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
                {/* {
                    language_list.map((key) => {
                        return <MenuItem key={key} onClick={() => handleCloseItem(key)}> {keywordByLang(key) } </MenuItem>
                    })
                } */}

                {Object.keys(languagesSupport).map((lang) => {
                    return (
                        <MenuItem
                        key={lang}
                        onClick={() => {
                            handleCloseItem(lang);
                        }}
                        >
                        {languagesSupport[lang]}
                        </MenuItem>
                    );
                })}
            </Menu>
        </div>
    );

};
export default Languages;