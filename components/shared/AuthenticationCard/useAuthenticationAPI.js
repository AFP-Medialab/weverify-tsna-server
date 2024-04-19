/**
 * Authentication API hook.
 */

import axios from "axios";
import _ from "lodash";


import { ERR_AUTH_INVALID_PARAMS, 
  ERR_AUTH_BAD_REQUEST, 
  ERR_AUTH_SERVER_ERROR, 
  ERR_AUTH_UNKNOWN_ERROR, 
  ERR_AUTH_INVALID_TOKEN, 
  ERR_AUTH_INVALID_CREDENTIALS, 
  ERR_AUTH_INVALID_USER_STATE, 
  ERR_AUTH_USER_EXPIRED, 
  ERR_AUTH_SESSION_EXPIRED, 
  ERR_AUTH_ABORT_ERROR } from "./authenticationErrors";

import { useDispatch, useSelector } from "react-redux";

import { decodeJWTToken } from "./userAuthenticationUtils";
import getConfig from 'next/config';
import { authAccessCodeRequestLoading, authAccessCodeRequestSent, authTokenRefreshed, authUserLoggedIn, authUserLoggedOut, authUserLoginLoading, authUserRegistrationLoading, authUserRegistrationSent, authUserSessionExpired, selectUserAuthentificated, selectUserSession } from "../../../redux/slices/authentificationSlice";
const { publicRuntimeConfig } = getConfig();

/**
 * Authentication API hook.
 *
 * @returns
 */
export default function useAuthenticationAPI() {

  // Global REST client parameters
  const defaultTimeout = 5000;
  const loginTimeout = 30000;
  const jsonContentType = "application/json";
  const textContentType = "text/plain";

  // Services URL
  const AUTH_SRV_REGISTER_USER_URL = `${publicRuntimeConfig.baseFolder}/api/wrapper/auth/registration`;
  const AUTH_SRV_REQUEST_ACCESS_CODE_URL = `${publicRuntimeConfig.baseFolder}/api/wrapper/auth/accesscode`;
  const AUTH_SRV_LOGIN_URL = `${publicRuntimeConfig.baseFolder}/api/wrapper/auth/login`;
  //const AUTH_SRV_LOGOUT_URL = "/logout";
  const AUTH_SRV_REFRESH_TOKEN_URL = `${publicRuntimeConfig.baseFolder}/api/wrapper/auth/refreshtoken`;

  const dispatch = useDispatch();

  // Default language
  const lang = useSelector(state => state.language);

  /**
   * Register a new user to services.
   *
   * @param {Object} request
   * @returns {Promise<Object>} Result as a Promise.
   */
  const registerUser = (request) => {
    if (_.isEmpty(request)) {
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_PARAMS,
          message: "Empty request argument"
        }
      });
    }

    // Service request
    const srvRequest = {
      email: request.email,
      firstName: request.firstName,
      lastName: request.lastName,
      organization: request.organization,
      organizationRole: request.organizationRole,
      organizationRoleOther: request.organizationRoleOther,
      preferredLanguages: request.preferredLanguages || [lang],
      timezone: request.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    // Make service call
    dispatch(authUserRegistrationLoading(true));
    return axios.post(AUTH_SRV_REGISTER_USER_URL, srvRequest, {
      timeout: defaultTimeout
    }).then(response => {
      dispatch(authUserRegistrationSent(true));
      return Promise.resolve({
        status: response.status
      });
    }, error => {
      dispatch(authUserRegistrationLoading(false));
      if (error.response) {
        if (error.response.status === 400) {
          return Promise.reject({
            error: {
              code: ERR_AUTH_BAD_REQUEST,
              message: error.response.data
            }
          });
        }
        return Promise.reject({
          error: {
            code: ERR_AUTH_SERVER_ERROR,
            message: error.response.data
          }
        });
      }
      return Promise.reject({
        error: {
          code: ERR_AUTH_UNKNOWN_ERROR,
          message: error.message
        }
      });
    });
  };

  /**
   * Request an access code to the service.
   *
   * @param {Object} request
   * @returns {Promise<Object>} Result as a Promise.
   */
  const requestAccessCode = (request) => {
    if (_.isEmpty(request)) {
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_PARAMS,
          message: "Empty request argument"
        }
      });
    }

    // Service request
    const srvRequest = {
      email: request.email
    };

    // Call service
    dispatch(authAccessCodeRequestLoading(true));
    return axios.post(AUTH_SRV_REQUEST_ACCESS_CODE_URL, srvRequest, {
      timeout: defaultTimeout
    }).then(response => {
      dispatch(authAccessCodeRequestSent(true));
      return Promise.resolve({
        status: response.status
      });
    }, error => {
      dispatch(authAccessCodeRequestLoading(false));
      if (error.response) {
        if (error.response.status === 400) {
          return Promise.reject({
            error: {
              code: ERR_AUTH_BAD_REQUEST,
              message: error.response.data
            }
          });
        }
        return Promise.reject({
          error: {
            code: ERR_AUTH_SERVER_ERROR,
            message: error.response.data
          }
        });
      }
      return Promise.reject({
        error: {
          code: ERR_AUTH_UNKNOWN_ERROR,
          message: error.message
        }
      });
    });
  };

  /**
   * Login user using it's access code.
   *
   * @param {Object} request
   * @returns {Promise<Object>} Result as a Promise.
   */
  const login = (request) => {
    if (_.isEmpty(request)) {
      return Promise.reject({
        error: {
          code: ERR_AUTH_INVALID_PARAMS,
          message: "Empty request argument"
        }
      });
    }

    // Service request
    const srvRequest = {
      code: request.accessCode
    };

    // Call service
    dispatch(authUserLoginLoading(true));
    return axios.post(AUTH_SRV_LOGIN_URL, srvRequest, {
      headers: {
        ContentType: jsonContentType
      },
      timeout: loginTimeout
    }).then(response => {
      const accessToken = response.data.token;
      const refreshToken = response.data.refreshToken;
      const userInfo = response.data.user;
      // Decode JWT token
      try {
        const tokenContent = decodeJWTToken(accessToken);
        _.merge(userInfo, tokenContent.user);
        console.log(userInfo);
        dispatch(authUserLoggedIn({accessToken, tokenExpiry: tokenContent.accessTokenExpiry, refreshToken, userInfo}));
        console.log("dispatched the login");
        return Promise.resolve({
          status: response.status,
          data: {
            accessToken: accessToken,
            accessTokenExpiry: tokenContent.accessTokenExpiry,
            refreshToken: refreshToken,
            user: userInfo
          }
        });
      } catch (jwtError) {
        dispatch(authUserLoginLoading(false));
        // Invalid token
        return Promise.reject({
          error: {
            code: ERR_AUTH_INVALID_TOKEN,
            message: jwtError.message
          }
        });
      }
    }, error => {
      // console.log("Error calling loggin service: ", error);
      dispatch(authUserLoginLoading(false));
      if (error.response) {
        switch (error.response.status) {
          case 400:
            // Invalid request data
            return Promise.reject({
              error: {
                code: ERR_AUTH_BAD_REQUEST,
                message: error.response.data
              }
            });
          case 403:
            // Invalid credentials (access code)
            return Promise.reject({
              error: {
                code: ERR_AUTH_INVALID_CREDENTIALS,
                message: error.response.data
              }
            });
          case 409:
            // User's state prevent login
            return Promise.reject({
              error: {
                code: ERR_AUTH_INVALID_USER_STATE,
                message: error.response.data
              }
            });
          case 410:
            // User account expired
            return Promise.reject({
              error: {
                code: ERR_AUTH_USER_EXPIRED,
                message: error.response.data
              }
            });
          default:
            // Unknown error
            return Promise.reject({
              error: {
                code: ERR_AUTH_UNKNOWN_ERROR,
                message: error.response.data
              }
            });
        }
      } else if (error.code && error.code === "ECONNABORTED") {
        // Timeout or abort error
        return Promise.reject({
          error: {
            code: ERR_AUTH_ABORT_ERROR,
            message: error.message
          }
        });
      }
      return Promise.reject({
        error: {
          code: ERR_AUTH_UNKNOWN_ERROR,
          message: error.message
        }
      });
    });
  };

  /**
   * Logout current user.
   *
   * @returns {Promise<Object>} Result as a Promise.
   */
  const logout = () => {
    // TODO: logout on authentication server to invalidate token and refresh token
    dispatch(authUserLoggedOut());
    return Promise.resolve();
  };

  /**
   * Refresh the JWT access token.
   *
   * @returns {Promise<Object>} Result as a Promise.
   */
  const refreshToken = (refreshToken) => {
    return axios.post(AUTH_SRV_REFRESH_TOKEN_URL, refreshToken, {
       headers: {
         "Content-Type": textContentType
       },
      // timeout: defaultTimeout
      timeout: 10000
    }).then(response => {
      const accessToken = response.data.token;
      
      // Decode JWT token
      try {
        const tokenContent = decodeJWTToken(accessToken);
        dispatch(authTokenRefreshed(accessToken, tokenContent.accessTokenExpiry, tokenContent.user));
        return Promise.resolve({
          status: response.status,
          data: {
            accessToken: accessToken,
            accessTokenExpiry: tokenContent.accessTokenExpiry,
            user: tokenContent.user
          }
        });
      } catch (jwtError) {
        // Invalid token
        dispatch(authUserSessionExpired());
        return Promise.reject({
          error: {
            code: ERR_AUTH_INVALID_TOKEN,
            message: jwtError.message
          }
        });
      }
    }, error => {
      // Logout user
      dispatch(authUserSessionExpired());
      // Reject with error
      if (error.response) {
        switch (error.response.status) {
          case 400:
            // Invalid request data
            return Promise.reject({
              error: {
                code: ERR_AUTH_BAD_REQUEST,
                message: error.response.data
              }
            });
          case 401:
            // Invalid or expired refresh token
            return Promise.reject({
              error: {
                code: ERR_AUTH_SESSION_EXPIRED,
                message: error.response.data
              }
            });
          default:
            // Unknown error
            return Promise.reject({
              error: {
                code: ERR_AUTH_UNKNOWN_ERROR,
                message: error.response.data
              }
            });
        }
      }
      return Promise.reject({
        error: {
          code: ERR_AUTH_UNKNOWN_ERROR,
          message: error.message
        }
      });
    });
  };

  return {
    registerUser,
    requestAccessCode,
    login,
    logout,
    refreshToken
  };
};
