import useMyStyles from "../styles/useMyStyles";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';
import Linkify from 'react-linkify';
import { useSelector } from "react-redux";
import { i18nLoadNamespaceNoSuspense } from "../languages/i18nLoadNamespace";
import { INFO_PATH } from "../languages/LanguagePaths";

const OnClickInfo = (props) => {

    
    var keyword = (word) => "";

    const {t, ready} = i18nLoadNamespaceNoSuspense(INFO_PATH);

    if(ready) keyword = t;

    const classes = useMyStyles();

    const [checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(props.trueClick ? true : false);
    }, [props.keyword]);

    const handleClick = () => {
        setChecked((prev) => !prev);
    };

    const componentDecorator = (href, text, key) => (
        <a href={href} key={key} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
    );

    return (
        <div>
            <WbIncandescentIcon fontSize={"large"} onClick={handleClick}/>
            {
                checked === true &&
                <div className={classes.onClickInfo}>
                    <Typography variant={"body2"}><Linkify componentDecorator={componentDecorator}>{keyword(props.keyword)}</Linkify></Typography>
                </div>
            }
        </div>
    )
};
export default OnClickInfo;