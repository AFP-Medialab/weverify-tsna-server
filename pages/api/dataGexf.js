import fetch from 'isomorphic-unfetch'
let gexfURL = process.env.REACT_APP_GEXF_GENERATOR_URL;

export default (req, res) => {
    
    // a slow endpoint for getting repo data
    fetch(gexfURL)
      .then(resp => resp.json())
      .then(data => {
        setTimeout(() => {
          res.json(data)
        }, 2000)
      })
    
    return
}
