import { combineReducers } from "redux";

import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import csvSnaReducer from "./tools/csvSnaReducer";
import authenticationReducer from "./authenticationReducer";
import errorReducer from "./errorReducer";


const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    twitterSna : twitterSnaReducer,
    csvSna : csvSnaReducer,
    userSession: authenticationReducer,
    error : errorReducer
});
export default allReducers;