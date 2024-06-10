import React, { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Transition from "react-transition-group/Transition";
import HelpIcon from "@mui/icons-material/Help";
import { i18nLoadNamespace } from "../languages/i18nLoadNamespace";

//const tsv = "/localDictionary/components/Shared/aboutTsna.tsv";
const tsv = "/components/Shared/aboutTsna";

const HelpDialog = (props) => {
  const [open, setOpen] = useState(false);

  // a list of keywords found in a tsv file. pass in tsv labels and tsv file location
  const paragraphs = props.paragraphs;
  const keyword = i18nLoadNamespace(tsv);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <HelpIcon onClick={handleClickOpen} fontSize="large" color="action" />
      <Dialog maxWidth={"xl"} TransitionComponent={Transition} open={open}>
        <DialogTitle>
          <Typography variant={"h4"}>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
            {keyword("aboutcsv_title")}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {paragraphs.map((text, index) => (
            <Typography gutterBottom key={index}>
              {
                <div
                  className={"content"}
                  dangerouslySetInnerHTML={{ __html: keyword(text) }}
                ></div>
              }
            </Typography>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HelpDialog;
