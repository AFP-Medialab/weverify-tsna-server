import { createSelector, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const defaultState = {
    userRegistrationLoading: false,
    userRegistrationSent: false,
    accessCodeRequestLoading: false,
    accessCodeRequestSent: false,
    userLoginLoading: false,
    userAuthenticated: false,
    accessToken: null,  
    accessTokenExpiry: null,
    refreshToken: null,
    // user: null
    user: {
      id: null,
      firstName: null,
      lastName: null,
      email: null,
      roles: [],
    }
};

const authentificationSlice = createSlice({
    name: "authentication",
    initialState: defaultState,
    reducers: {
        
        authUserRegistrationLoading (state, action) {
            state.userRegistrationLoading = action.payload;
        },

        authUserRegistrationSent (state, action) {
            state.userRegistrationLoading = false;
            state.userRegistrationSent = action.payload;
        },

        authAccessCodeRequestLoading (state, action) {
            state.accessCodeRequestLoading = action.payload;
        },

        authAccessCodeRequestSent (state, action) {
            state.accessCodeRequestLoading = false;
            state.accessCodeRequestSent = action.payload;
        },

        authUserLoginLoading (state, action) {
            state.userLoginLoading = action.payload;
        },

        authUserLoggedIn (state, action) {
            state.userLoginLoading = false;
            state.userAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.accessTokenExpiry = action.payload.tokenExpiry;
            state.refreshToken = action.payload.refreshToken;
            state.user = action.payload.userInfo;
        },

        authUserLoggedOut (state, action) {
            state.userAuthenticated = false;
            state.accessToken = null;
            state.accessTokenExpiry = null;
            state.refreshToken = null;
            state.user = {
                id: null,
                firstName: null,
                lastName: null,
                email: null,
                roles: []
            };
        },

        authTokenInvalid (state, payload) {
            //TODO
            
        },

        authTokenRefreshed (state, payload) {
            // TODO Make token compatible with redux-persist
            state.userAuthenticated = true;
            state.accessToken = action.payload.accessToken;
            state.accessTokenExpiry = action.payload.accessTokenExpiry;
            _.merge(state.user, action.payload.user);
        },

        authUserSessionExpired (state, payload) {
            state.userAuthenticated = false;
            state.accessToken = null;
            state.accessTokenExpiry = null;
            state.refreshToken = null;
            state.user = {
                id: null,
                firstName: null,
                lastName: null,
                email: null,
                roles: []
            };
        }
    },
    extraReducers: builder => {
        builder.addCase (HYDRATE, (state, action) => {
            state = {
                ...state,
                ...action.payload
            };
        })
    },
})


export const { authUserRegistrationLoading, 
    authUserRegistrationSent, 
    authAccessCodeRequestLoading, 
    authAccessCodeRequestSent, 
    authUserLoginLoading, 
    authUserLoggedIn, 
    authUserLoggedOut, 
    authTokenInvalid, 
    authTokenRefreshed, 
    authUserSessionExpired } = authentificationSlice.actions;

//export const { selectUserAuthentificated } = authentificationSlice.selectors; 

export default authentificationSlice.reducer;