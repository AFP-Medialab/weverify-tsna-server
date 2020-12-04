import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Head from 'next/head';
import Languages from './shared/languages/languages';
import Toolbar from '@material-ui/core/Toolbar';
import styles from './layout.module.css';
import useMyStyles from './shared/styles/useMyStyles';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const siteTitle = 'Weverify'

function Layout({ children }) {
    const classes = useMyStyles();
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
                    <Box display={{xs: 'none', md: 'block'}}>
                        <img
                            src={`${publicRuntimeConfig.baseFolder}/images/logo-we-verifymini.png`}
                            alt="logo"
                            className={classes.logoLeft}
                        />
                    </Box>
                    <Languages/>
                    <div className={classes.grow}/>
                    </Toolbar>
                </AppBar>
            </div>
        {children}</div>
    )
  }
  
  export default Layout