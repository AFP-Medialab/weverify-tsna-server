import React, { Component } from 'react'
import Typical from 'react-typical'
import { Blob } from 'react-blob'
import CustomMenu from '../../components/shared/CustomMenu'
import { makeStyles } from '@material-ui/core/styles';
import { yellow } from '@material-ui/core/colors'


const useStyles = makeStyles((theme) => ({
  root: {
    color: '#fff',  
    fontFamily: 'Nunito',
    fontSize: '2em',  
    flexGrow: '10',
  },
  }));

export default function SimpleMenu() {

  const classes = useStyles();
    return (        
        <div className='App'>
        <header className='App-header'>
 <h1 className={classes.root} >Try our Apps by scrolling down or clicking on the above arrow.</h1>
 <h1 className={classes.root} >Essayez nos applications en faisant défiler vers le bas ou en cliquant sur la flèche ci-dessus.</h1>
 <h1 className={classes.root} >Pruebe nuestras aplicaciones desplazándose hacia abajo o haciendo clic en la flecha de arriba.</h1>
 <h1 className={classes.root} >Δοκιμάστε τις Εφαρμογές μας κάνοντας κύλιση προς τα κάτω ή κάνοντας κλικ στο παραπάνω βέλος.</h1>

        </header>
    </div>
      
    );
  }
  