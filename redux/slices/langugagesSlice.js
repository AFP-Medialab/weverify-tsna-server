import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const languageSlice = createSlice ({
    name: "language",
    initialState: "en",
    reducers: {
        changeLanguage: (state, action) => {
            return action.payload;
        },
    },
    extraReducers: builder => {
        builder.addCase (HYDRATE, (state, action) => {
            state = {
                ...state,
                ...action.payload.category
            };
        })
    },
})

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;