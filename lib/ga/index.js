import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const analyticsUrl = `${publicRuntimeConfig.baseFolder}/api/analytics/matomo`;

// log the pageview with their URL and events
export const matomoCall = (url, event) => {
    
    // const matomoUrl = publicRuntimeConfig.matomoUrl;
    
    const matomo_site = publicRuntimeConfig.matomoSite;



    // const url_params = new URLSearchParams();

    // url_params.append("idsite", matomo_site);
    // url_params.append("url", "urn:/sna" + url);
    // url_params.append("rec", 1);
    // url_params.append("apiv", 1);
    
    // url_params.append("cookie", 1);

    // if(event) {
    //   url_params.append("action_name", event);
    // }
    // else {
    //   url_params.append("action_name", url);
    // }

    let params = {idsite: matomo_site, url: "urn:/sna" + url}

    if (event) {
      params.actionName = event;
    }
    else {
      params.actionName = url;
    }

    params = JSON.stringify(params);

    console.log("params: ", params);
    
    fetch(analyticsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
  }
  