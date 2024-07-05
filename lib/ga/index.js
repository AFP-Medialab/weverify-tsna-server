import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const analyticsUrl = `${publicRuntimeConfig.baseFolder}/api/analytics/matomo`;

// log the pageview with their URL and events
export const matomoCall = (url, event) => {
    
    const page = (url === "/") ? "/home" : url
    let params = {url: "urn:/tsna" + page}

    if (event) {
      params.actionName = event;
    }
    else {
      params.actionName = page;
    }

    params = JSON.stringify(params);

    
    fetch(analyticsUrl, {
      method: "POST",
      body: params,
    });
  }
  