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
  },
  webpack5: false,
  webpack: (config) => {
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        test: /\.(js|ts)x?$/,
       // for webpack 5 use
       // { and: [/\.(js|ts)x?$/] }
      },
      
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async headers(){
    return [{
      source: '/api/i18n/:i18n*',
      headers: [
        {
          key: 'Content-Type',
          value: 'text/tsv',
        },
      ]
    }]
  }
};
