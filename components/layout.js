import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import Languages from './shared/languages/languages';
import Toolbar from '@material-ui/core/Toolbar';
import styles from './layout.module.css';
import useMyStyles from './shared/styles/useMyStyles';
import getConfig from 'next/config';
import CustomTitle from "../components/shared/CustomTitle/CustomTitle"
//import HelpDialog from "../components/shared/HelpDialog/HelpDialog";
import Grid from '@material-ui/core/Grid';
import WeVerifyIcon from "../images/SVG/NavBar/WeVerify.svg";
import ToolsIcon from "../images/SVG/NavBar/Tools.svg";
const { publicRuntimeConfig } = getConfig();
import { useRouter } from 'next/router';

export const siteTitle = 'Weverify'

function Layout(props) {
    const classes = useMyStyles();
    const router = useRouter();
    //keyword from /components/NavItems/tools/TwitterSna.ts

    const handleClick = event => {
        window.open("https://weverify.eu/about/", "_blank");
    };

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

                            <Box display={{ xs: 'none', md: 'block' }}>
                                <WeVerifyIcon style={{ cursor: 'pointer' }} onClick={() => handlePush()}/>
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