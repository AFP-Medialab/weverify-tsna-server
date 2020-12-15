import fetch from 'isomorphic-unfetch'
let feedBackURL = process.env.REACT_APP_MY_WEB_HOOK_URL;

export default (req, res) => {
    
    // a slow endpoint for getting repo data
    fetch(feedBackURL)
      .then(resp => resp.json())
      .then(data => {
        setTimeout(() => {
          res.json(data)
        }, 2000)
      })
    
    return
}
