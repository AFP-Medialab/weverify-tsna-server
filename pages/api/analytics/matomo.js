import { userAnalyticsAction, userPostAction } from "../../../components/shared/lib/fetch";

let url = process.env.REACT_APP_MATOMO_URL;

export default (req, res) => {

  // const headers = {
  //   "Content-Type": "application/json",
  //   Authorization: req.headers.authorization,
  // };

  // let body = JSON.stringify(req.body);
  // body = JSON.parse(body);
  const body = req.body;
  const headers = new Headers(req.headers);
  headers.delete('content-length');

  console.log("body: ", body);

  // return userPostAction(res, url, body, headers, "text");
  return userAnalyticsAction (res, url, body, headers);
  
};
