import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ImageCard from './ImageCard';
import useWindowPosition from './useWindowPosition';
import Link from 'next/link'
import CardActions from '@material-ui/core/CardActions';
import ButtonBase from '@material-ui/core/ButtonBase';
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import style from './intro1.module.css'

const cards = [
  {
    title: 'Instagram & Facebook CSV Reader',
    description:
      "This tool is used to retrieve important data from Instagram & Facebook CSV files. Find out more details about the App by clicking on the above Image and check how this tool works.",
    imageUrl: '/images/imageCard-f&i.jpg' ,
    time: 1500,
    
  },
  {
    title: 'Twitter SNA',
    description:
      'Twitter SNA is a tool used to retrieve important events from Twitter, check their metrics, charts , the one stat created and shared the tweets and so on. Click on the above Image to find out more details and to see how the App works.',
    imageUrl: '/images/imageCard-twitter.svg',
    time: 1500,
    
  },
];

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
