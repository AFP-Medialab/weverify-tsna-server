import {userPostAction} from "../../../components/shared/lib/fetch"
let feedBackURL = process.env.REACT_APP_MY_WEB_HOOK_URL;

export default (req, res) =>{
    const headers = {
        "Content-Type": "application/json"
      };
    let body = JSON.stringify(req.body);
    return userPostAction(res, feedBackURL, body, headers, "text");
}