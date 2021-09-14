import { combineReducers } from "redux";

import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import authenticationReducer from "./authenticationReducer";
import errorReducer from "./errorReducer";
import toolReducer from "./tools/toolReducer";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    twitterSna : twitterSnaReducer,
    userSession: authenticationReducer,
    error : errorReducer,
    tool: toolReducer
});
export default allReducers;