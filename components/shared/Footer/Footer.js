import React from "react";
import useMyStyles from "..//styles/useMyStyles";
import useLoadLanguage from "../hooks/useLoadLanguage";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";


const Footer = (props) => {
    const classes = useMyStyles();
    const keyword = useLoadLanguage("/localDictionary/components/Shared/Footer.tsv");

    let provideBy, link, linkLabel, contactUs;

    provideBy = keyword("apf_part_1");
    link = [keyword("apf_link"), keyword("usfd_link"), keyword("eudisinfolab_link")];
    linkLabel = [keyword("apf_link_label"), ", " + keyword("usfd_link_label"), " " + keyword("and") + " " + keyword("eudisinfolab_link_label")];
    contactUs = keyword("apf_part_2");



    return (
        <div className={classes.footer}>
            <Typography variant={"body2"}>
                {
                    provideBy
                }
                {
                    linkLabel.constructor === Array && link.constructor === Array ? (
                        link.map((element, index) => {
                            return (
                                <Link target="_blank" href={element} key={index}>
                                    {
                                        linkLabel[index]
                                    }
                                </Link>
                            )
                        })
                    ) : (
                            <Link target="_blank" href={link}>
                                {
                                    linkLabel
                                }
                            </Link>
                        )
                }
            </Typography>

            <Typography variant={"body2"}>
                {
                    contactUs
                }
            </Typography>
        </div>
    )
};
export default Footer;