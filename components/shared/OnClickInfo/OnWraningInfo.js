import useMyStyles from "../styles/useMyStyles";
import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import WarningRoundedIcon from '@material-ui/icons/WarningRounded';
import useLoadLanguage from "../hooks/useLoadLanguage";
import Linkify from 'react-linkify';

const tsv = "/localDictionary/components/Shared/OnClickInfo.tsv";

const OnClickInfo = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage(tsv);

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
export default OnClickInfo;