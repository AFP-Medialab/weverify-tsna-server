import fetch from 'isomorphic-unfetch'

let elasticURL = process.env.REACT_APP_ELK_URL;

export default (req, res) =>{
   /* console.log("request");
    console.log(elasticURL);
    console.log(req.body);*/

    
    fetch(elasticURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(req.body)
    }).then(res => res.json())
    .then(data => {
        setTimeout(() => {
            res.json(data)
            }, 2000)
    })
    return;
    
        
}