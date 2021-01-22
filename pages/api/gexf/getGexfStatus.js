import {userGexfAction} from "../../../components/shared/lib/fetch"

let gexfURL = process.env.REACT_APP_GEXF_GENERATOR_URL + "gexfStatus";

export default (req, res) => {

  return userGexfAction(res, gexfURL, req.body);
};
