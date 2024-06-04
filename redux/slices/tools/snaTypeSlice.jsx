import { createSlice } from "@reduxjs/toolkit";

const defaultState = {
    type : null,
    tsv: null,
    tsvInfo: null
};

const snaTypeSlice = createSlice({
    name: "snaType",
    initialState: defaultState,
    reducers: {
        snaTypeSet (state, action) {
            state.type = action.payload.type;
            state.tsv = action.payload.tsv;
            state.tsvInfo = action.payload.tsvInfo;
        },
        snaTypeCleaned (state, action) {
            state = defaultState;
        }
    }
})

export const { snaTypeSet, snaTypeCleaned } = snaTypeSlice.actions;
export default snaTypeSlice.reducer;