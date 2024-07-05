import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const analyticsUrl = `${publicRuntimeConfig.baseFolder}/api/analytics/matomo`;

// log the pageview with their URL and events
export const matomoCall = (url, event) => {
    

    let params = {url: "urn:/home" + url}

    if (event) {
      params.actionName = event;
    }
    else {
      params.actionName = url;
    }

    params = JSON.stringify(params);

    
    fetch(analyticsUrl, {
      method: "POST",
      body: params,
    });
  }
  