import { userPostAction } from "../../../components/shared/lib/fetch";

let tweetSimClusterURL = process.env.REACT_APP_TWEET_SIMILARITY_URL+ "/similarity/clusters"; // TODO temporarly changed to csv file which should be + "/similarity/clusters" or "/similarity/csv"
let tweetSimTweetsURL = process.env.REACT_APP_TWEET_SIMILARITY_URL+ "/similarity/tweets";
let elasticURL = process.env.REACT_APP_ELK_URL;
export default (req, res) => {
    const {
      query: { index },
    } = req;

    const headers = {
      "Content-Type": "application/json",
      Authorization: req.headers.authorization,
    };
   
    switch(index){
        case "getClusters":{
            let url = tweetSimClusterURL;
            // add the ES url to the request.
            let body = req.body
            body['elasticURL']=elasticURL;
            const bodyJSON = JSON.stringify(body);
            return userPostAction(res, url, bodyJSON , headers);
        }
        case "getTweets":{
            let url = tweetSimTweetsURL;
            const body = JSON.stringify(req.body);
            return userPostAction(res, url, body, headers);
        }
        default:{
            res.status(404).json({ error: 'not exist' });
        }
    }
   
}  
