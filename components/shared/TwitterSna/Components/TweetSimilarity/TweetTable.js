import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Collapse from "@material-ui/core/Collapse";
import { useEffect, useState } from "react";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "./TablePaginationActions";
import OverFlownCell from "./OverFlownRow";
import parse from "html-react-parser";
import CircularProgress from "@material-ui/core/CircularProgress";
import useMyStyles from "../../../styles/useMyStyles";
import { addLinkToEachItem, Consts } from "./Constants";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

let tweetSimTweetsURL = `${publicRuntimeConfig.baseFolder}/api/similarity/getTweets`;

const splitter = ", ";

const TweetTable = ({ cluster_id, open }) => {
  const [tweets, setTweets] = useState([]);
  const classes = useMyStyles();

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

  function userHandleStats(tweet) {
    //TODO this is not being used.
    const { id_str, user_id_str, screen_name, tweet_count } = tweet;

    let screen_name_indices = new Map(); // a map of screen_name with key holding the indices of the same screen_name
    let screen_names = screen_name.split(splitter);
    for (var i = 0; i < screen_names.length; ++i) {
      if (!screen_name_indices[screen_names[i]])
        screen_name_indices[screen_names[i]] = [];
      screen_name_indices[screen_names[i]].push(i);
    }

    screen_name_indices = new Map(
      [...Object.entries(screen_name_indices)].sort(
        (a, b) => b[1].length - a[1].length
      )
    );
    var res = "";
    // BU asagidaki map i iterate edip dogru durust sort edilmis sekilde div icinde gostermek istiyoruz.
    // debugger;
    for (let item in screen_name_indices.entries()) {
      res += "<div>";
      const sn = item[0];
      const indices = item[1];
      const user_tweet_count = indices.length;
      const unique_user_ids = [...new Set(indices.map((i) => user_id_str[i]))];
      if (unique_user_ids.length == 1)
        res += `${sn} sent this tweet ${user_tweet_count} times.`;
      else if (unique_user_ids.length > 1)
        res += `${sn} created ${unique_user_ids.length} account with this handle and sent this tweet ${user_tweet_count} times`;
      res += "</div>";
      console.log(res);
    }
    console.log("res", res);
    return parse(res);
  }

  //Paginations
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, tweets.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderTop: "unset" } }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Tweets
              </Typography>
              {tweets.length > 0 && (
                <Paper>
                  <TableContainer component={Paper}>
                    <Table size="small" aria-label="tweets" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell>Text</TableCell>
                          <TableCell>#Tweet(s)</TableCell>
                          <TableCell>TweetID(s)</TableCell>
                          {/* <TableCell>UserID(s)</TableCell> */}
                          <TableCell>Handle(s)</TableCell>
                          <TableCell>Lang(s)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(rowsPerPage > 0
                          ? tweets.slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                          : tweets
                        ).map((tweet) => (
                          <TableRow key={tweet.id_str}>
                            <TableCell>{tweet.full_text_cleaned}</TableCell>
                            <OverFlownCell content={tweet.tweet_count} />
                            <OverFlownCell
                              content={addLinkToEachItem(
                                tweet.id_str,
                                Consts.STATUS_LINK
                              )}
                            />
                            {/* <OverFlownCell content={userHandleStats(tweet)} /> */}
                            {/* tweet.user_id_str */}
                            <OverFlownCell
                              content={addLinkToEachItem(
                                tweet.screen_name,
                                Consts.USER_LINK
                              )}
                            />
                            <TableCell>{tweet.lang}</TableCell>
                          </TableRow>
                        ))}
                        {emptyRows > 0 && (
                          <TableRow>
                            <TableCell colSpan={4} />
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={4}
                    component={Paper}
                    count={tweets.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: { "aria-label": "rows per page" },
                      native: true,
                    }}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </Paper>
              )}{" "}
              {
                // console.log("tweets", tweets)
                tweets.length === 0 && (
                  <CircularProgress className={classes.circularProgress} />
                )
              }
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

// bu user_id ve screen_nameler icin de count filan koymak lazim, hatta guzel tooltips
// vs de olabilir.

export default TweetTable;
