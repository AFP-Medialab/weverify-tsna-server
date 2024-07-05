import { userAnalyticsAction, userPostAction } from "../../../components/shared/lib/fetch";

let url = process.env.REACT_APP_MATOMO_URL;
let matomo_site = process.env.MATOMO_SITE;

export default (req, res) => {

  const body = req.body;
  
  return userAnalyticsAction (res, url, body, matomo_site);
  
};
