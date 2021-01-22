import { userPostAction } from "../../../components/shared/lib/fetch";

let collectURL = process.env.REACT_APP_AUTH_BASE_URL + "/collect";

export default (req, res) => {

  const headers = {
    "Content-Type": "application/json",
    Authorization: req.headers.authorization,
  };
  const body = JSON.stringify(req.body);
  return userPostAction(res, collectURL, body, headers);
};
