import fetch from 'isomorphic-unfetch';

let elasticURL = process.env.REACT_APP_ELK_URL;
let request ={
    "keywordList": [""]
};
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
       // console.log("rpoioo " + process(data));
        setTimeout(() => {

            //const words = createWordCloud(data["hits"], request);
            //res.json({"tweets": data, "words": words})
            res.json(data);
            }, 2000)
    })
    return;
}
/*function process(data){
    
    const words = createWordCloud(data, request);
     console.log("words " + JSON.stringify(words));
     //return {"tweets": data, "words": words};
 
 }*/
