import { userGexfAction } from "../../../components/shared/lib/fetch";

let gexfURL = process.env.REACT_APP_GEXF_GENERATOR_URL;

export default (req, res) => {
  const body = req.body;
  body.esURL = process.env.REACT_APP_GEXF_ES_BASE_URL+"tsnatweets/_search";
  body.esUserURL = process.env.REACT_APP_GEXF_ES_BASE_URL+"tsnausers/_search";

  return userGexfAction(res, gexfURL, body);
};
