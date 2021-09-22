import React from "react";
import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import WordTree from "./WordTree";
import { Box } from "@material-ui/core";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

let tweetSimTweetsURL = `${publicRuntimeConfig.baseFolder}/api/similarity/getTweets`;


const DraggableDialog = (props) => {
  const { cluster_id, contentRootWord, open } = props;

  const [tweets, setTweets] = useState([]);
  const [rootWord, setRootWord] = useState(contentRootWord);

  console.log("DraggableDialog cluster_id", cluster_id);
  useEffect(() => {
    fetch(tweetSimTweetsURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: `{"cluster_id":"${cluster_id}"}`,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setTweets(data.tweets);
      });
  }, [cluster_id]);

  //manage dialog modal
  let textInput = React.useRef(); // React use ref to get input value
  let onOnclickHandler = (e) => {
    const rootWordVal = textInput.current.value;
    if (rootWordVal) {
      setRootWord(rootWordVal);
    } else {
      alert("New Root word should not be empty.", rootWordVal);
    }
  };

  const handleClose = () => {
    props.setOpen(false);
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Box display="flex" justifyContent="center" alignItems="center">
            <form>
              <TextField
                inputRef={textInput}
                type="text"
                required
                id="outlined-basic"
                label="Root Word"
                variant="outlined"
                size="small"
              />
              <Button
                onClick={onOnclickHandler}
                variant="outlined"
                color="primary"
              >
                Redraw Tree
              </Button>
            </form>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <WordTree
              data={tweets.map((tweet) => [tweet.full_text_cleaned])}
              rootWord={rootWord}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DraggableDialog;
