import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    console.log('current target',event.currentTarget);
  };

  const handleClose = (event) => {
    console.log('current target111',event.currentTarget);
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Open Menu
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Twitter-Sna</MenuItem>
        <MenuItem onClick={handleClose}>CSV-Reader</MenuItem>
      </Menu>
    </div>
  );
}
