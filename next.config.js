function getBasePath() {
  var basePath = "";

  if (process.env.REACT_APP_BASE_DOC) {
    if (process.env.REACT_APP_BASE_DOC.startsWith("/")) {
      basePath = process.env.REACT_APP_BASE_DOC;
    } else {
      basePath = "/" + process.env.REACT_APP_BASE_DOC;
    }
  }

  console.log("getBasePath() : basePath = " + basePath);

  return basePath;
}

module.exports = {
  async rewrites() {
    let basePath = getBasePath();
    return [
      {
        source: basePath + "/api/wrapper/auth/:path",
        destination: process.env.REACT_APP_AUTH_BASE_URL + "/api/v1/auth/:path",
      },
      {
        source: basePath + "/api/wrapper/collect",
        destination: process.env.REACT_APP_AUTH_BASE_URL + "/collect",
      },
      {
        source: basePath + "/api/wrapper/status/:essid",
        destination: process.env.REACT_APP_AUTH_BASE_URL + "/status/:essid",
      },
      {
        source: basePath + "/api/search/getTweets",
        destination: process.env.REACT_APP_ELK_URL,
      },
      {
        source: basePath + "/api/search/getUsers",
        destination: process.env.REACT_APP_ES_USER_URL,
      },
      {
        source: basePath + "/api/search/getGexf",
        destination: process.env.REACT_APP_GEXF_GENERATOR_URL,
      },
      {
        source: basePath + "/api/search/getGexfStatus",
        destination: process.env.REACT_APP_GEXF_GENERATOR_URL + "gexfStatus",
      },
      {
        source: basePath + "/api/support/getfeedBack",
        destination: process.env.REACT_APP_MY_WEB_HOOK_URL,
      },
    ];
  },
  publicRuntimeConfig: {
    baseFolder: getBasePath(),
  },
  webpack: (config) => {
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    return config;
  },
};
