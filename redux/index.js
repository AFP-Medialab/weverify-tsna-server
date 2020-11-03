import allReducers from "./reducers";
import { createWrapper } from "next-redux-wrapper";
import { createStore, applyMiddleware} from "redux";
import thunkMiddleware from 'redux-thunk'
import { useMemo } from 'react'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'

const bindMiddleware = (middleware) => {
    if (process.env.NODE_ENV !== 'production') {
      const { composeWithDevTools } = require('redux-devtools-extension')
      return composeWithDevTools(applyMiddleware(...middleware))
    }
    return applyMiddleware(...middleware)
  }
const loggerMiddleware = storeAPI => next => action => {
    console.log('dispatching', action)
    let result = next(action)
    console.log('next state', storeAPI.getState())
    return result
  }
  let store;

  const initState = {
    language: 'en',
    cookies: null,
    userSession: null
}; 

function initCookie(){
  
  if (typeof localStorage !== "undefined") {
    const serializedState = localStorage.getItem("state");
    if (serializedState) {
      return JSON.parse(decodeURIComponent(serializedState));
    }
  } 
  return initState;
}

const persistConfig = {
  key: "primary",
  storage,
  whitelist: ["language", "userSession"],  // place to select which state you want to persist
  timeout: 0
}
const persistedReducer = persistReducer(persistConfig, allReducers)

function makeStore(initialState = initState) {
  return createStore(
    persistedReducer,
    initialState,
    bindMiddleware([thunkMiddleware, loggerMiddleware])
  )
}
export const initializeStore = (preloadedState) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) store = _store

  return _store
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}