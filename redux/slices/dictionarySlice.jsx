import { createSlice } from "@reduxjs/toolkit";
import {HYDRATE} from 'next-redux-wrapper';

const dictionarySlice = createSlice ({
    name: "dictionary",
    initialState: {},
    reducers: {
        dictionarySet (state, action) {
            state = action.payload;
        },
        dictionaryElementAdded (state, action) {
            state[action.payload.label] = action.payload.json;
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
export const { dictionarySet, dictionaryElementAdded } = dictionarySlice.actions;
export default dictionarySlice.reducer;