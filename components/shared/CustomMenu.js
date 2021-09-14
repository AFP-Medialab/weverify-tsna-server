import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Link from 'next/link'



export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);  
  const handleClick = (event) => {
    console.log("handleOpen");
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose1 = (event) => {
    setAnchorEl(null);
    console.log("handleClose1");

  };
  
  const handleClose2 = (event) => {
     setAnchorEl(null);
    };

  const nothing = (event) => {
    
    setAnchorEl(null);
    console.log("nothing");
  };

  return (
      
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}  >
        
        Open Menu
      </Button>
      <Menu 
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={nothing}
        

      >
       
       <Link href="/">
        
        <MenuItem onClick={handleClose2}>Back to Intro</MenuItem>
     
        </Link>

          <Link href="/twitterSNA">
        
        <MenuItem onClick={handleClose2}>Twitter-Sna</MenuItem>
     
        </Link>
        

        <Link href="/csvSna">
        
        <MenuItem onClick={handleClose2}>Csv Reader</MenuItem>
     
        </Link>

         
      </Menu>
    </div>
    
  );
}
