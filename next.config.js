function getBasePath() {
  var basePath = ''

  if (process.env.REACT_APP_BASE_DOC) {
      if (process.env.REACT_APP_BASE_DOC.startsWith("/") ){
          basePath = process.env.REACT_APP_BASE_DOC;
      } else {
          basePath = "/" + process.env.REACT_APP_BASE_DOC;
      }
  }

  console.log("getBasePath() : basePath = " + basePath);

  return basePath
}


module.exports = {
  basePath: getBasePath() ,
    
    publicRuntimeConfig: {
      baseFolder: getBasePath() ,
    }
}