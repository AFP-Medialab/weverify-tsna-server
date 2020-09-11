import { combineReducers } from "redux";

import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer
});
export default allReducers;