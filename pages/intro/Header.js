import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Collapse } from '@material-ui/core';
import SortIcon from '@material-ui/icons/Sort';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as Scroll } from 'react-scroll';
import CustomMenu from './CustomMenu_intro'
import Text from './Text'
import { Button } from 'semantic-ui-react'



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Nunito',
  },
  appbar: {
    background: 'none',
  },
  appbarWrapper: {
    width: '80%',
    margin: '0 auto',
  },
  appbarTitle: {
    color: '#fff',
    flexGrow: '1',
    
  },
  icon: {
    color: '#fff',
    fontSize: '2rem',
  },
  colorText: {
    color: '#5AFF3D',
  },
  container: {
    textAlign: 'center',
  },
  title: {
    color: '#fff',
    fontSize: '4.5rem',
  },
  goDown: {
    color: '#5AFF3D',
    fontSize: '4rem',
  },
  appbarButton: {
    color: '#fff',
    flexGrow: '1',
    background:'transparent',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    fontSize: '2rem'
  }
}));
export default function Header() {

  const handleClick = event => {
    window.open("https://weverify.eu/about/", "_blank");
   
};
  const classes = useStyles();
  const [checked, setChecked] = useState(false);
  useEffect(() => {
    setChecked(true);
  }, []);
  return (
    <div className={classes.root} id="header">
      <AppBar className={classes.appbar} elevation={0}>
      
        <Toolbar className={classes.appbarWrapper}>
          
          <h1 className={classes.appbarTitle} >
            <Button onClick={handleClick} className={classes.appbarButton} >
            We<span className={classes.colorText}>Verify.</span>
            </Button>
          </h1>
          
          <IconButton>
            <CustomMenu/>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Collapse
        in={checked}
        {...(checked ? { timeout: 1000 } : {})}
        collapsedHeight={50}
      >
        <div className={classes.container}>
          <h1 className={classes.title}>
            Welcome to <br />
            We<span className={classes.colorText}>Verify.</span>
          </h1>
          <Scroll to="cards" smooth={true}>
            <IconButton>
              <ExpandMoreIcon className={classes.goDown} />
            </IconButton>
          </Scroll>
          <Text className={classes.title}/>
        </div>
      </Collapse>
    </div>
  );
}
