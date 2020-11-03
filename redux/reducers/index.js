import { combineReducers } from "redux";

import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import authenticationReducer from "./authenticationReducer";
import errorReducer from "./errorReducer";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    twitterSna : twitterSnaReducer,
    userSession: authenticationReducer,
    error : errorReducer
});
export default allReducers;