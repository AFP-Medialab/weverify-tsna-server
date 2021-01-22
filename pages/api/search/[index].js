import { userPostAction } from "../../../components/shared/lib/fetch";

export default (req, res) => {
    const {
      query: { index },
    } = req;

    const headers = {
      "Content-Type": "application/json",
    };
   
    switch(index){
        case "getTweets":{
            let url = process.env.REACT_APP_ELK_URL;
            const body = JSON.stringify(req.body);
            return userPostAction(res, url, body , headers);
        }
        case "getUsers":{
            let url = process.env.REACT_APP_ES_USER_URL;
            const body = JSON.stringify(req.body);
            return userPostAction(res, url, body, headers);
        }
        default:{
            res.status(404).json({ error: 'not exist' });
        }
    }
   
}  
