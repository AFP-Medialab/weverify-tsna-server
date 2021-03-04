import {userPostAction} from "../../../components/shared/lib/fetch"
let feedBackURL = process.env.REACT_APP_MY_WEB_HOOK_URL;

export default (req, res) =>{
    const headers = {
        "Content-Type": "application/json"
      };
      
    return userPostAction(res, feedBackURL, req.body, headers);
}