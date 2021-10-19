import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Head from 'next/head';

import Languages from './shared/languages/languages';
import Toolbar from '@material-ui/core/Toolbar';
import styles from './layout.module.css';
import useMyStyles from './shared/styles/useMyStyles';
import getConfig from 'next/config';
import CustomTitle from "./shared/CustomTitle/CustomTitle"
import HelpDialog from "./shared/HelpDialog/HelpDialogCSV";
import Grid from '@material-ui/core/Grid';
import Link from 'next/link'

const { publicRuntimeConfig } = getConfig();

export const siteTitle = 'Weverify'

function Layout(props) {
    const classes = useMyStyles();
    //keyword from /components/NavItems/tools/TwitterSna.tsv
    //const keyword = props.keyword;

    const handleClick = event => {
        window.open("https://weverify.eu/about/", "_blank");
       
    };

    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta name="description"
                        content="Weverify tools for FakeNews debunking" />
                <meta
                    property="og:image"
                        content={`https://og-image.now.sh/${encodeURI(
                            siteTitle
                            )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />

            </Head>

            <div className={classes.flex}>
                <AppBar position="fixed" color="default" className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img
                            src={`${publicRuntimeConfig.baseFolder}/images/logo-we-verifymini.png`}
                            alt="logo"
                            className={classes.logoLeft}
                            onClick={()=> handleClick()}
                        />
                    </Box>
                   
                    <Languages/>
                    <CustomTitle text={props.title}/>
                    <Grid>
                {<HelpDialog paragraphs={["aboutcsv_intro", "aboutcsv_count", "aboutsna_timeline", "aboutcsv_most_RT", "aboutcsv_most_liked",
                 "aboutcsv_most_active", "aboutcsv_most_mentions", "aboutcsv_bubblegraph", "aboutcsv_heatmap", "aboutcsv_most_associated_hashtag", "aboutcsv_ssgraph",
                 "aboutcsv_wordcloud", "aboutcsv_urls"]}
                             />
                }
            </Grid>
                    </Toolbar>
                </AppBar>

            </div>
            <div>
                {props.children}
            </div>
        </div>
    )
  }
  
  export default Layout