import fetch from 'isomorphic-unfetch';

let gexfURL = process.env.REACT_APP_GEXF_GENERATOR_URL;

export default (req, res) =>{
   
    fetch(gexfURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(req.body)
    }).then(res => res.json())
    .then(data => {
        setTimeout(() => {
            res.json(data);
            }, 2000)
    })
    return;
}