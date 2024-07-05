function getBasePath() {
  var basePath = "";

  if (process.env.REACT_APP_BASE_DOC) {
    if (process.env.REACT_APP_BASE_DOC.startsWith("/")) {
      basePath = process.env.REACT_APP_BASE_DOC;
    } else {
      basePath = "/" + process.env.REACT_APP_BASE_DOC;
    }
  }

  

  return basePath;
}

module.exports = {
  
  basePath: getBasePath(),
  publicRuntimeConfig: {
    baseFolder: getBasePath(),
    matomoUrl: process.env.REACT_APP_MATOMO_URL,
    matomoSite: process.env.MATOMO_SITE,
    gexfBase: process.env.REACT_APP_GEXF_GENERATOR_URL,
  },
  webpack: (config) => {
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] }, 
      use: ['@svgr/webpack'],
    });
    return config;
  },
  output: "standalone",
};
