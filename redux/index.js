import allReducers from "./reducers";
import { applyMiddleware } from "redux";
import { configureStore, Tuple } from "@reduxjs/toolkit";
import { useMemo } from "react";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};
const loggerMiddleware = (storeAPI) => (next) => (action) => {
  let result = next(action);
  if (process.env.NODE_ENV !== "production") {
    //console.log("dispatching", action);
    //console.log("next state", storeAPI.getState());
  }
  return result;
};
let store;

const persistConfig = {
  key: "primary",
  storage,
  whitelist: ["language", "userSession"], // place to select which state you want to persist
  timeout: 0,
  stateReconciler: autoMergeLevel2,
};
const persistedReducer = persistReducer(persistConfig, allReducers);

function makeStore(initialState) {

  return configureStore({
    reducer: persistedReducer,
    initialState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(loggerMiddleware),
  })
}
export const initializeStore = (preloadedState) => {
  let _store = store ?? makeStore(preloadedState);

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === "undefined") return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState]);
  return store;
}
