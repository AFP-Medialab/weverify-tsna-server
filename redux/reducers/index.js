import { combineReducers } from "redux";

import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import authenticationReducer from "./authenticationReducer";
import errorReducer from "./errorReducer";
import facebookSnaReducer from "./tools/facebookSnaReducer";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    twitterSna : twitterSnaReducer,
    facebookSna : facebookSnaReducer,
    userSession: authenticationReducer,
    error : errorReducer
});
export default allReducers;