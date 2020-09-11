import allReducers from "./reducers";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { createStore} from "redux";

const makeStore = context => createStore(allReducers);
export const wrapper = createWrapper(makeStore, {debug: true});