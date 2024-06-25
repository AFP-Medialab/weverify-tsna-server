import useMyStyles from "../styles/useMyStyles";
import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import Linkify from 'react-linkify';
import { i18nLoadNamespace } from "../languages/i18nLoadNamespace";
import { WARNINGINFO_PATH } from "../languages/LanguagePaths";


const OnWarningInfo = (props) => {
    const classes = useMyStyles();
    const keyword = i18nLoadNamespace(WARNINGINFO_PATH);

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
            <WarningRoundedIcon fontSize={"large"} onClick={handleClick}/>
            {
                checked === true &&
                <div className={classes.onClickInfo}>
                    <Typography variant={"body2"}><Linkify componentDecorator={componentDecorator}>{keyword(props.keyword)}</Linkify></Typography>
                </div>
            }
        </div>
    )
};
export default OnWarningInfo;