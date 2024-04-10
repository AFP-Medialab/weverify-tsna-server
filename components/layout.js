import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
//import HelpDialog from "../components/shared/HelpDialog/HelpDialog";
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import getConfig from 'next/config';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CustomTitle from "../components/shared/CustomTitle/CustomTitle";
import WeVerifyIcon from "../images/SVG/NavBar/WeVerify.svg";
import InVIDIcon from "../images/SVG/NavBar/InVID.svg";
import VeraIcon from "../images/SVG/NavBar/vera-logo_black.svg";
import styles from './layout.module.css';
import Languages from './shared/languages/languages';
import useMyStyles from './shared/styles/useMyStyles';
const { publicRuntimeConfig } = getConfig();

export const siteTitle = 'Weverify'

function Layout(props) {
    const classes = useMyStyles();
    const router = useRouter();
    //keyword from /components/NavItems/tools/TwitterSna.ts

    const handlePush = () => {
        router.push('/', undefined, { shallow: true })
    };

    return (
        <div className={styles.container}>
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

                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Box display={{ xs: 'none', md: 'block' }} p={1}>
                                <WeVerifyIcon style={{ height: "auto", minWidth: "48px", width: { sm: "48px", md: "80px" } }} onClick={() => handlePush()}/>
                            </Box>
                            <Box display={{ xs: 'none', md: 'block' }} p={1}>
                                <InVIDIcon style={{ height: "auto", minWidth: "48px", width: { sm: "48px", md: "80px" }}} onClick={() => handlePush()}/>
                            </Box>
                            <Box display={{ xs: 'none', md: 'block' }} p={1}>
                                <VeraIcon style={{ height: "auto", minWidth: "48px", width: { sm: "48px", md: "80px" }}} onClick={() => handlePush()}/>
                            </Box>
                            
                            <Grid item xs>
                                <CustomTitle text={props.title} />
                            </Grid>
                            <Languages />
                        </Grid>

                    </Toolbar>
                </AppBar>

            </div>
        {props.children}</div>
    )
  }
  
  export default Layout


  /*

{<HelpDialog paragraphs={["aboutsna_intro", "aboutsna_count", "aboutsna_timeline", "aboutsna_most_RT", "aboutsna_most_liked",
                 "aboutsna_most_active", "aboutsna_most_mentions", "aboutsna_bubblegraph", "aboutsna_heatmap", "aboutsna_most_associated_hashtag", "aboutsna_ssgraph",
                 "aboutsna_wordcloud", "aboutsna_gexf_export", "aboutsna_urls"]}
                             />
                }


  */