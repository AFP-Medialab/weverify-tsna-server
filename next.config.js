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
  webpack: (config) => {
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
    return config;
  },
};
