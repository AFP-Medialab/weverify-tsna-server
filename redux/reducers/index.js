import { combineReducers } from "redux";

import languageReducer from "../slices/langugagesSlice";
import dictionaryReducer from "../slices/dictionarySlice";
import twitterSnaReducer from "./tools/twitterSnaReducer";
import crowdTangleSnaReducer from "./tools/crowdTangleSnaReducer";
import authenticationReducer from "../slices/authentificationSlice";
import errorReducer from "../slices/errorSlice";
import snaTypeReducer from "./tools/snaTypeReducer";
import connectionReducer from '../slices/connectionSlice'

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    twitterSna : twitterSnaReducer,
    ctSna : crowdTangleSnaReducer,
    sna : snaTypeReducer,
    userSession: authenticationReducer,
    error : errorReducer,
    conn: connectionReducer
});
export default allReducers;