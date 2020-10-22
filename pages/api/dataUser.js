import fetch from 'isomorphic-unfetch'
let elasticSearchUserURL = process.env.REACT_APP_ES_USER_URL;

export default (req, res) => {
    
    // a slow endpoint for getting repo data
    fetch(elasticSearchUserURL)
      .then(resp => resp.json())
      .then(data => {
        setTimeout(() => {
          res.json(data)
        }, 2000)
      })
    
    return
}
