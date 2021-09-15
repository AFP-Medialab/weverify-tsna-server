import React from "react";
import TableCell from "@material-ui/core/TableCell";
import Box from "@material-ui/core/Box";

const OverFlownRow = (props) => {
  const { content } = props;
  return (
    <TableCell>
      <Box style={{ maxHeight: 100, maxWidth:200,  overflow: "auto" }}>{content}</Box>
    </TableCell>
  );
};



export default OverFlownRow;