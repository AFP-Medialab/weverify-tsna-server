import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import createPalette from '@material-ui/core/styles/createPalette';
import CSV from '../csvReader';
import Link from 'next/link'
import style from '../intro/intro1.module.css'
import { makeStyles } from '@material-ui/core/styles';
import SortIcon from '@material-ui/icons/Sort';



const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',  
    fontFamily: 'Nunito',
    fontSize: '1.5em',  
    flexGrow: '10',
  },
  appbarTitle: {
    color: '#5AFF3D', 
    fontFamily: 'Nunito',
    fontSize: '1.5em',  
    flexGrow: '10'
  },
  icon: {
    color: '#fff',
    fontSize: '2rem',
  },
  }));


export default function SimpleMenu() {
  const classes = useStyles();
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
      <SortIcon className={classes.icon}  />
      <div className={classes.root}>
      Open<span className={classes.appbarTitle}>Menu.</span>
          </div>
        
      </Button>
      <Menu 
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={nothing}
        

      >
       
       

          <Link href="/twitterSNA">
        
        <MenuItem onClick={handleClose2}>Twitter-Sna</MenuItem>
     
        </Link>
        

        <Link href="/csvReader">
        
        <MenuItem onClick={handleClose2}>Csv Reader</MenuItem>
     
        </Link>

         
      </Menu>
    </div>
    
  );
}
