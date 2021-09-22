import { userPostAction } from "../../../components/shared/lib/fetch";

let tweetSimClusterURL = process.env.REACT_APP_TWEET_SIMILARITY_URL+ "/similarity/clusters";
let tweetSimTweetsURL = process.env.REACT_APP_TWEET_SIMILARITY_URL+ "/similarity/tweets";
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
            const body = JSON.stringify(req.body);
            return userPostAction(res, url, body , headers);
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
