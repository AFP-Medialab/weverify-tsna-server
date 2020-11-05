/**
 * Authentication Redux reducer function.
 */

import _ from "lodash";
import {HYDRATE} from 'next-redux-wrapper';


import { AUTH_USER_REGISTRATION_LOADING, AUTH_USER_REGISTRATION_SENT, AUTH_ACCESS_CODE_REQUEST_LOADING, AUTH_ACCESS_CODE_REQUEST_SENT, AUTH_USER_LOGIN_LOADING, AUTH_USER_LOGIN, AUTH_USER_LOGOUT, AUTH_TOKEN_INVALID, AUTH_TOKEN_REFRESHED, AUTH_USER_SESSION_EXPIRED } from "../actions/authentificationActions";

const defaultState = {
  userRegistrationLoading: false,
  userRegistrationSent: false,
  accessCodeRequestLoading: false,
  accessCodeRequestSent: false,
  userLoginLoading: false,
  userAuthenticated: false,
  accessToken: null,
  accessTokenExpiry: null,
  // user: null
  user: {
    id: null,
    firstName: null,
    lastName: null,
    email: null,
    roles: []
  }
};

/**
 * Authentication reducer.
 *
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
function authenticationReducer(state = defaultState, action) {
  switch (action.type) {
    case HYDRATE:
       state = action.payload;
       return state;  
    case AUTH_USER_REGISTRATION_LOADING:
      state.userRegistrationLoading = action.payload;
      return state;

    case AUTH_USER_REGISTRATION_SENT:
      state.userRegistrationLoading = false;
      state.userRegistrationSent = action.payload;
      return state;

    case AUTH_ACCESS_CODE_REQUEST_LOADING:
      state.accessCodeRequestLoading = action.payload;
      return state;

    case AUTH_ACCESS_CODE_REQUEST_SENT:
      state.accessCodeRequestLoading = false;
      state.accessCodeRequestSent = action.payload;
      return state;

    case AUTH_USER_LOGIN_LOADING:
      state.userLoginLoading = action.payload;
      return state;

    case AUTH_USER_LOGIN:
      // State user as logged in and add user authentication information.
      return {...state, 
        userLoginLoading:false, 
        userAuthenticated: true, 
        accessToken:action.payload.accessToken, 
        accessTokenExpiry: 
        action.payload.accessTokenExpiry, 
        user:action.payload.user
      };

    case AUTH_USER_LOGOUT:
      // State user as not logged and remove user authentication information.      
      return {...state, 
        userAuthenticated: false,
        accessToken: null,
        accessTokenExpiry: null,
        user:{
          id: null,
          firstName: null,
          lastName: null,
          email: null,
          roles: []
          }
        };

    case AUTH_TOKEN_INVALID:
      // TODO
      return state;

    case AUTH_TOKEN_REFRESHED:
      // TODO Make token compatible with redux-persist
      state.userAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.accessTokenExpiry = action.payload.accessTokenExpiry;
      // state.user = action.payload.user;
      _.merge(state.user, action.payload.user);
      return state;

    case AUTH_USER_SESSION_EXPIRED:
      // TODO
      state.userAuthenticated = false;
      state.accessToken = null;
      state.accessTokenExpiry = null;
      state.user = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        roles: []
      };
      return state;
    default:
      return state;
  }

  
};

export default authenticationReducer;
