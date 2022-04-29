import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// log the pageview with their URL
export const pageview = (url) => {
    let key = publicRuntimeConfig.gakey
    window.gtag('config', key , {
      page_path: url,
    })
  }
  
  // log specific events happening.
  export const event = ({ action, params }) => {
    window.gtag('event', action, params)
  }
  