import fetch from 'isomorphic-unfetch'
  let elasticURL = process.env.REACT_APP_ELK_URL;
  export default (req, res) => {
    
      // a slow endpoint for getting repo data
      fetch(elasticURL)
        .then(resp => resp.json())
        .then(data => {
          setTimeout(() => {
            res.json(data)
          }, 2000)
        })
      
      return
  }

