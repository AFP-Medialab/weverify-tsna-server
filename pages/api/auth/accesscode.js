import fetch from 'isomorphic-unfetch'

const authSrvBaseURL = `${process.env.REACT_APP_AUTH_BASE_URL}/api/v1/auth/accesscode`;

export default (req, res) =>{
   console.log("request");
    console.log(authSrvBaseURL);
    console.log(req.body);

    
    fetch(authSrvBaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(req.body)
    })
    .then(res => res.status)
    console.log(res);
    return; 
        
}