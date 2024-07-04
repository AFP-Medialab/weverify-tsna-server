import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// log the pageview with their URL
export const pageview = (url) => {
    let matomoUrl = publicRuntimeConfig.matomoUrl;
    
    
    const matomo_site = publicRuntimeConfig.matomoSite;

    const url_params = new URLSearchParams();


    url_params.append("idsite", matomo_site);
    url_params.append("url", "urn:/home" + url);
    url_params.append("action_name", "home" + url);
    url_params.append("cookie", 1);
    
    fetch(matomoUrl, {
      method: "POST",
      // mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: url_params,
    });
  }
  
  // log specific events happening.
  // export const event = ({ action, params }) => {
  //   window.gtag('event', action, params)
  //   console.log("event??");
  // }
  