import { userPostAction } from "../../../../components/shared/lib/fetch";

export default (req, res) => {
  const {
    query: { auth },
  } = req;
  const headers = {
    "Content-Type": req.headers["content-type"],
  };
  
  let url = process.env.REACT_APP_AUTH_BASE_URL + "/api/v1/auth/" + auth;
  
  switch (auth) {
    case "refreshtoken": {
      return userPostAction(res, url, req.body, headers);
    }
    default:
      {
        
        return userPostAction(res, url, JSON.stringify(req.body), headers);
      }
  }
  
};
