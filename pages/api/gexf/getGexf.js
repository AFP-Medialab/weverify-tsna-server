import { userGexfAction } from "../../../components/shared/lib/fetch";

let gexfURL = process.env.REACT_APP_GEXF_GENERATOR_URL;

export default (req, res) => {
  const body = req.body;
  body.esURL = process.env.REACT_APP_ELK_URL;
  body.esUserURL = process.env.REACT_APP_ES_USER_URL;

  return userGexfAction(res, gexfURL, body);
};
