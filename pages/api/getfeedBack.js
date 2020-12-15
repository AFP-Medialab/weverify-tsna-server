import fetch from 'isomorphic-unfetch';
let feedBackURL = process.env.REACT_APP_MY_WEB_HOOK_URL;

export default (req, res) =>{
   
    fetch(feedBackURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(req.body)
    }).then(res => {
        /*if (!res.ok) {
            error(res);
            throw res
        }*/
        
        return res
    })
    .then(success)
    return;
}