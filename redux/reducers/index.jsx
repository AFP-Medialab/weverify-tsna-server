import { combineReducers } from "redux";

import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import crowdTangleSnaReducer from "./tools/crowdTangleSnaReducer";
import authenticationReducer from "./authenticationReducer";
import errorReducer from "./errorReducer";
import toolReducer from "./tools/toolReducer";
import snaTypeReducer from "./tools/snaTypeReducer";
import connectionReducer from "./connectionReducer";

const allReducers = combineReducers({
  language: languageReducer,
  dictionary: dictionaryReducer,
  twitterSna: twitterSnaReducer,
  ctSna: crowdTangleSnaReducer,
  sna: snaTypeReducer,
  userSession: authenticationReducer,
  error: errorReducer,
  tool: toolReducer,
  conn: connectionReducer,
});
export default allReducers;
