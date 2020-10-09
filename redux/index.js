import allReducers from "./reducers";
import { createWrapper } from "next-redux-wrapper";
import { createStore, applyMiddleware} from "redux";
import thunkMiddleware from 'redux-thunk'

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
      const { composeWithDevTools } = require('redux-devtools-extension')
      return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
  }

const makeStore = () => createStore(allReducers,  bindMiddleware([thunkMiddleware]));
export const wrapper = createWrapper(makeStore, {debug: true});