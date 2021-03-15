import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageCard from './ImageCard';
import cards from './cards';
import useWindowPosition from './useWindowPosition';
import Link from 'next/link'
import CardActions from '@material-ui/core/CardActions';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import style from './intro1.module.css'


const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
}));
export default function (props) {
  
  const classes = useStyles();
  const checked = useWindowPosition('header');
  

  return (
    
    <div className={classes.root} id="cards">

          <Link href="/twitterSNA">
        <Button className={style.primary}>
     <ImageCard card={cards[1]} checked={checked}  ></ImageCard>
     </Button>
      </Link>
 
          
      <Link href="/csvReader">
        <Button className={style.primary}>
     <ImageCard card={cards[0]} checked={checked}  ></ImageCard>
     </Button>
      </Link>
          
      
    </div>
  );
}
