import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = {
    languagesList: {},
    selectedLanguage: "en",
};

const languageSlice = createSlice ({
    name: "language",
    initialState,
    reducers: {
        changeLanguage: (state, action) => {
            state.selectedLanguage =  action.payload.lang;
        },
        loadLanguages(state, action) {
            state.languagesList = action.payload.languagesList;
        },
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

export const { changeLanguage, loadLanguages } = languageSlice.actions;

export default languageSlice.reducer;