import Document, { Html, Head, Main, NextScript } from 'next/document'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default class MyDocument extends Document {
    
    render() {
      return (
        <Html>
          <Head>
            {/* Global Site Tag (gtag.js) - Google Analytics */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${publicRuntimeConfig.gakey}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${publicRuntimeConfig.gakey}', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
    }
  }