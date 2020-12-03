import fetch from 'isomorphic-unfetch'
let elasticSearchUserURL = process.env.REACT_APP_ES_USER_URL;

export default (req, res) =>{
   
     fetch(elasticSearchUserURL, {
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