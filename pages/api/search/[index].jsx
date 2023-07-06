import { userPostAction } from "../../../components/shared/lib/fetch";

const headers = {
  "Content-Type": "application/vnd.elasticsearch+json;compatible-with=7",
  Accept: "application/vnd.elasticsearch+json;compatible-with=7",
};

// prepare authorization header, if Elasticsearch requires it
if (process.env.hasOwnProperty("REACT_APP_ES_USERNAME")) {
  const username = process.env.REACT_APP_ES_USERNAME;
  const password = process.env.REACT_APP_ES_PASSWORD;
  const authHeader = new Buffer(`${username}:${password}`).toString("base64");
  headers["Authorization"] = `Basic ${authHeader}`;
}

export default (req, res) => {
  const {
    query: { index },
  } = req;

  switch (index) {
    case "getTweets": {
      let url = process.env.REACT_APP_ELK_URL;
      const body = JSON.stringify(req.body);
      return userPostAction(res, url, body, headers);
    }
    case "getUsers": {
      let url = process.env.REACT_APP_ES_USER_URL;
      const body = JSON.stringify(req.body);
      return userPostAction(res, url, body, headers);
    }
    default: {
      res.status(404).json({ error: "not exist" });
    }
  }
};
