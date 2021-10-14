import { userPostAction } from "../../../components/shared/lib/fetch";

export default (req, res) => {
    const headers = {
        "Content-Type": "text/plain",
        "Authorization": "Basic " + process.env.REACT_APP_GATE_CREDIBILITY_AUTH,
    };
    
    let url = process.env.REACT_APP_GATE_CREDIBILITY;
    const body =(req.body); 
    return userPostAction(res, url, body , headers);
}