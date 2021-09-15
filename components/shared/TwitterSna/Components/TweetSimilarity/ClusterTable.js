import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "./TablePaginationActions";
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

import Button from "@material-ui/core/Button";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import DraggableDialog from "./DraggableDialog";
import TweetTable from "./TweetTable";
import OverFlownRow from "./OverFlownRow";

const ClusterDescriptionCell = (props) => {
  const { cluster_id, content } = props;
  const contentRootWord = content.split("(")[0];
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  return (
    <React.Fragment>
      <Box style={{ maxHeight: 100, overflow: "auto", padding: 0 }}>
        {content}
      </Box>
      <Tooltip title="Explore tweets wordtree">
        <Button
          variant="outlined"
          color="primary"
          size="small"
          endIcon={<OpenInNewIcon />}
          onClick={handleClickOpen}
          style={{ paddingBottom: 0 }}
        >
          Explore
        </Button>
      </Tooltip>
      {open && (
        <DraggableDialog
          cluster_id={cluster_id}
          contentRootWord={contentRootWord}
          open={open}
          setOpen={setOpen}
        />
      )}
    </React.Fragment>
  );
};

const Row = (props) => {
  const { cluster } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell component="th" scope="row">
          <Tooltip title="Show cluster tweets">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell>
          <ClusterDescriptionCell
            cluster_id={cluster.cluster_id}
            content={cluster.description}
          />
        </TableCell>

        {/* TODO:Should be overflown cells */}
        <OverFlownRow content={cluster.tweet_count} />
        <OverFlownRow content={cluster.screen_name} />
        <OverFlownRow content={cluster.hashtags} />
        <OverFlownRow content={cluster.user_mentions} />
      </TableRow>

      {open && <TweetTable open={open} cluster_id={cluster.cluster_id} />}
    </React.Fragment>
  );
};

// Row.propTypes = {
//   cluster: PropTypes.shape({
//     tweet_count: PropTypes.number.isRequired,
//     hashtags: PropTypes.string.isRequired,
//     senders: PropTypes.string.isRequired,
//     // tweets: PropTypes.arrayOf(
//     //   PropTypes.shape({
//     //     text: PropTypes.string.isRequired,
//     //     screen_name: PropTypes.string.isRequired,
//     //     timestamp: PropTypes.string.isRequired,
//     //     tweetId:PropTypes.string.isRequired,
//     //   }),
//     // ).isRequired,
//     description: PropTypes.string.isRequired,
//     // price: PropTypes.number.isRequired,
//     mentions: PropTypes.string.isRequired,
//   }).isRequired,
// };

const ClusterTable = ({ clusters }) => {
  //Paginations
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, clusters.length - page * rowsPerPage);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper>
      <TableContainer component={Paper} style={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="clusters">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Cluster Description</TableCell>
              <TableCell>#Tweets</TableCell>
              <TableCell>Senders</TableCell>
              <TableCell>Hashtags</TableCell>
              <TableCell>Mentions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? clusters.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : clusters
            ).map((cluster) => (
              <Row key={cluster.cluster_id} cluster={cluster} />
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
        colSpan={6}
        component="div"
        count={clusters.length}
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
  );
};
export default ClusterTable;
